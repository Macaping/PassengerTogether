import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity } from "react-native";
import { styles } from "./icon_styles";
import { router, useRouter } from "expo-router";

export default function 이전() {
  const router = useRouter();
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
