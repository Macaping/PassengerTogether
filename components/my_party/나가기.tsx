import { LeaveRoom } from "@/services/leave_room";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import { styles } from "./icon_styles";

export default function 나가기() {
  const handleLeaveRoom = async () => {
    LeaveRoom()
      // 처음 페이지로 이동
      .then(() => router.replace("/(tabs)"))
      // 오류 처리
      .catch((error: Error) =>
        console.error("사용자 정보 가져오기 오류:", error),
      );
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleLeaveRoom}>
      <Ionicons name="people-outline" size={32} color="#666666" />
      <Text style={styles.buttonText}>나가기</Text>
    </TouchableOpacity>
  );
}
