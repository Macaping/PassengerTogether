import Header from "@/components/room_list/header";
import List from "@/components/room_list/list";
import RoomDetailModal from "@/components/room_list/modal";
import { useRoomList } from "@/hooks/useRoomList";
import { Database } from "@/lib/supabase_type";
import JoinRoom from "@/services/join_room";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function RoomListView() {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // href에서 넘겨준 파라미터를 가져옵니다.
  const {
    departure = "출발지",
    destination = "도착지",
    date = new Date(),
  } = useLocalSearchParams() as unknown as {
    departure: string;
    destination: string;
    date: Date;
  };

  // 출발지, 도착지, 기준 시간을 파라미터로 실시간으로 방 목록을 조회합니다.
  const { loading, roomList } = useRoomList({ departure, destination, date });

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // 방이 없을 경우
  if (!roomList) {
    return (
      <View style={styles.container}>
        <Text>
          방 목록을 조회할 조건이 없습니다. 방 탐색 버튼을 통해 이동해주세요.
        </Text>
      </View>
    );
  }

  // 방이 있는 경우

  type Room = Database["public"]["Tables"]["rooms"]["Row"];

  const handleRoomPress = (room: Room) => {
    setSelectedRoom(room);
    setModalVisible(true);
  };

  const handleJoinRoom = (room: Room) => {
    if (!room) return;
    JoinRoom(room.id)
      .then(() => router.replace("/(tabs)/RoomDetail"))
      .catch((error) => console.error(error))
      .finally(() => setModalVisible(false));
  };

  return (
    <View style={styles.container}>
      {/* Header 컴포넌트를 사용하여 화면 상단에 제목과 부제목을 표시합니다. */}
      <Header origin={departure} destination={destination} date={date} />
      {/* FlatList 컴포넌트를 사용하여 방 목록을 표시합니다. */}
      <View style={listStyles.indexContainer}>
        <Text style={listStyles.indexText}>출발 시각</Text>
        <Text style={listStyles.indexText}>방 내용</Text>
        <Text style={listStyles.indexText}>인원수</Text>

        <RoomDetailModal
          visible={modalVisible}
          room={selectedRoom}
          onClose={() => setModalVisible(false)}
          // 선택된 방이 있고 참가 버튼을 누르면 참가합니다.
          onJoin={() => selectedRoom && handleJoinRoom(selectedRoom)}
        />
      </View>
      <View style={styles.container}>
        <View style={listStyles.columnCrossline} />
        <View style={listStyles.Container}>
          <List roomList={roomList} handleRoomPress={handleRoomPress} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
});

const listStyles = StyleSheet.create({
  Container: {
    flex: 1,
  },

  indexContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: "1%",
    // borderBottomWidth: 1,
    paddingBottom: "1%",
  },
  indexText: {
    color: "#747474",
  },
  columnCrossline: {
    position: "absolute",
    borderLeftWidth: 2,
    borderLeftColor: "#6049E2",
    top: "1%",
    left: "17%",
    height: "100%",
  },
});
