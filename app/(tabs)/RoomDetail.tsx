import { Separator } from "@/components/room_details/separator";
import useUserDataManagement from "@/hooks/userDataManagement";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { PostgrestSingleResponse, UserResponse } from "@supabase/supabase-js";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function RoomDetailView() {
  const { room, fetchRoomDetails } = useUserDataManagement();
  const [isLoading, setIsLoading] = useState(true);
  useFocusEffect(
    useCallback(() => {
      const loadRoomDetails = async () => {
        setIsLoading(true);
        await fetchRoomDetails();
        setIsLoading(false);
      };

      loadRoomDetails();
    }, []),
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>로딩 중...</Text>
      </View>
    );
  }

  if (!room) {
    return (
      <View style={styles.container}>
        <View style={styles.centeredMessageContainer}>
          <Text style={styles.centeredMessageText}>
            현재 참여한 방이 없습니다.
          </Text>
        </View>
      </View>
    );
  }

  const handleLeaveRoom = async () => {
    supabase.auth
      .getUser()
      // 사용자 정보 가져오기
      .then((value: UserResponse) => {
        if (value.error) throw value.error;
        return value.data.user.id;
      })
      // 사용자를 방에서 나가게 하기
      .then((userId: string) => {
        supabase
          .from("users")
          .update({ current_party: null })
          .eq("user_id", userId)
          .then((value: PostgrestSingleResponse<null>) => {
            if (value.error) throw value.error;
            return value.data;
          });
      })
      // 처음 페이지로 이동
      .then(() => router.dismissAll())
      // 오류 처리
      .catch((error: Error) => {
        console.error("사용자 정보 가져오기 오류:", error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.ticketContainer}>
        <View style={styles.ticketHeader}>
          <Text style={styles.ticketId}>{room.created_at.slice(-10, -6)}</Text>
        </View>
        <View style={styles.mainContent}>
          {/* 1. 시간 정보 */}
          <View style={styles.timeContainer}>
            <Text style={styles.Label}>출발 시각</Text>
            <Text style={styles.timeValue}>
              {`${new Date(room.departure_time).getMonth() + 1}월 ${new Date(room.departure_time).getDate()}일 (${["일", "월", "화", "수", "목", "금", "토"][new Date(room.departure_time).getDay()]}) ${String(new Date(room.departure_time).getHours()).padStart(2, "0")}:${String(new Date(room.departure_time).getMinutes()).padStart(2, "0")}`}
            </Text>
          </View>
          {/* 2. 경로 정보 */}
          <View style={styles.routeSection}>
            <View>
              <Text style={styles.Label}>출발</Text>
              <Text style={styles.routeValue}>{room.origin}</Text>
            </View>
            <View>
              <Text style={styles.Label}>도착</Text>
              <Text style={styles.routeValue}>{room.destination}</Text>
            </View>
          </View>
          {/* 3. 인원수 정보 */}
          <View style={styles.passengerSection}>
            <Text style={styles.Label}>인원수</Text>
            <Text style={styles.passengerCount}>
              {room.users ? room.users.length : 0}/{room.limit_people}
            </Text>
          </View>
          {/* 4. 장소 정보 */}
          <View style={styles.placeSection}>
            <Text style={styles.Label}>만남의 장소</Text>
            <Text style={styles.detailsText}>
              상세사항으로 받은 데이터를 만남의장소와 옷차림으로 쪼개서 db로
              받고 글자수 제한 필요어디까지 받을건지 확인 필요 3줄 정도만
            </Text>
          </View>
        </View>

        {/* 5. 구분선 */}
        <Separator />
        <View style={styles.bottomContent}>
          {/* 6. 버튼 영역 */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons
                name="chatbubble-outline"
                size={32}
                onPress={() => router.push("/Chat")}
              />
              <Text style={styles.iconButtonText}>채팅</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="people-outline" size={32} color="#666666" />
              <Text style={styles.iconButtonText}>동승자</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleLeaveRoom}
            >
              <Ionicons name="exit-outline" size={32} color="#666666" />
              <Text style={styles.iconButtonText}>나가기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6049E2",
    alignItems: "center",
  },
  mainContent: {
    flex: 4,
  },
  bottomContent: {
    flex: 1,
    justifyContent: "center",
    marginTop: "auto",
    width: "100%",
  },
  ticketContainer: {
    width: "90%",
    height: "85%",
    padding: "3%",
    borderRadius: width * 0.05,
    backgroundColor: "#fff",
    position: "relative",
  },
  ticketHeader: {
    backgroundColor: "#EAE5FE",
    borderTopLeftRadius: width * 0.05,
    borderTopRightRadius: width * 0.05,
    justifyContent: "center",
    height: "8%",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  ticketId: {
    fontSize: 25,
    marginLeft: "3%",
    color: "#333",
  },
  timeContainer: {
    marginTop: "15%",
    marginBottom: "5%",
  },
  timeValue: {
    fontSize: 25,
    color: "#000000",
  },
  routeSection: {
    flexDirection: "row",
    marginBottom: "5%",
    justifyContent: "space-between",
  },
  routeValue: {
    fontSize: 30,
    fontWeight: "600",
    color: "#000000",
  },
  passengerSection: {
    alignItems: "flex-end",
    marginBottom: "5%",
  },
  Label: {
    fontSize: 20,
    color: "#6F6F6F",
    marginBottom: "0.5%",
  },
  passengerCount: {
    fontSize: 25,
    color: "#000000",
  },
  placeSection: {
    height: "18%",
  },
  detailsText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  iconButton: {
    alignItems: "center",
  },
  iconButtonText: {
    marginTop: 8,
    fontSize: 14,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e0f0ff",
  },
  loadingText: {
    fontSize: width * 0.05,
    color: "#333",
    textAlign: "center",
    marginTop: 10,
  },
  centeredMessageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredMessageText: {
    fontSize: width * 0.05,
    color: "#333",
    textAlign: "center",
  },
});
