import { InformationBox } from "@/components/home/InformationBox";
import { MapWidget } from "@/components/home/MapWidget";
import { 방_탐색 } from "@/components/home/방_탐색";
import { 방장_하기 } from "@/components/home/방장_하기";
import React from "react";
import { StyleSheet, View } from "react-native";

/**
 * HomeView 페이지
 *
 * - 지도와 경로 정보를 보여주는 메인 화면입니다.
 * - 출발지와 도착지를 선택하여 방을 탐색하거나 방을 생성할 수 있습니다.
 * - 사용자가 선택한 출발지와 도착지에 따라 지도와 정보를 동기화합니다.
 *
 * 주요 기능:
 * 1. 지도 위젯(MapWidget)을 통해 경로 및 거리/시간 정보를 시각화합니다.
 * 2. InformationBox로 사용자 입력 UI를 제공합니다.
 * 3. 방 탐색 및 방 생성 버튼으로 동작을 수행합니다.
 *
 * @returns {React.ReactElement} 지도와 UI가 포함된 메인 화면 구성 요소.
 */
export default function HomeView() {
  return (
    <View style={styles.container}>
      {/* 지도 위젯 */}
      <View style={styles.map}>
        <MapWidget />
      </View>

      {/* 사용자 인터페이스 */}
      <View style={styles.interface}>
        <InformationBox />

        {/* 버튼 그룹 */}
        <View style={styles.buttonContainer}>
          <방_탐색 />
          <방장_하기 />
        </View>
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
    backgroundColor: "#FFFFFF", // 흰색 배경
    justifyContent: "flex-end", // 컨텐츠를 화면 아래로 정렬
  },
  // 지도 스타일
  map: {
    position: "absolute", // 화면에 절대 위치
    top: 0,
    left: 0,
    right: 0,
    height: "75%", // 화면의 75%를 차지
    zIndex: 0, // 가장 뒤에 위치
    borderWidth: 1,
    borderColor: "#ccc", // 연한 회색 테두리
  },
  // 사용자 인터페이스 스타일
  interface: {
    padding: "5%", // 컨텐츠 내부 여백
    gap: 20, // 각 요소 간 간격
  },
  // 버튼 그룹 스타일
  buttonContainer: {
    flexDirection: "row", // 버튼을 가로로 정렬
    gap: 20, // 버튼 간 간격
  },
});
