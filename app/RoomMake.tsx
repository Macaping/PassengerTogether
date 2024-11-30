import 방만들기 from "@/components/roommake/방만들기";
import 시간선택 from "@/components/roommake/시간선택";
import 장소선택 from "@/components/roommake/장소선택";
import 장소옷차림입력 from "@/components/roommake/장소옷차림입력";
import { CreateRoom } from "@/services/create_room";
import JoinRoom from "@/services/join_room";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";

/**
 * RoomMakeView 페이지
 *
 * - 사용자가 새로운 방을 생성할 수 있는 화면입니다.
 * - 출발지, 도착지, 시간, 방 제목, 만남의 장소, 세부사항을 입력받아 방을 생성합니다.
 * - 방 생성 후, 방장이 자동으로 생성된 방에 참가합니다.
 *
 * 주요 기능:
 * 1. 출발지, 도착지, 시간, 방 제목 등 방 생성에 필요한 정보를 입력받습니다.
 * 2. 입력된 데이터를 기반으로 방을 생성합니다.
 * 3. 생성된 방에 방장이 자동으로 참가합니다.
 * 4. 방 생성 성공 시 알림 메시지를 표시하고 방 상세 페이지로 이동합니다.
 * 5. 방 생성 실패 시 오류 메시지를 표시합니다.
 *
 * @returns {React.ReactElement} 방 생성 화면 UI.
 */
export default function RoomMakeView() {
  // 상태 관리
  const [departure, setDeparture] = useState("천안역"); // 출발지
  const [destination, setDestination] = useState("천안아산역"); // 도착지
  const [selectedDate, setSelectedDate] = useState(new Date()); // 선택된 시간
  const [details, setDetails] = useState(""); // 세부사항
  const [roomName, setRoomName] = useState(""); // 방 제목
  const [meetingPlace, setMeetingPlace] = useState(""); // 만남의 장소

  const locations = ["천안역", "천안아산역", "선문대", "탕정역", "두정동 롯데"]; // 장소 옵션
  const isButtonDisabled = !meetingPlace || !details; // 방 만들기 버튼 활성화 조건

  /**
   * 방 생성 함수
   * - 입력된 정보를 기반으로 방을 생성하고, 방장이 자동으로 생성된 방에 참가합니다.
   */
  const handleCreateRoom = async () => {
    try {
      // 방 생성 API 호출
      const room = await CreateRoom({
        departure_time: selectedDate.toISOString(),
        origin: departure as string,
        destination: destination as string,
        meetingPlace,
        details,
        room_name: roomName,
      });

      // 생성된 방에 방장이 자동으로 참가
      room && (await JoinRoom(room.id));

      // 성공 알림 및 상세 페이지로 이동
      router.dismissAll();
      Alert.alert("성공", "방장이 되신걸 환영합니다!");
      router.replace("/(tabs)/RoomDetail"); // 방 상세 화면으로 이동
    } catch (error) {
      console.error("Failed to create room:", error);
      Alert.alert("오류", "방 생성에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <View style={styles.container}>
      {/* 출발지 및 도착지 선택 */}
      <장소선택
        departure={departure}
        setDeparture={setDeparture}
        destination={destination}
        setDestination={setDestination}
        locations={locations}
      />

      {/* 시간 선택 */}
      <시간선택
        selectedDate={selectedDate}
        onDateChange={(date) => setSelectedDate(date)}
      />

      {/* 방 제목 입력 */}
      <Text style={styles.sectionTitle}>방제목</Text>
      <TextInput
        style={styles.input}
        placeholder="방제목"
        value={roomName}
        onChangeText={setRoomName}
      />

      {/* 만남의 장소 및 세부사항 입력 */}
      <장소옷차림입력
        meetingPlace={meetingPlace}
        details={details}
        onMeetingPlaceChange={setMeetingPlace}
        onDetailsChange={setDetails}
      />

      {/* 방 만들기 버튼 */}
      <방만들기
        onPress={handleCreateRoom}
        disabled={isButtonDisabled}
        text="방만들기"
      />
    </View>
  );
}

/**
 * 스타일 정의
 */
const styles = StyleSheet.create({
  // 화면 전체 컨테이너 스타일
  container: {
    flex: 1,
    padding: 20, // 내부 여백
    backgroundColor: "#fff", // 흰색 배경
  },
  // 섹션 제목 스타일
  sectionTitle: {
    fontSize: 16,
    color: "#888", // 회색 텍스트
    marginVertical: 10, // 위아래 여백
  },
  // 입력 필드 스타일
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc", // 연한 회색 테두리
    borderRadius: 5, // 둥근 모서리
    padding: 10, // 내부 여백
    marginVertical: 10, // 위아래 여백
  },
});
