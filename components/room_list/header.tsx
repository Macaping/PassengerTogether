import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

/**
 * 헤더 컴포넌트
 */
export default function Header({
  origin,
  destination,
  date: date,
}: {
  origin: string;
  destination: string;
  date: Date;
}) {
  // 날짜 포맷을 변경합니다.
  date = new Date(date);
  const formattedDate = date.toLocaleTimeString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  return (
    <View style={headerStyles.container}>
      <Text style={headerStyles.date}>{formattedDate}</Text>
      <View style={headerStyles.routeContainer}>
        <Text style={headerStyles.locationName}>{origin}</Text>
        <Ionicons
          name="arrow-forward"
          size={30}
          color="#ffffff"
          style={headerStyles.arrowIcon}
        />
        <Text style={headerStyles.locationName}>{destination}</Text>
      </View>
    </View>
  );
}

const headerStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#6049E2",
    padding: 25,
  },
  date: {
    color: "#FFFFFF",
    fontSize: 20,
  },
  routeContainer: {
    flexDirection: "row",
  },
  locationName: {
    flex: 1,
    fontSize: 30,
    color: "#FFFFFF",
    fontWeight: "600",
    textAlign: "center",
    padding: 10,
  },
  arrowIcon: {
    alignSelf: "center",
    padding: 10,
  },
});
