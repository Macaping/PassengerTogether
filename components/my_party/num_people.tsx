import { StyleSheet, Text, View } from "react-native";

/**
 * 인원수 정보를 표시하는 컴포넌트
 */
export default function NumPeople({
  current,
  max,
}: {
  current: number | null;
  max: number | null;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>인원수</Text>
      <Text style={styles.numPeople}>
        {current}/{max}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-end", // 우측 정렬
  },
  label: {
    fontSize: 20,
    color: "#6F6F6F",
  },
  numPeople: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#000000",
  },
});
