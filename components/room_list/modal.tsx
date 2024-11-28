import useClothes from "@/hooks/useClothes";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/lib/supabase"; // supabase 추가
import { Database } from "@/lib/supabase_type";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated, // Alert 추가
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

type Room = Database["public"]["Tables"]["rooms"]["Row"];

type RoomDetailModalProps = {
  visible: boolean;
  room: Room | null;
  onClose: () => void;
  onJoin: () => void;
};

const { height } = Dimensions.get("window");

export default function RoomDetailModal({
  visible,
  room,
  onClose,
  onJoin,
}: RoomDetailModalProps) {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [userInput, setUserInput] = useState("");
  const { updateClothes, loading, error } = useClothes();
  const { user } = useUser();
  const [currentParty, setCurrentParty] = useState<string | null>(null); // 추가

  // current_party를 확인하는 useEffect 추가
  useEffect(() => {
    const fetchUserParty = async () => {
      if (user?.id) {
        const { data, error } = await supabase
          .from("users")
          .select("current_party")
          .eq("user_id", user.id)
          .single();

        if (data) {
          setCurrentParty(data.current_party);
        }
      }
    };

    fetchUserParty();
  }, [user]);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleJoin = async () => {
    if (!room || !userInput.trim()) return;

    try {
      const result = await updateClothes(user?.id, userInput.trim());
      if (result) {
        onJoin();
      } else {
        console.error("Failed to update clothes");
      }
    } catch (err) {
      console.error("Error during join:", err);
    }
  };

  if (!room) return null;

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      animationType="none"
    >
      <View style={modalStyles.container}>
        <Animated.View
          style={[
            modalStyles.backdrop,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={modalStyles.backdropTouchable} />
          </TouchableWithoutFeedback>
        </Animated.View>

        <Animated.View
          style={[
            modalStyles.modalContent,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={modalStyles.handleBar} />
          <Text style={modalStyles.modalName}>🏠 {room.room_name}</Text>

          <View style={modalStyles.headerSection}>
            <Text style={modalStyles.modalTime}>
              <Text style={modalStyles.labelText}>출발 시각: </Text>
              <Text style={modalStyles.timeText}>
                {new Date(room.departure_time)
                  .getHours()
                  .toString()
                  .padStart(2, "0")}
                :
                {new Date(room.departure_time)
                  .getMinutes()
                  .toString()
                  .padStart(2, "0")}
              </Text>
            </Text>
            <Text style={modalStyles.modalMembers}>
              <Text style={modalStyles.labelText}>인원: </Text>
              <Text style={modalStyles.timeText}>
                {room.users ? room.users.length : 0}/{room.limit_people}
              </Text>
            </Text>
          </View>

          <View style={modalStyles.divider} />

          <View style={modalStyles.messageContainer}>
            <Text style={modalStyles.detailText}>만남의 장소</Text>
            <Text style={modalStyles.messageText}>{room.details}</Text>
          </View>
          <View style={modalStyles.messageContainer}>
            <Text style={modalStyles.detailText}> 자신의 옷차림</Text>
            <TextInput
              style={modalStyles.inputField}
              placeholder="서로를 알아볼 수 있도록 자세히 입력해주세요."
              value={userInput}
              onChangeText={setUserInput}
              editable={!currentParty} // 추가
            />
          </View>

          <TouchableOpacity
            style={[
              modalStyles.joinButton,
              { backgroundColor: userInput.trim() ? "#6049E2" : "#CCCCCC" },
            ]}
            onPress={handleJoin}
            activeOpacity={userInput.trim() ? 0.8 : 1}
            disabled={!userInput.trim() || loading}
          >
            <Text style={modalStyles.joinButtonText}>
              {currentParty
                ? "이미 참여 중인 방이 있습니다"
                : loading
                  ? "처리 중..."
                  : "참가 하기"}
            </Text>
          </TouchableOpacity>
          {error && <Text style={{ color: "red" }}>{error}</Text>}
        </Animated.View>
      </View>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  backdropTouchable: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 25,
    height: height * 0.55,
    width: "100%",
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  modalName: {
    fontSize: 20,
    fontWeight: "600",
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: "5%",
    marginTop: "3%",
  },
  modalTime: {
    fontSize: 20,
    color: "#000000",
  },
  modalMembers: {
    fontSize: 20,
    color: "#000000",
  },
  labelText: {
    fontSize: 20,
    fontWeight: "400", // 얇은 글꼴
    color: "#000000",
  },
  timeText: {
    fontWeight: "600", // 굵은 글꼴
    color: "#000000",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: "5%",
  },
  messageContainer: {},
  detailText: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    color: "#000000",
  },
  messageText: {
    fontSize: 18,
    color: "#666666",
    lineHeight: 20,
    height: 60,
  },
  joinButton: {
    backgroundColor: "#6049E2",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 20,
  },
  inputField: {
    borderColor: "#CCCCCC",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16, // 참가하기 버튼과 간격 조정
    fontSize: 16,
    color: "#333333",
  },
  joinButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
