import Clothes from "@/components/my_party/clothes";
import Departure from "@/components/my_party/departure";
import Destination from "@/components/my_party/destination";
import Details from "@/components/my_party/details";
import NumPeople from "@/components/my_party/num_people";
import PartyEmpty from "@/components/my_party/party_empty";
import { PartyHeader } from "@/components/my_party/party_header";
import { roomstyles } from "@/components/my_party/room_styles";
import { Separator } from "@/components/my_party/separator";
import Time from "@/components/my_party/time";
import 나가기 from "@/components/my_party/나가기";
import 동승자 from "@/components/my_party/동승자";
import 채팅 from "@/components/my_party/채팅";
import { useHostClothes } from "@/hooks/useHostClothes";
import { useParty } from "@/hooks/useParty";
import { StyleSheet, View } from "react-native";

/**
 * RoomDetailView 페이지
 *
 * - 사용자가 속한 방의 세부 정보를 표시하는 화면입니다.
 * - 방의 시간, 경로, 인원, 세부 정보 등을 시각화하며, 채팅 및 동승자 관련 액션 버튼을 제공합니다.
 *
 * 주요 기능:
 * 1. 방 데이터와 방장 정보(옷차림)를 가져옵니다.
 * 2. 로딩 상태를 처리하여 로딩 중일 때는 `PartyEmpty`를 표시합니다.
 * 3. 방 데이터가 없는 경우에도 `PartyEmpty`를 표시합니다.
 * 4. 방 데이터가 있는 경우 방의 다양한 정보를 구성 요소로 시각화합니다.
 *
 * @returns {React.ReactElement} 방 세부 정보 화면 UI.
 */
export default function RoomDetailView() {
  // 방 데이터 및 로딩 상태 가져오기
  const { roomData: room, loading: roomLoading } = useParty();
  const { hostClothes, loading: clothesLoading } = useHostClothes(
    room?.users || [],
  );

  // 로딩 상태 처리
  if (roomLoading || clothesLoading) {
    return <PartyEmpty />;
  }

  // 방 데이터가 없는 경우 처리
  if (!room) {
    return <PartyEmpty />;
  }

  // 방 데이터가 있는 경우 화면 구성
  return (
    <View style={roomstyles.background}>
      <View style={roomstyles.container}>
        {/* 헤더와 방 번호 */}
        <PartyHeader id={String(room.room_name)} />

        {/* 시간 정보 */}
        <View style={styles.timeBox}>
          <Time
            date={
              room.departure_time ? new Date(room.departure_time) : new Date()
            }
          />
        </View>

        {/* 경로 정보 */}
        <View style={styles.routeBox}>
          <Departure location={room.origin} />
          <Destination location={room.destination} />
        </View>

        {/* 인원수 정보 */}
        <View style={styles.numPeople}>
          <NumPeople
            current={room.users ? room.users.length : 0}
            max={room.limit_people}
          />
        </View>

        {/* 만남의 장소 세부 정보 */}
        <View style={styles.details}>
          <Details text={room.details || "정보 없음"} />
        </View>

        {/* 방장의 옷차림 */}
        <View style={styles.details}>
          <Clothes text={hostClothes || "정보 없음"} />
        </View>

        {/* 구분선 */}
        <View style={styles.separator}>
          <Separator />
        </View>

        {/* 버튼 영역 */}
        <View style={roomstyles.buttonContainer}>
          <채팅 />
          <동승자 />
          <나가기 />
        </View>
      </View>
    </View>
  );
}

/**
 * 스타일 정의
 */
const styles = StyleSheet.create({
  // 시간 정보 영역 스타일
  timeBox: {
    marginHorizontal: 20,
  },
  // 경로 정보 영역 스타일
  routeBox: {
    flexDirection: "row", // 출발지와 도착지를 가로로 정렬
    marginHorizontal: 20,
    gap: 20, // 요소 간 간격 (React Native에서는 사용 불가 -> 대체 필요)
  },
  // 인원수 정보 영역 스타일
  numPeople: {
    flexDirection: "row", // 인원수 정보를 가로로 정렬
    justifyContent: "flex-end", // 오른쪽 정렬
    marginHorizontal: 20,
  },
  // 세부 정보 영역 스타일
  details: {
    padding: 20, // 내부 여백
  },
  // 구분선 영역 스타일
  separator: {
    flex: 1,
    justifyContent: "flex-end", // 하단에 배치
  },
});
