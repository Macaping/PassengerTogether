import {
  departureState,
  destinationState,
  fromDateState,
} from "@/atoms/routeState";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRecoilValue } from "recoil";

/**
 * 헤더 컴포넌트
 */
export default function Header() {
  const departure = useRecoilValue(departureState); // 출발지
  const destination = useRecoilValue(destinationState); // 도착지
  const fromDate = useRecoilValue(fromDateState); // 출발 시간

  // 날짜 포맷을 변경합니다.
  const formattedDate = fromDate.toLocaleTimeString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  return (
    <View style={headerStyles.container}>
      <Text style={headerStyles.date}>{formattedDate}</Text>
      <View style={headerStyles.routeContainer}>
        <Text style={headerStyles.locationName}>{departure}</Text>
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
