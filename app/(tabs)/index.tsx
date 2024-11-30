import { InformationBox } from "@/components/home/InformationBox";
import { MapWidget } from "@/components/home/MapWidget";
import { 방_탐색 } from "@/components/home/방_탐색";
import { 방장_하기 } from "@/components/home/방장_하기";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { LatLng } from "react-native-maps";

// 주요 장소의 좌표 데이터
const coordinates: { [key: string]: LatLng } = {
  천안역: { latitude: 36.8089885, longitude: 127.148933 },
  천안아산역: { latitude: 36.7946071, longitude: 127.1045608 },
  선문대: { latitude: 36.7989764, longitude: 127.0750025 },
  탕정역: { latitude: 36.78827, longitude: 127.084638 },
  "두정동 롯데": { latitude: 36.8261834, longitude: 127.1399744 },
};

// 장소 목록
const locations = ["천안역", "천안아산역", "선문대", "탕정역", "두정동 롯데"];

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
  // 출발지와 도착지 상태
  const [departure, setDeparture] = useState<LatLng>(coordinates["천안역"]); // 기본값: 천안역
  const [destination, setDestination] = useState<LatLng>(
    coordinates["천안아산역"], // 기본값: 천안아산역
  );
  const [selectedDeparture, setSelectedDeparture] = useState<string>("천안역");
  const [selectedDestination, setSelectedDestination] =
    useState<string>("천안아산역");

  // 사용자가 출발지/도착지를 변경하면 상태를 업데이트
  useEffect(() => {
    if (selectedDeparture) {
      setDeparture(coordinates[selectedDeparture]);
    }
    if (selectedDestination) {
      setDestination(coordinates[selectedDestination]);
    }
  }, [selectedDeparture, selectedDestination]);

  // 날짜 상태
  const [date, setDate] = useState<Date>(new Date()); // 기본값: 현재 날짜

  // 경로 정보 (거리 및 예상 소요 시간)
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);

  return (
    <View style={styles.container}>
      {/* 지도 위젯 */}
      <View style={styles.map}>
        <MapWidget
          departure={departure}
          destination={destination}
          setDistance={setDistance}
          setDuration={setDuration}
        />
      </View>

      {/* 사용자 인터페이스 */}
      <View style={styles.interface}>
        <InformationBox
          selectedDeparture={selectedDeparture}
          setSelectedDeparture={setSelectedDeparture}
          selectedDestination={selectedDestination}
          setSelectedDestination={setSelectedDestination}
          date={date}
          setDate={setDate}
          locations={locations}
          distance={distance}
          duration={duration}
        />

        {/* 버튼 그룹 */}
        <View style={styles.buttonContainer}>
          <방_탐색
            departure={selectedDeparture}
            destination={selectedDestination}
            date={date}
          />
          <방장_하기
            departure={selectedDeparture}
            destination={selectedDestination}
            date={date}
          />
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
