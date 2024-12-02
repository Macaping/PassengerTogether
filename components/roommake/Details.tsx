import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

interface MeetingDetailsInputProps {
  roomName: string; // 방제목
  setRoomName: (text: string) => void; // 방제목 변경 핸들러
  meetingPlace: string; // 만남의 장소
  setMeetingPlace: (text: string) => void; // 만남의 장소 변경 핸들러
  ootd: string; // 세부사항 (옷차림 정보)
  setOotd: (text: string) => void; // 세부사항 변경 핸들러
}

/**
 * 방제목, 만남의 장소, 세부사항 입력 컴포넌트
 */
export default function Details({
  roomName,
  setRoomName,
  meetingPlace,
  setMeetingPlace,
  ootd,
  setOotd,
}: MeetingDetailsInputProps) {
  return (
    <View>
      {/* 방제목 */}
      <Text style={styles.sectionTitle}>방제목</Text>
      <TextInput
        style={styles.input}
        placeholder="방제목"
        value={roomName}
        onChangeText={setRoomName}
        maxLength={10}
      />
      {/* 만남의 장소 */}
      <Text style={styles.sectionTitle}>만남의 장소</Text>
      <TextInput
        style={styles.input}
        placeholder="어디서 모일건가요?"
        maxLength={5}
        value={meetingPlace}
        onChangeText={setMeetingPlace}
      />

      {/* 나의 옷차림 */}
      <Text style={styles.sectionTitle}>나의 옷차림</Text>
      <TextInput
        style={styles.input}
        placeholder="오늘의 OOTD 입력!"
        value={ootd}
        onChangeText={setOotd}
        maxLength={20}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
