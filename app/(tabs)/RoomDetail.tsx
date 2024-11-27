import Departure from "@/components/my_party/departure";
import Destination from "@/components/my_party/destination";
import Details from "@/components/my_party/details";
import Clothes from "@/components/my_party/clothes";
import NumPeople from "@/components/my_party/num_people";
import PartyEmpty from "@/components/my_party/party_empty";
import { PartyHeader } from "@/components/my_party/party_header";
import { roomstyles } from "@/components/my_party/room_styles";
import { Separator } from "@/components/my_party/separator";
import Time from "@/components/my_party/time";
import 나가기 from "@/components/my_party/나가기";
import 동승자 from "@/components/my_party/동승자";
import 채팅 from "@/components/my_party/채팅";
import { useParty } from "@/hooks/useParty";
import { StyleSheet, View } from "react-native";
import { useHostClothes } from "@/hooks/useHostClothes";

export default function RoomDetailView() {
  const { roomData: room, loading: roomLoading } = useParty();
  const { hostClothes, loading: clothesLoading } = useHostClothes(
    room?.users || [] // 잘못된 쉼표 제거
  );

  // 로딩 상태를 통합적으로 처리
  if (roomLoading || clothesLoading) {
    return <PartyEmpty />;
  }

  // 방 정보가 없을 때
  if (!room) {
    return <PartyEmpty />;
  }

  // 방 정보가 있을 때
  return (
    <View style={roomstyles.background}>
      <View style={roomstyles.container}>
        {/* 헤더와 방번호 */}
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

        {/* 만남의 장소 */}
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

const styles = StyleSheet.create({
  timeBox: {
    marginHorizontal: 20,
  },
  routeBox: {
    flexDirection: "row",
    marginHorizontal: 20,
    gap: 20, // gap은 React Native에서 지원되지 않음 -> 대체 가능
  },
  numPeople: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginHorizontal: 20,
  },
  details: {
    padding: 20,
  },
  separator: {
    flex: 1,
    justifyContent: "flex-end",
  },
});
