import Departure from "@/components/my_party/departure";
import Destination from "@/components/my_party/destination";
import Details from "@/components/my_party/details";
import NumPeople from "@/components/my_party/num_people";
import { PartyHeader } from "@/components/my_party/party_header";
import { Separator } from "@/components/my_party/separator";
import Time from "@/components/my_party/time";
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
  const [loading, setLoading] = useState(true);

  // 포커스가 맞춰졌을 때 방 정보를 가져옴
  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        setLoading(true);
        await fetchRoomDetails();
        setLoading(false);
      }
      fetchData();
    }, []),
  );

  // 로딩 중일 때
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>로딩 중...</Text>
      </View>
    );
  }

  // 방 정보가 없을 때
  if (!room) {
    return (
      <View style={styles.background}>
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

  // 방 정보가 있을 때
  return (
    <View style={styles.background}>
      <View style={styles.container}>
        {/* 번호 */}
        <PartyHeader id={String(room.created_at.slice(-10, -6))} />

        {/* 시간 정보 */}
        <View style={styles.timeBox}>
          <Time date={new Date(room.departure_time)} />
        </View>
        {/* 경로 정보 */}
        <View style={styles.routeBox}>
          <Departure location={room.origin} />
          <Destination location={room.destination} />
        </View>
        {/* 인원수 정보 */}
        <View style={styles.numPeople}>
          <NumPeople
            current={room.users ? room.users.length : 0}
            max={room.limit_people}
          />
        </View>
        {/* 만남의 장소 */}
        <View style={styles.details}>
          <Details text={room.details} />
        </View>
        {/* 구분선 */}
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <Separator />
        </View>
        {/* 버튼 영역 */}
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
          <TouchableOpacity style={styles.iconButton} onPress={handleLeaveRoom}>
            <Ionicons name="exit-outline" size={32} color="#666666" />
            <Text style={styles.iconButtonText}>나가기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#6049E2",
  },
  container: {
    flex: 1,
    margin: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    // 자식 요소가 부모의 경계선을 넘지 않도록 설정
    overflow: "hidden",
    gap: 10,
  },
  timeBox: {
    marginHorizontal: 20,
  },
  routeBox: {
    flexDirection: "row",
    marginHorizontal: 20,
    gap: 20,
  },
  numPeople: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginHorizontal: 20,
  },
  details: {
    padding: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    margin: 20,
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
