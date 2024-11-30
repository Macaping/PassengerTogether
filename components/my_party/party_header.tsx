import { StyleSheet, Text, View } from "react-native";

/**
 * 파티 ID를 표시하는 컴포넌트
 */
export function PartyHeader({ id }: { id: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.id}>{id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#EAE5FE",
  },
  id: {
    fontSize: 25,
    color: "#00000",
  },
});
