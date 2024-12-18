import { Link } from "expo-router";
import { Text } from "react-native";
import { styles } from "./button_style";

/**
 * 방장하기 버튼
 *
 * - 사용자가 출발지, 도착지, 날짜를 선택하고 방장하기 버튼을 누를 수 있습니다.
 * - 버튼을 누르면 방장하기 페이지로 이동합니다.
 */
export function 방장_하기(): React.JSX.Element {
  // 방 탐색 버튼
  return (
    <Link
      href={{
        pathname: "/RoomMake",
      }}
      style={styles.button}
    >
      <Text style={styles.text}>방장 하기</Text>
    </Link>
  );
}
