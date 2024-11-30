import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import { styles } from "./icon_styles";

/**
 * 이전 버튼 컴포넌트
 */
export default function 이전() {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => router.replace("/RoomDetail")}
    >
      <Ionicons name="arrow-back-outline" size={32} color="#666666" />
      <Text style={styles.buttonText}>이전</Text>
    </TouchableOpacity>
  );
}
