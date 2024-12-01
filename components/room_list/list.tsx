import { Database } from "@/lib/supabase_type";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import Item from "./items";

type Room = Database["public"]["Tables"]["rooms"]["Row"];

/**
 * RoomList 컴포넌트
 */
export default function List({
  roomList,
  handleRoomPress,
}: {
  roomList: Room[];
  handleRoomPress: (room: Room) => void;
}) {
  return (
    <>
      <View style={listStyles.columnCrossline} />
      <FlatList
        data={roomList}
        // 컴포넌트 자체의 스타일을 정의합니다.
        style={listStyles.listContainer}
        // 아이템들을 구분할 구분선을 정의합니다.
        ItemSeparatorComponent={() => <View style={listStyles.separator} />}
        // 내용물 컨테이너의 스타일을 정의합니다.
        contentContainerStyle={listStyles.contentContainer}
        renderItem={({ item }) => (
          // Item 컴포넌트에 전달할 props를 정의합니다.
          <Item
            created_at={item.created_at}
            departure_time={
              item.departure_time ? new Date(item.departure_time) : new Date()
            }
            limit_people={item.limit_people ?? 0}
            users={item.users ?? []}
            status={item.status}
            onPress={() => handleRoomPress(item)}
            // 방 이름이 없을 경우, 방 생성 시간을 사용합니다.
            room_name={
              item.room_name ??
              (item.room_name || item.created_at.slice(-10, -6))
            }
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </>
  );
}

const listStyles = StyleSheet.create({
  listContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    padding: 16,
  },
  separator: {
    height: 16,
  },
  // 방 목록을 구분하는 세로선
  columnCrossline: {
    position: "absolute",
    borderLeftWidth: 2,
    borderLeftColor: "#6049E2",
    left: "17%",
    height: "100%",
  },
});
