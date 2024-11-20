import { LeaveRoom } from "@/services/leave_room";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import { styles } from "./icon_styles";

export default function 나가기() {
  function handleLeaveRoom() {
    LeaveRoom()
      .then(() => {
        router.replace("/(tabs)");
      })
      .catch((error: Error) => console.error("나가기 오류:", error));
  }

  return (
    <TouchableOpacity style={styles.button} onPress={handleLeaveRoom}>
      <Ionicons name="people-outline" size={32} color="#666666" />
      <Text style={styles.buttonText}>나가기</Text>
    </TouchableOpacity>
  );
}
