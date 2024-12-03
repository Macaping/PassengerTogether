import {
  departureState,
  destinationState,
  fromDateState,
} from "@/atoms/routeState";
import Header from "@/components/room_list/header";
import List from "@/components/room_list/list";
import RoomDetailModal from "@/components/room_list/modal";
import { useRoomList } from "@/hooks/useRoomList";
import { Database } from "@/lib/supabase_type";
import JoinRoom from "@/services/join_room";
import { router } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import { useRecoilValue } from "recoil";

/**
 * RoomListView 페이지
 *
 * - 방 목록을 조회하고 표시하는 화면입니다.
 * - 사용자가 방을 선택하면 상세 정보 모달이 열리며, 방에 참가할 수 있습니다.
 *
 * 주요 기능:
 * 1. `useRoomList` 훅을 통해 실시간으로 방 목록을 가져옵니다.
 * 2. 사용자로부터 받은 출발지, 도착지, 날짜를 기반으로 방 목록을 필터링합니다.
 * 3. 방 목록이 없을 경우 적절한 안내 메시지를 표시합니다.
 * 4. 사용자가 방을 선택하면 모달을 통해 상세 정보를 확인하고 방에 참가할 수 있습니다.
 *
 * @returns {React.ReactElement} 방 목록 화면 UI.
 */
export default function RoomListView() {
  const departure = useRecoilValue(departureState);
  const destination = useRecoilValue(destinationState);
  const fromDate = useRecoilValue(fromDateState);

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null); // 선택된 방 정보 상태
  const [modalVisible, setModalVisible] = useState(false); // 모달 표시 상태

  // 출발지, 도착지, 날짜를 기준으로 실시간 방 목록 조회
  const { loading, roomList } = useRoomList({
    departure: departure,
    destination: destination,
    date: fromDate,
  });

  if (loading) {
    // 로딩 중일 때 로딩 인디케이터 표시
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!roomList) {
    // 방 목록이 없을 때 안내 메시지 표시
    return (
      <View style={styles.container}>
        <Text>
          방 목록을 조회할 조건이 없습니다. 방 탐색 버튼을 통해 이동해주세요.
        </Text>
      </View>
    );
  }

  type Room = Database["public"]["Tables"]["rooms"]["Row"];

  /**
   * 방을 선택했을 때 실행되는 함수
   * - 선택된 방 정보를 상태로 설정하고 모달을 표시합니다.
   *
   * @param {Room} room - 선택된 방 정보
   */
  const handleRoomPress = (room: Room) => {
    setSelectedRoom(room);
    setModalVisible(true);
  };

  /**
   * 방에 참가했을 때 실행되는 함수
   * - 참가 후 방 상세 화면으로 이동합니다.
   *
   * @param {Room} room - 참가할 방 정보
   */
  const handleJoinRoom = (room: Room) => {
    if (!room) return;

    // 최대 인원 확인
    const currentUsers = room.users ? room.users.length : 0; // 현재 인원
    const maxUsers = room.limit_people || 4; // 최대 인원 (기본값: 4)

    if (currentUsers >= maxUsers) {
      // 방 정원이 가득 찬 경우 경고 메시지 표시
      Alert.alert(
        "참가 불가",
        "이 방은 이미 정원이 가득 찼습니다. 다른 방을 선택해주세요.",
      );
      return;
    }

    JoinRoom(room.id)
      .then(() => router.replace("/(tabs)/RoomDetail")) // 방 참가 후 상세 화면으로 이동
      .catch((error) => console.error(error))
      .finally(() => setModalVisible(false)); // 모달 닫기
  };

  return (
    <View style={styles.container}>
      {/* 화면 상단 헤더 */}
      <Header />

      {/* 방 목록 헤더 */}
      <View style={listStyles.indexContainer}>
        <Text style={listStyles.indexText}>출발 시각</Text>
        <Text style={listStyles.indexText}>방 내용</Text>
        <Text style={listStyles.indexText}>인원수</Text>
      </View>

      {/* 방 상세 정보 모달 */}
      <RoomDetailModal
        visible={modalVisible}
        room={selectedRoom}
        onClose={() => setModalVisible(false)}
        onJoin={() => selectedRoom && handleJoinRoom(selectedRoom)}
      />

      {/* 방 목록 */}
      <View style={listStyles.Container}>
        <List roomList={roomList} handleRoomPress={handleRoomPress} />
      </View>
    </View>
  );
}

/**
 * 스타일 정의
 */
const styles = StyleSheet.create({
  // 화면 전체 컨테이너
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
});

const listStyles = StyleSheet.create({
  // 방 목록 컨테이너
  Container: {
    flex: 1,
  },
  // 방 목록 헤더 스타일
  indexContainer: {
    flexDirection: "row",
    justifyContent: "space-around", // 헤더 텍스트 간격 조정
    paddingTop: "1%",
    paddingBottom: "1%",
  },
  indexText: {
    color: "#747474", // 헤더 텍스트 색상
  },
});
