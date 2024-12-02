import { userDataState } from "@/atoms/userDataState";
import { useUserData } from "@/hooks/useUserData";
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
import { useRecoilValue } from "recoil";

type Room = Database["public"]["Tables"]["rooms"]["Row"];

type RoomDetailModalProps = {
  visible: boolean;
  room: Room | null;
  onClose: () => void;
  onJoin: () => void;
};

/**
 * RoomDetailModal 컴포넌트
 *
 * - 방 상세 정보를 표시하고, 방에 참가할 수 있는 모달창을 표시합니다.
 * - '참가하기' 버튼을 누르면 방에 참가합니다.
 */
export default function RoomDetailModal({
  visible,
  room,
  onClose,
  onJoin,
}: RoomDetailModalProps) {
  // 화면 높이 가져오기
  const { height } = Dimensions.get("window");

  // 애니메이션을 위한 변수
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // 사용자 입력값
  const [userInput, setUserInput] = useState("");
  const userData = useRecoilValue(userDataState);
  const { updateClothes } = useUserData();

  useEffect(() => {
    // 보여줄 때 애니메이션
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
      // 숨길 때 애니메이션
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
  }, [fadeAnim, height, slideAnim, visible]);

  const handleJoin = async () => {
    // 들어가는 방의 정보가 없거나 입력값이 없으면 함수를 종료합니다.
    if (!room || !userInput.trim()) return;

    try {
      if (!userData?.user_id) {
        throw new Error("User ID not found");
      }
      // 업데이트가 성공하면 onJoin을 호출하여 방에 참가합니다.
      updateClothes(userInput.trim()).then(() => onJoin());
    } catch (err) {
      console.error("Error during join:", err);
    }
  };

  if (!room) return null;

  const 버튼활성화 = Boolean(!userData?.current_party && userInput.trim());

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      animationType="none"
    >
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.backdropTouchable} />
          </TouchableWithoutFeedback>
        </Animated.View>

        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.handleBar} />
          <Text style={styles.modalName}>🏠 {room.room_name}</Text>

          <View style={styles.headerSection}>
            <Text style={styles.modalTime}>
              <Text style={styles.labelText}>출발 시각: </Text>
              <Text style={styles.timeText}>
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
            <Text style={styles.modalMembers}>
              <Text style={styles.labelText}>인원: </Text>
              <Text style={styles.timeText}>
                {room.users ? room.users.length : 0}/{room.limit_people}
              </Text>
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.messageContainer}>
            <Text style={styles.detailText}>만남의 장소</Text>
            <Text style={styles.messageText}>{room.details}</Text>
          </View>
          <View style={styles.messageContainer}>
            <Text style={styles.detailText}> 자신의 옷차림</Text>
            <TextInput
              style={styles.inputField}
              placeholder="서로를 알아볼 수 있도록 자세히 입력해주세요."
              value={userInput}
              onChangeText={setUserInput}
              editable={true}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.joinButton,
              {
                backgroundColor: 버튼활성화 ? "#6049E2" : "#CCCCCC",
              },
            ]}
            onPress={handleJoin}
            // 활성화 여부에 따라 투명도 조절
            activeOpacity={버튼활성화 ? 1 : 0.8}
            // userInput의 텍스트가 있고, 이미 참여 중인 방이 없을 때만 버튼 활성화
            disabled={!버튼활성화}
          >
            <Text style={styles.joinButtonText}>
              {userData?.current_party
                ? "이미 참여 중인 방이 있습니다"
                : "참가하기"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
