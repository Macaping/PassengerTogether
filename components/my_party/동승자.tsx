import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity } from "react-native";
import { styles } from "./icon_styles";
import { useRouter } from "expo-router";

export default function 동승자() {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => router.push("/CheckPassenger")}
    >
      <Ionicons name="people-outline" size={32} color="#666666" />
      <Text style={styles.buttonText}>동승자</Text>
    </TouchableOpacity>
  );
}
