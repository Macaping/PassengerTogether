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
          room_name={item.room_name} // room_name 추가
          departure_time={
            item.departure_time ? new Date(item.departure_time) : new Date()
          }
          limit_people={item.limit_people ?? 0}
          users={item.users ?? []}
          status={item.status}
          onPress={() => handleRoomPress(item)}
        />
      )}
      keyExtractor={(item) => item.id}
    />
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
});
