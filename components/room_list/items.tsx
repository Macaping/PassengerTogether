import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// type Room = Database["public"]["Tables"]["rooms"]["Row"];

// type ItemProps = {
//   created_at: Room["created_at"];
//   departure_time: Room["departure_time"];
//   limit_people: Room["limit_people"];
// };

/**
 * RoomList 아이템 컴포넌트
 */
export default function Item({
  created_at,
  departure_time,
  limit_people,
  room_name,
  users,
  status,
  onPress,
}: {
  created_at: string;
  departure_time: Date;
  limit_people: number;
  users: string[];
  status: string;
  room_name: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={itemStyles.container}
      activeOpacity={1}
    >
      {/* 출발 시각 00:00으로 표현 */}
      <View style={itemStyles.header}></View>
      <Text style={itemStyles.시각}>
        {new Date(departure_time).getHours().toString().padStart(2, "0")}:
        {new Date(departure_time).getMinutes().toString().padStart(2, "0")}
      </Text>
      {/* 방 번호 */}
      <Text style={itemStyles.방_번호}>
        {room_name || created_at.slice(-10, -6)}
      </Text>
      {/* 현재인원/최대인원 */}
      <Text style={itemStyles.현재인원_최대인원}>
        {users ? users.length : "0"}/{limit_people}
      </Text>
      {/* <Text style={itemStyles.현재인원_최대인원}>방 상태: {status}</Text> */}
    </TouchableOpacity>
  );
}

const itemStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    alignItems: "flex-end",
    borderWidth: 0.5,
    borderColor: "#A594F9",
    borderRadius: 8,
    padding: 20,
  },
  header: {
    backgroundColor: "#A594F9",
    position: "absolute",
    top: 0,
    bottom: 0, // 추가
    left: 0,
    width: "2%",
    borderTopLeftRadius: 8, // borderRadius 값을 container와 맞춤
    borderBottomLeftRadius: 8, // 하단 왼쪽도 둥글게 처리
  },

  시각: {
    color: "#6049E2",
    fontSize: 20,
    fontWeight: "bold",
  },
  방_번호: {
    width: "50%",
    textAlign: "left",
    color: "#000000",
    fontSize: 20,
    fontWeight: "500",
    top: "-5%",
  },
  현재인원_최대인원: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "600",
    right: "2%",
  },
});
