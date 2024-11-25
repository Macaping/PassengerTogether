import { useAuthUser } from "@/hooks/useAuthUser";
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

export default function MyPage() {
  const { height } = useWindowDimensions();
  const iconSize = height * 0.25;

  const { userData } = useAuthUser();

  const handleSignOut = async () => {
    signOutUser().then(() => router.replace("/SignIn"));
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <Ionicons
          name="person-circle-outline"
          size={iconSize} // 이미지 크기를 화면 비율로 설정
          color="#4641A7"
        />

        <Text style={styles.userName}>{userData?.nickname ?? "Nickname"}</Text>
        <Text style={styles.userEmail}>{userData?.email ?? "Email"}</Text>

        {/*밑에 아이콘 세개 크기*/}
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

      <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
        <Text style={styles.logoutButtonText}>로그아웃</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: "5%",
    gap: 20,
  },
  profileCard: {
    flex: 8, //카드 밑으로 늘리기
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#6C4AB6",
    justifyContent: "center",
    gap: 10,
  },
  userName: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
  },
  userEmail: {
    fontSize: 23,
    fontWeight: "400",
    textAlign: "center",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    margin: "10%",
    gap: 30,
  },
  profileIcon: {
    alignItems: "center",
  },
  logoutButton: {
    flex: 1,
    marginHorizontal: "10%",
    backgroundColor: "#E8E8E8",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },

  logoutButtonText: {
    color: "#888888",
    fontSize: 18,
    fontWeight: "bold",
  },
});
