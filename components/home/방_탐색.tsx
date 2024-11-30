import { Link } from "expo-router";
import { Text } from "react-native";
import { styles } from "./button_style";

interface 방_탐색Props {
  departure: string;
  destination: string;
  date: Date;
}

/**
 * 방 탐색 버튼
 *
 * - 사용자가 출발지, 도착지, 날짜를 선택하고 방 탐색 버튼을 누를 수 있습니다.
 * - 버튼을 누르면 방 목록 페이지로 이동합니다.
 */
export function 방_탐색({
  departure,
  destination,
  date,
}: 방_탐색Props): React.JSX.Element {
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
