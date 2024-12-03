import { userDataState } from "@/atoms/userDataState";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useRecoilValue } from "recoil";

interface CreateRoomButtonProps {
  onPress: () => void; // 버튼 클릭 시 호출할 함수
  disabled?: boolean; // 버튼 비활성화 여부
  text: string; // 버튼 텍스트
  selectedDate: Date; // 선택된 출발 시간
}

/**
 * 방 만들기 버튼 컴포넌트
 */
export default function CreateRoomButton({
  onPress,
  disabled = false,
  text,
  selectedDate,
}: CreateRoomButtonProps) {
  const userData = useRecoilValue(userDataState);
  const [isPastTime, setIsPastTime] = useState(false); // 선택된 시간이 과거인지 여부

  useEffect(() => {
    const interval = setInterval(() => {
      setIsPastTime(selectedDate < new Date());
    }, 1000); // 매초마다 현재 시간과 선택된 시간 비교

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 제거
  }, [selectedDate]);

  const handlePress = () => {
    if (isPastTime) {
      Alert.alert(
        "유효하지 않은 시간",
        "출발 시간이 현재 시간보다 이전입니다. 시간을 다시 선택해주세요.",
      );
      return;
    }
    onPress();
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        (disabled || userData?.current_party || isPastTime) &&
          styles.disabledButton,
      ]}
      onPress={handlePress}
      disabled={disabled || !!userData?.current_party || isPastTime}
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
