import { StyleSheet, Text, View } from "react-native";

export default function Departure({ location }: { location: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>출발</Text>
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
