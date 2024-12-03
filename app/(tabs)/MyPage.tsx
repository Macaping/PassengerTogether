import { userDataState } from "@/atoms/userDataState";
import { signOutUser } from "@/utils/auth.utils";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useRecoilValue } from "recoil";

/**
 * MyPage 페이지
 *
 * - 사용자 정보를 표시하는 프로필 페이지.
 * - 사용자 닉네임과 이메일을 표시하며, 메시지함, 친구 추가, 친구 목록으로의 액세스를 제공합니다.
 * - 로그아웃 기능을 지원합니다.
 *
 * 주요 기능:
 * 1. 사용자의 닉네임, 이메일 및 프로필 이미지를 표시.
 * 2. 메시지함, 친구 추가, 친구 목록으로의 이동 버튼 제공.
 * 3. 로그아웃 버튼을 통해 사용자 세션을 종료하고 로그인 페이지로 이동.
 *
 * @returns {React.ReactElement} 사용자 정보를 표시하는 프로필 화면.
 */
export default function MyPage() {
  const { height } = useWindowDimensions(); // 화면 높이에 따른 아이콘 크기 동적 계산
  const iconSize = height * 0.25;

  const userData = useRecoilValue(userDataState); // 사용자 데이터 가져오기

  /**
   * 로그아웃 처리
   * - 로그아웃 후 로그인 페이지로 이동.
   */
  const handleSignOut = async () => {
    signOutUser().then(() => router.replace("/SignIn"));
  };

  return (
    <View style={styles.container}>
      {/* 프로필 카드 */}
      <View style={styles.profileCard}>
        {/* 프로필 아이콘 */}
        <Ionicons
          name="person-circle-outline"
          size={iconSize} // 화면 크기에 비례한 아이콘 크기
          color="#4641A7"
        />

        {/* 사용자 이름 및 이메일 */}
        <Text style={styles.userName}>{userData?.nickname ?? "Nickname"}</Text>
        <Text style={styles.userEmail}>{userData?.email ?? "Email"}</Text>

        {/* 메시지함, 친구 추가, 친구 목록 아이콘 */}
        <View style={styles.iconContainer}>
          <TouchableOpacity style={styles.profileIcon}>
            <Ionicons name="mail-outline" size={35} color="#6C4AB6" />
            <Text>메세지함</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileIcon}>
            <Ionicons name="person-add-outline" size={35} color="#6C4AB6" />
            <Text>친구추가</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileIcon}>
            <Ionicons name="people-outline" size={35} color="#6C4AB6" />
            <Text>친구목록</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 로그아웃 버튼 */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
        <Text style={styles.logoutButtonText}>로그아웃</Text>
      </TouchableOpacity>
    </View>
  );
}

/**
 * 스타일 정의
 */
const styles = StyleSheet.create({
  // 화면 전체 컨테이너
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: "5%",
    gap: 20, // 요소 간의 간격
  },
  // 프로필 카드
  profileCard: {
    flex: 8, // 프로필 카드 영역 확장
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#6C4AB6",
    justifyContent: "center",
    gap: 10, // 요소 간의 간격
  },
  // 사용자 이름
  userName: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
  },
  // 사용자 이메일
  userEmail: {
    fontSize: 23,
    fontWeight: "400",
    textAlign: "center",
  },
  // 아이콘 그룹 컨테이너
  iconContainer: {
    flexDirection: "row", // 아이콘을 가로로 정렬
    justifyContent: "space-around", // 아이콘 간의 간격 유지
    margin: "10%",
    gap: 30, // 아이콘 간의 간격
  },
  // 개별 아이콘 컨테이너
  profileIcon: {
    alignItems: "center", // 아이콘과 텍스트를 중앙 정렬
  },
  // 로그아웃 버튼
  logoutButton: {
    flex: 1, // 버튼 높이 조절
    marginHorizontal: "10%", // 버튼 좌우 여백
    backgroundColor: "#E8E8E8",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  // 로그아웃 버튼 텍스트
  logoutButtonText: {
    color: "#888888",
    fontSize: 18,
    fontWeight: "bold",
  },
});
