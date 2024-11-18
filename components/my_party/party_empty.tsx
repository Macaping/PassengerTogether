import { StyleSheet, Text, View } from "react-native";

export default function PartyEmpty() {
  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.text}>현재 참여한 방이 없습니다.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6049E2",
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    color: "#FFFFFF",
  },
});
