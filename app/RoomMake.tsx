import 방만들기 from "@/components/roommake/방만들기";
import 시간선택 from "@/components/roommake/시간선택";
import 장소선택 from "@/components/roommake/장소선택";
import 장소옷차림입력 from "@/components/roommake/장소옷차림입력";
import { CreateRoom } from "@/services/create_room";
import JoinRoom from "@/services/join_room";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, TextInput, View, Text } from "react-native";

export default function RoomMakeView() {
  const [departure, setDeparture] = useState("천안역");
  const [destination, setDestination] = useState("천안아산역");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [details, setDetails] = useState("");
  const [roomName, setRoomName] = useState("");
  const [meetingPlace, setMeetingPlace] = useState("");

  const locations = ["천안역", "천안아산역", "선문대", "탕정역", "두정동 롯데"];
  const isButtonDisabled = !meetingPlace || !details;

  //방만들때 호출되는 함수
  const handleCreateRoom = async () => {
    try {
      // 방 생성
      const room = await CreateRoom({
        departure_time: selectedDate.toISOString(),
        origin: departure as string,
        destination: destination as string,
        users: [],
        meetingPlace,
        details,
        room_name: roomName,
      });

      // 방 생성한 사람이 방에 참가
      room && (await JoinRoom(room.id));

      // 방 생성 성공 시
      router.dismissAll();
      Alert.alert("성공", "방장이 되신걸 환영합니다!");
      router.replace("/(tabs)/RoomDetail"); // 방 상세 페이지로 이동
    } catch (error) {
      console.error("Failed to create room:", error);
      Alert.alert("오류", "방 생성에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <View style={styles.container}>
      <장소선택
        departure={departure}
        setDeparture={setDeparture}
        destination={destination}
        setDestination={setDestination}
        locations={locations}
      />
      <시간선택
        selectedDate={selectedDate}
        onDateChange={(date) => setSelectedDate(date)}
      />
      <Text style={styles.sectionTitle}>방제목</Text>
      <TextInput
        style={styles.input}
        placeholder="방제목"
        value={roomName}
        onChangeText={setRoomName}
        maxLength={10}
      />
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
        selectedDate={selectedDate}
        text="방만들기"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 16,
    color: "#888",
    marginVertical: 10,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
});
