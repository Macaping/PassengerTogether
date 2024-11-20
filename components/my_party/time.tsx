import { StyleSheet, Text, View } from "react-native";

export default function Time({ date }: { date: Date }) {
  // 시간 정보
  return (
    <View style={styles.container}>
      <Text style={styles.label}>출발 시각</Text>
      <Text style={styles.time}>
        {`${date.getFullYear()}년 `}
        {`${date.getMonth() + 1}월 `}
        {`${date.getDate()}일 `}
        {`(${["일", "월", "화", "수", "목", "금", "토"][date.getDay()]}) `}
        {`${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  label: {
    fontSize: 20,
    color: "#6F6F6F",
  },
  time: {
    fontSize: 24,
    color: "#000000",
  },
});
