import Departure from "@/components/my_party/departure";
import Destination from "@/components/my_party/destination";
import Details from "@/components/my_party/details";
import Loading from "@/components/my_party/loading";
import NumPeople from "@/components/my_party/num_people";
import PartyEmpty from "@/components/my_party/party_empty";
import { PartyHeader } from "@/components/my_party/party_header";
import { Separator } from "@/components/my_party/separator";
import Time from "@/components/my_party/time";
import 나가기 from "@/components/my_party/나가기";
import 동승자 from "@/components/my_party/동승자";
import 채팅 from "@/components/my_party/채팅";
import useUserDataManagement from "@/hooks/userDataManagement";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function RoomDetailView() {
  const { room, fetchRoomDetails } = useUserDataManagement();
  const [loading, setLoading] = useState(true);

  // 포커스가 맞춰졌을 때 방 정보를 가져옴
  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        setLoading(true);
        await fetchRoomDetails();
        setLoading(false);
      }
      fetchData();
    }, []),
  );

  // 로딩 중일 때
  if (loading) {
    return <Loading />;
  }

  // 방 정보가 없을 때
  if (!room) {
    return <PartyEmpty />;
  }

  // 방 정보가 있을 때
  return (
    <View style={styles.background}>
      <View style={styles.container}>
        {/* 헤더와 방번호 */}
        <PartyHeader id={String(room.created_at.slice(-10, -6))} />

        {/* 시간 정보 */}
        <View style={styles.timeBox}>
          <Time date={new Date(room.departure_time)} />
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
          <Details text={room.details} />
        </View>
        {/* 구분선 */}
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <Separator />
        </View>
        {/* 버튼 영역 */}
        <View style={styles.buttonContainer}>
          <채팅 />
          <동승자 />
          <나가기 />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#6049E2",
  },
  container: {
    flex: 1,
    margin: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    // 자식 요소가 부모의 경계선을 넘지 않도록 설정
    overflow: "hidden",
    gap: 10,
  },
  timeBox: {
    marginHorizontal: 20,
  },
  routeBox: {
    flexDirection: "row",
    marginHorizontal: 20,
    gap: 20,
  },
  numPeople: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginHorizontal: 20,
  },
  details: {
    padding: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    margin: 20,
  },
});
