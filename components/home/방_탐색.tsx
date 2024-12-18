import { fromDateState } from "@/atoms/routeState";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Text } from "react-native";
import { useRecoilValue } from "recoil";
import { styles } from "./button_style";

/**
 * 방 탐색 버튼
 *
 * - 사용자가 출발지, 도착지, 날짜를 선택하고 방 탐색 버튼을 누를 수 있습니다.
 * - 버튼을 누르면 방 목록 페이지로 이동합니다.
 */
export function 방_탐색(): React.JSX.Element {
  const fromDate = useRecoilValue(fromDateState);
  // 시간이 지난 날짜인지 확인
  const [isDisabled, setIsDisabled] = useState(false);

  // 매 초마다 현재 시간과 선택된 시간 비교
  useEffect(() => {
    const interval = setInterval(() => {
      if (fromDate < new Date()) {
        setIsDisabled(true);
      } else {
        setIsDisabled(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [fromDate]);

  return (
    <Link
      href={{
        pathname: "/RoomList",
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
