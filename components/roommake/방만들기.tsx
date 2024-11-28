import { useUserData } from "@/hooks/useUserData";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface CreateRoomButtonProps {
  onPress: () => void; // 버튼 클릭 시 호출할 함수
  disabled?: boolean; // 버튼 비활성화 여부
  text: string; // 버튼 텍스트
}

export default function CreateRoomButton({
  onPress,
  disabled = false,
  text,
}: CreateRoomButtonProps) {
  const { userData } = useUserData();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        (disabled || userData?.current_party) && styles.disabledButton,
      ]}
      onPress={onPress}
      disabled={disabled || !!userData?.current_party}
    >
      <Text style={styles.buttonText}>
        {userData?.current_party ? "이미 참여 중인 방이 있습니다" : text}
      </Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: "#6B59CC",
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
