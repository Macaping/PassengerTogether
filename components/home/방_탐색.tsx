import { Link } from "expo-router";
import { Text } from "react-native";
import { styles } from "./button_style";

interface 방_탐색Props {
  departure: string;
  destination: string;
  date: Date;
}

export function 방_탐색({ departure, destination, date }: 방_탐색Props) {
  // 방 탐색 버튼
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
      style={styles.button}
    >
      <Text style={styles.text}>방 탐색</Text>
    </Link>
  );
}
