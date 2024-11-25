import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./icon_styles";
import 나가기Modal from "./나가기_modal";

export default function 나가기() {
  const [isLeaveModalVisible, setIsLeaveModalVisible] = useState(false);

  return (
    <View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsLeaveModalVisible(true)}
      >
        <Ionicons name="exit-outline" size={32} color="#666666" />
        <Text style={styles.buttonText}>나가기</Text>
      </TouchableOpacity>
      <나가기Modal
        isVisible={isLeaveModalVisible}
        setVisible={setIsLeaveModalVisible}
      />
    </View>
  );
}
