import { Link } from "expo-router";
import { Alert, Text } from "react-native";
import { styles } from "./button_style";

interface 방_탐색Props {
  departure: string;
  destination: string;
  date: Date;
}

export function 방_탐색({ departure, destination, date }: 방_탐색Props) {
  const currentDate = new Date();

  const isDisabled = date < currentDate;

  return (
    <Link
      href={{
        pathname: "/RoomList",
        params: {
          departure: departure,
          destination: destination,
          date: date,
        },
      }}
      style={[styles.button, isDisabled && { backgroundColor: "#A0A0A0" }]} // 비활성화 스타일 적용
      onPress={(e) => {
        if (isDisabled) {
          e.preventDefault(); // 링크 동작 막기
          Alert.alert("시간을 다시 선택해주세요."); // 경고 메시지 표시
        }
      }}
    >
      <Text style={styles.text}>방 탐색</Text>
    </Link>
  );
}
