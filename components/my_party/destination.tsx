import { StyleSheet, Text, View } from "react-native";

/**
 * 도착지 정보를 표시하는 컴포넌트
 */
export default function Destination({ location }: { location: string | null }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>도착</Text>
      <Text style={styles.location}>{location}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    fontSize: 20,
    color: "#6F6F6F",
  },
  location: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#000000",
  },
});
