import { StyleSheet, View } from "react-native";

/**
 * 구분선 컴포넌트
 */
export function Separator() {
  return (
    <View style={styles.container}>
      <View style={styles.점선} />
      <View style={styles.왼쪽반원} />
      <View style={styles.오른쪽반원} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  점선: {
    flex: 1,
    borderBottomWidth: 4,
    borderStyle: "dashed",
    borderColor: "#C3C3C3",
  },
  왼쪽반원: {
    position: "absolute",
    left: 0,
    width: 20,
    height: 40,
    backgroundColor: "#6049E2",
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  오른쪽반원: {
    position: "absolute",
    right: 0,
    width: 20,
    height: 40,
    backgroundColor: "#6049E2",
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
});
