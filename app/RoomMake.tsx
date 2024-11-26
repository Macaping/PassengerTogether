import 장소선택 from "@/components/roommake/장소선택";
import { CreateRoom } from "@/services/create_room";
import { JoinRoom } from "@/services/join_room";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function RoomMakeView() {
  const [departure, setDeparture] = useState("천안역");
  const [destination, setDestination] = useState("천안아산역");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [details, setDetails] = useState("");
  const [roomName, setRoomName] = useState("");
  const [meetingPlace, setMeetingPlace] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const locations = ["천안역", "천안아산역", "선문대", "탕정역", "두정동 롯데"];

  //날짜 변경 호출함수
  const handleDateChange = (event: any, date: Date | undefined) => {
    if (date) setSelectedDate(new Date(date));
    setShowDatePicker(false);
  };

  //시간 변경 호출함수
  const handleTimeChange = (event: any, time: Date | undefined) => {
    if (time) {
      const updatedDate = new Date(selectedDate);
      updatedDate.setHours(time.getHours(), time.getMinutes());
      setSelectedDate(updatedDate);
    }
    setShowTimePicker(false);
  };

  //방만들때 호출되는 함수
  const handleCreateRoom = async () => {
    try {
      // 방 생성
      const room = await CreateRoom({
        departure_time: selectedDate.toISOString(),
        origin: departure as string,
        destination: destination as string,
        users: [],
        details: `${meetingPlace}`, // 장소와 세부사항을 합쳐 전송
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
      {/* 출발 시간 UI */}
      <Text style={styles.sectionTitle}>출발 시간</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.box}
          onPress={() => setShowDatePicker(true)} //날짜 선택 창 여는것
        >
          <Text style={styles.text}>{selectedDate.toLocaleDateString()}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.box}
          onPress={() => setShowTimePicker(true)} //시간 선택 창 여는것
        >
          <Text style={styles.text}>
            {selectedDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </TouchableOpacity>
      </View>
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          onChange={handleDateChange}
        />
      )}
      {showTimePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="time"
          onChange={handleTimeChange}
        />
      )}
      <Text style={styles.sectionTitle}>방제목</Text>
      <TextInput
        style={styles.input}
        placeholder="방제목"
        multiline
        value={roomName}
        onChangeText={setRoomName}
      />
      {/* 만남의 장소 */}
      <Text style={styles.sectionTitle}>만남의 장소</Text>
      <TextInput
        style={styles.input}
        placeholder="어디서 모일건가요?"
        value={meetingPlace}
        onChangeText={setMeetingPlace}
      />

      {/* 세부사항 */}
      <Text style={styles.sectionTitle}>나의 옷차림</Text>
      <TextInput
        style={styles.input}
        placeholder="오늘의 OOTD 입력!"
        multiline
        value={details}
        onChangeText={setDetails}
      />

      {/* 방 만들기 버튼 */}
      <TouchableOpacity style={styles.createButton} onPress={handleCreateRoom}>
        <Text style={styles.createButtonText}>방만들기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  label: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    color: "#888",
  },
  box: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  text: {
    fontSize: 18,
    color: "#6B59CC",
  },
  arrow: {
    fontSize: 20,
    color: "#6B59CC",
    marginHorizontal: 5,
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
  counterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#A99CE3",
    alignItems: "center",
    justifyContent: "center",
  },
  counterText: {
    color: "#fff",
    fontSize: 20,
  },
  createButton: {
    backgroundColor: "#6B59CC",
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  modal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalItem: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
    alignItems: "center",
  },
});
