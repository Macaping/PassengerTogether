import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import { styles } from "./icon_styles";

export default function 동승자() {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => router.push("/(tabs)CheckPassenger")}
    >
      <Ionicons name="people-outline" size={32} color="#666666" />
      <Text style={styles.buttonText}>동승자</Text>
    </TouchableOpacity>
  );
}
