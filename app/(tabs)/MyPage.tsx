import { signOutUser } from "@/utils/auth.utils";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyPage() {
  const handleSignOut = async () => {
    signOutUser().then(() => {
      router.replace("/(tabs)/SignIn");
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileCard}>
        <Ionicons
          name="person-circle-outline"
          size={Dimensions.get("window").width * 0.45} // 이미지 크기를 화면 비율로 설정
          color="#6C4AB6"
          style={styles.icon}
        />

        <Text style={styles.userName}>하라마라탕</Text>
        <Text style={styles.userEmail}>haram@gmail.com</Text>

        <View style={styles.followContainer}>
          <View style={styles.followBox}>
            <Text style={styles.followLabel}>팔로워</Text>
            <Text style={styles.followCount}>32</Text>
          </View>
          <View style={styles.followBox}>
            <Text style={styles.followLabel}>팔로잉</Text>
            <Text style={styles.followCount}>32</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
        <Text style={styles.logoutButtonText}>로그아웃</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
  },
  header: {
    width: "100%",
    paddingVertical: "3%",
    backgroundColor: "#6C4AB6",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  profileCard: {
    width: "90%",
    marginTop: "10%",
    padding: "5%",
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#6C4AB6",
    height: "70%",
    justifyContent: "center",
  },
  icon: {
    marginBottom: "5%",
  },
  userName: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    bottom: "5%",
  },
  userEmail: {
    fontSize: 23,
    color: "gray",
    textAlign: "center",
    bottom: "6%",
  },
  followContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    bottom: "-15%",
  },
  followBox: {
    alignItems: "center",
  },
  followLabel: {
    fontSize: 15,
    color: "gray",
  },
  followCount: {
    fontSize: 25,
    fontWeight: "bold",
  },
  logoutButton: {
    position: "absolute",
    bottom: "5%",
    width: "90%",
    paddingVertical: "5%",
    backgroundColor: "#E0E0E0",
    alignItems: "center",
    borderRadius: 8,
  },
  logoutButtonText: {
    color: "#888888",
    fontSize: 20,
    fontWeight: "bold",
  },
});
