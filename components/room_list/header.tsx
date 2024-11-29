import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

const { height } = Dimensions.get("window");

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
    <View style={headerStyles.headerContainer}>
      <Text style={headerStyles.date}>{formattedDate}</Text>
      <View style={headerStyles.routeContainer}>
        <Text style={headerStyles.locationName}>{origin}</Text>
        <Ionicons
          name="arrow-forward"
          size={24}
          color="#ffffff"
          style={headerStyles.arrowIcon}
        />
        <Text style={headerStyles.locationName}>{destination}</Text>
      </View>
    </View>
  );
}

const headerStyles = StyleSheet.create({
  headerContainer: {
    alignItems: "center",
    backgroundColor: "#6049E2",
    paddingBottom: "10%",
  },
  date: {
    width: "80%",
    color: "#ffffff",
    fontSize: 20,
    paddingTop: height * 0.03,
  },

  routeContainer: {
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "center",
    // paddingTop: '2%',
    width: "90%",
    // paddingBottom: '5%'
  },
  locationName: {
    fontSize: 30,
    color: "#ffffff",
    fontWeight: "600",
    alignItems: "center",

    width: "40%",
    textAlign: "center",
  },
  arrowIcon: {
    marginHorizontal: 10, // 화살표와 텍스트 사이 간격
    alignSelf: "center",
    top: "1.5%",
  },
  headerContainerWithModal: {
    alignItems: "center",
    backgroundColor: "#6049E2",
    height: "22%",
    zIndex: 1, // 모달 오버레이 아래에 위치하도록 설정
  },
});
