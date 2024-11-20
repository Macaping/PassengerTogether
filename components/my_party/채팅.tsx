import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import { styles } from "./icon_styles";

export default function 채팅() {
  return (
    <TouchableOpacity style={styles.button}>
      <Ionicons
        name="chatbubble-outline"
        size={32}
        onPress={() => router.push("/Chat")}
      />
      <Text style={styles.buttonText}>채팅</Text>
    </TouchableOpacity>
  );
}
