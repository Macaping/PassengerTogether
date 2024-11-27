import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { usePassengers } from "@/hooks/usePassengers";
import { PartyHeader } from "@/components/my_party/party_header";
import { roomstyles } from "@/components/my_party/room_styles";
import { Separator } from "@/components/my_party/separator";
import 이전 from "@/components/my_party/이전";
import { useUserData } from "@/hooks/useUserData";

export default function CheckPassenger() {
  const { userData } = useUserData();
  const { passengers, loading, error } = usePassengers(userData?.current_party);

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  const renderPassengerItem = ({ item }: { item: (typeof passengers)[0] }) => (
    <View style={styles.passengerItem}>
      <Text style={styles.nickname}>{item.nickname}</Text>
      <Text style={styles.description}>{item.clothes}</Text>
    </View>
  );

  return (
    <View style={roomstyles.background}>
      <View style={roomstyles.container}>
        <PartyHeader id="동승자" />

        <View style={styles.indexContainer}>
          <Text style={styles.headerText}>닉네임</Text>
          <Text style={styles.headerText}>옷차림</Text>
        </View>

        <FlatList
          data={passengers}
          keyExtractor={(item) => item.id}
          renderItem={renderPassengerItem}
          style={styles.passengerList}
        />

        <Separator />
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
