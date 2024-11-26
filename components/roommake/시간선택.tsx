import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

interface DateTimeSelectorProps {
  selectedDate: Date; // 현재 선택된 날짜
  onDateChange: (date: Date) => void; // 변경된 날짜를 부모에 전달
}

export default function 시간선택({
  selectedDate,
  onDateChange,
}: DateTimeSelectorProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // 날짜 선택 핸들러
  const handleDateChange = (event: any, date?: Date) => {
    if (date) onDateChange(date);
    setShowDatePicker(false);
  };

  // 시간 선택 핸들러
  const handleTimeChange = (event: any, time?: Date) => {
    if (time) {
      const updatedDate = new Date(selectedDate);
      updatedDate.setHours(time.getHours(), time.getMinutes());
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
          onChange={handleDateChange}
        />
      )}
      {/* 시간 선택기 */}
      {showTimePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="time"
          onChange={handleTimeChange}
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
