import { PartyHeader } from "@/components/my_party/party_header";
import { roomstyles } from "@/components/my_party/room_styles";
import { Separator } from "@/components/my_party/separator";
import 이전 from "@/components/my_party/이전";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

const mockPassengers = [
  { id: 1, nickname: "박문아라마", description: "하얀색 후드티에 모자👕..." },
  { id: 2, nickname: "아리다가자", description: "하얀색 후드티에 모자👕..." },
  { id: 3, nickname: "바가바가박", description: "하얀색 후드티에 모자👕..." },
  { id: 4, nickname: "바리바가각", description: "하얀색 후드티에 모자👕..." },
];

export default function CheckPassenger() {
  const renderPassengerItem = ({
    item,
  }: {
    item: (typeof mockPassengers)[0];
  }) => (
    <View style={styles.passengerItem}>
      <Text style={styles.nickname}>{item.nickname}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <View style={roomstyles.background}>
      <View style={roomstyles.container}>
        {/* Header */}
        <PartyHeader id="동승자" />

        {/* List Header */}
        <View style={styles.indexContainer}>
          <Text style={styles.headerText}>닉네임</Text>
          <Text style={styles.headerText}>옷차림</Text>
        </View>

        {/* Passengers List */}
        <FlatList
          data={mockPassengers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPassengerItem}
          style={styles.passengerList}
        />

        {/* Separator */}
        <Separator />
        {/* Footer */}
        <View style={[roomstyles.buttonContainer, styles.buttonContainer]}>
          <이전 />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  indexContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: "1%",
    paddingBottom: "1%",
  },
  headerText: {
    color: "#747474",
  },
  passengerList: {
    paddingHorizontal: 20,
  },
  passengerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EDEDED",
  },
  nickname: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  description: {
    fontSize: 14,
    color: "#666666",
  },
  buttonContainer: {
    justifyContent: "flex-end",
  },
});
