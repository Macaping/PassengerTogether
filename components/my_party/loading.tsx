import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

/**
 * 로딩 중을 표시하는 컴포넌트
 */
export default function Loading() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.text}>로딩 중...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e0f0ff",
  },
  text: {
    fontSize: 24,
    color: "#333",
    textAlign: "center",
  },
});
