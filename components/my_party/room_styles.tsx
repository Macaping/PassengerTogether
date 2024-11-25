import { StyleSheet } from "react-native";

export const roomstyles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#6049E2",
  },
  container: {
    flex: 1,
    margin: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    // 자식 요소가 부모의 경계선을 넘지 않도록 설정
    overflow: "hidden",
    gap: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    margin: 20,
  },
});
