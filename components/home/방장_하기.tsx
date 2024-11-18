import { Link } from "expo-router";
import { Text } from "react-native";
import { styles } from "./button_style";

interface 방장_하기Props {
  departure: string;
  destination: string;
  date: Date;
}

export function 방장_하기({ departure, destination, date }: 방장_하기Props) {
  // 방 탐색 버튼
  return (
    <Link
      href={{
        pathname: "/RoomMake",
        params: {
          selectedDeparture: departure,
          selectedDestination: destination,
          date: date.toISOString(),
        },
      }}
      style={styles.button}
    >
      <Text style={styles.text}>방장 하기</Text>
    </Link>
  );
}
