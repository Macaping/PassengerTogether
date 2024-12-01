import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface DateTimeSelectorProps {
  selectedDate: Date; // 현재 선택된 날짜
  onDateChange: (date: Date) => void; // 변경된 날짜를 부모에 전달
}

/**
 * 시간 선택 컴포넌트
 *
 * - 사용자가 날짜와 시간을 선택할 수 있는 컴포넌트입니다.
 * - 날짜와 시간을 선택하면 부모 컴포넌트에 변경된 값을 전달합니다.
 */
export default function 시간선택({
  selectedDate,
  onDateChange,
}: DateTimeSelectorProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // 날짜 선택 핸들러
  const handleDateChange = (event: any, date?: Date) => {
    if (date) {
      const updatedDate = new Date(selectedDate);
      updatedDate.setFullYear(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
      ); // 날짜만 변경
      onDateChange(updatedDate); // 기존 시간 유지
    }
    setShowDatePicker(false);
  };

  // 시간 선택 핸들러
  const handleTimeChange = (event: any, time?: Date) => {
    if (time) {
      const now = new Date(); // 현재 시간 동적으로 가져오기
      const updatedDate = new Date(selectedDate);
      updatedDate.setHours(time.getHours(), time.getMinutes());
      // 선택한 시간이 현재 시간보다 과거인지 확인
      if (updatedDate < now) {
        Alert.alert(
          "유효하지 않은 시간",
          "현재 시간보다 이전 시간은 선택할 수 없습니다.",
        );
        return;
      }
      onDateChange(updatedDate);
    }
    setShowTimePicker(false);
  };

  return (
    <View>
      <Text style={styles.sectionTitle}>출발 시간</Text>
      <View style={styles.row}>
        {/* 날짜 선택 버튼 */}
        <TouchableOpacity
          style={styles.box}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.text}>{selectedDate.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {/* 시간 선택 버튼 */}
        <TouchableOpacity
          style={styles.box}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={styles.text}>
            {selectedDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </TouchableOpacity>
      </View>
      {/* 날짜 선택기 */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()} // 현재 날짜보다 이전 날짜 선택 불가
        />
      )}
      {/* 시간 선택기 */}
      {showTimePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="time"
          display="default"
          onChange={handleTimeChange}
          minuteInterval={5}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    color: "#888",
    marginVertical: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
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
});
