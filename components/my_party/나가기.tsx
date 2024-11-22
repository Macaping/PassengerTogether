import { LeaveRoom } from "@/services/leave_room";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./icon_styles";
import ExsitModal from "./exsit_modal"; // exsit_modal 컴포넌트 가져오기

export default function 나가기() {
  const [isLeaveModalVisible, setIsLeaveModalVisible] = useState(false);

  return (
    <View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsLeaveModalVisible(true)}
      >
        <Ionicons name="people-outline" size={32} color="#666666" />
        <Text style={styles.buttonText}>나가기</Text>
      </TouchableOpacity>
      <ExsitModal
        isVisible={isLeaveModalVisible}
        onClose={() => setIsLeaveModalVisible(false)}
      />
    </View>
  );
}
