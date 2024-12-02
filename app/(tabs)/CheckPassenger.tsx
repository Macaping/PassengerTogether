import { PartyHeader } from "@/components/my_party/party_header";
import { roomstyles } from "@/components/my_party/room_styles";
import { Separator } from "@/components/my_party/separator";
import 이전 from "@/components/my_party/이전";
import { usePassengers } from "@/hooks/usePassengers";
import { Database } from "@/lib/supabase_type";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

type UserData = Database["public"]["Tables"]["users"]["Row"];

/**
 * 동승자 확인 화면 페이지
 *
 * - 현재 사용자가 속한 파티의 동승자 목록을 표시합니다.
 * - 닉네임과 옷차림 정보를 나열하며, "이전" 버튼을 통해 이전 화면으로 이동할 수 있습니다.
 *
 * 주요 기능:
 * 1. 현재 사용자가 속한 파티의 ID를 기반으로 동승자 목록을 가져옵니다.
 * 2. 동승자 목록을 `FlatList`를 사용해 렌더링합니다.
 * 3. 로딩 상태를 처리하여 데이터를 가져오는 동안 로딩 메시지를 표시합니다.
 *
 * @returns {React.ReactElement} 동승자 확인 화면 UI.
 */
export default function CheckPassenger() {
  const { passengers } = usePassengers(); // 동승자 목록 데이터 가져오기

  // 동승자 목록이 없는 경우
  if (!passengers) {
    return (
      <View>
        <Text>동승자가 없습니다.</Text>
      </View>
    );
  }

  /**
   * 동승자 목록의 각 항목을 렌더링하는 함수
   *
   * @param {Object} item - 동승자 데이터 객체 (닉네임, 옷차림 포함).
   * @returns {React.ReactElement} 렌더링된 동승자 항목.
   */
  const renderPassengerItem = (item: UserData) => (
    <View style={styles.passengerItem}>
      <Text style={styles.nickname}>{item.nickname}</Text>
      <Text style={styles.description}>{item.clothes}</Text>
    </View>
  );

  // 화면 UI 구성
  return (
    <View style={roomstyles.background}>
      <View style={roomstyles.container}>
        {/* 화면 상단 헤더 */}
        <PartyHeader id="동승자" />

        {/* 닉네임 및 옷차림 정보 헤더 */}
        <View style={styles.indexContainer}>
          <Text style={styles.headerText}>닉네임</Text>
          <Text style={styles.headerText}>옷차림</Text>
        </View>

        {/* 동승자 목록 */}
        <FlatList
          data={passengers} // 동승자 목록 데이터
          style={styles.passengerList}
          keyExtractor={(item) => item.user_id} // 각 항목의 고유 ID를 키로 사용
          renderItem={({ item }) => renderPassengerItem(item)} // 각 항목 렌더링 함수
        />

        {/* 구분선 및 버튼 */}
        <Separator />
        <View style={[roomstyles.buttonContainer, styles.buttonContainer]}>
          <이전 />
        </View>
      </View>
    </View>
  );
}

/**
 * 스타일 정의
 */
const styles = StyleSheet.create({
  indexContainer: {
    flexDirection: "row", // 닉네임과 옷차림을 가로로 나열
    justifyContent: "space-around", // 두 텍스트를 양쪽에 배치
    paddingTop: "1%",
    paddingBottom: "1%",
  },
  headerText: {
    color: "#747474", // 헤더 텍스트 색상
  },
  passengerList: {
    paddingHorizontal: 20, // 목록의 좌우 여백
  },
  passengerItem: {
    flexDirection: "row", // 닉네임과 옷차림을 가로로 배치
    justifyContent: "space-between", // 닉네임과 옷차림을 양쪽 끝으로 배치
    paddingVertical: 10, // 항목 위아래 여백
    borderBottomWidth: 1, // 항목 간 구분선 두께
    borderBottomColor: "#EDEDED", // 항목 간 구분선 색상
  },
  nickname: {
    fontSize: 16, // 닉네임 텍스트 크기
    fontWeight: "bold", // 닉네임 텍스트 굵기
    color: "#333333", // 닉네임 텍스트 색상
  },
  description: {
    fontSize: 14, // 옷차림 텍스트 크기
    color: "#666666", // 옷차림 텍스트 색상
  },
  buttonContainer: {
    justifyContent: "flex-end", // 버튼을 화면 아래에 배치
  },
});
