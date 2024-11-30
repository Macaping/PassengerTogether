import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import { styles } from "./icon_styles";

/**
 * 채팅 버튼 컴포넌트
 */
export default function 채팅() {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => router.push("/Chat")}
    >
      <Ionicons name="chatbubble-outline" size={32} />
      <Text style={styles.buttonText}>채팅</Text>
    </TouchableOpacity>
  );
}
