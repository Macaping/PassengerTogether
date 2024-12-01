import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

interface MeetingDetailsInputProps {
  meetingPlace: string; // 만남의 장소
  details: string; // 세부사항 (옷차림 정보)
  onMeetingPlaceChange: (text: string) => void; // 만남의 장소 변경 핸들러
  onDetailsChange: (text: string) => void; // 세부사항 변경 핸들러
}

/**
 * 장소 및 옷차림 정보 입력 컴포넌트
 *
 * - 만남의 장소와 세부사항(옷차림 정보)을 입력할 수 있는 컴포넌트입니다.
 * - 만남의 장소와 세부사항을 입력하면 부모 컴포넌트에 변경된 값을 전달합니다.
 */
export default function 장소옷차림입력({
  meetingPlace,
  details,
  onMeetingPlaceChange,
  onDetailsChange,
}: MeetingDetailsInputProps) {
  return (
    <View>
      {/* 만남의 장소 */}
      <Text style={styles.sectionTitle}>만남의 장소</Text>
      <TextInput
        style={styles.input}
        placeholder="어디서 모일건가요?"
        maxLength={5}
        value={meetingPlace}
        onChangeText={onMeetingPlaceChange}
      />

      {/* 세부사항 */}
      <Text style={styles.sectionTitle}>나의 옷차림</Text>
      <TextInput
        style={styles.input}
        placeholder="오늘의 OOTD 입력!"
        value={details}
        onChangeText={onDetailsChange}
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
