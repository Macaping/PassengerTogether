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
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>{text}</Text>
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
