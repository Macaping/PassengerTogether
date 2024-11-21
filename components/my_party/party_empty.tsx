import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export default function PartyEmpty() {
  return (
    <View style={styles.background}>
      <View style={styles.container}>
        {/* 아이콘  */}
        <View style={styles.iconContainer}>
          <Ionicons
            style={styles.icon}
            name="ticket-outline"
            size={80}
            color="#6049E2"
          />
        </View>
        <Text style={styles.text}>현재 참여한 파티가 없습니다.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    gap: 40,
  },
  text: {
    fontSize: 20,
    color: "#000000",
  },

  iconContainer: {
    width: 150,
    height: 150,
    borderRadius: 100,
    backgroundColor: "#6049E2",
    justifyContent: "center", // 내부 콘텐츠 수직 정렬
    alignItems: "center", // 내부 콘텐츠 수평 정렬
  },
  icon: {
    color: "#FFFFFF",
    // bottom: "50%", // 아이콘과 텍스트 사이 간격
  },
});
