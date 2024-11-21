import { LeaveRoom } from "@/services/leave_room";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, Modal, View, StyleSheet } from "react-native";
import { styles } from "./icon_styles";

export default function 나가기() {
  const [isLeaveModalVisible, setIsLeaveModalVisible] = useState(false);
  const handleLeaveRoom = async () => {
    LeaveRoom()
      // 처음 페이지로 이동
      .then(() => router.replace("/(tabs)"))
      // 오류 처리
      .catch((error: Error) =>
        console.error("사용자 정보 가져오기 오류:", error),
      );
  };

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsLeaveModalVisible(true)}
      >
        <Ionicons name="people-outline" size={32} color="#666666" />
        <Text style={styles.buttonText}>나가기</Text>
      </TouchableOpacity>

      {/* 나가기 모달 */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isLeaveModalVisible}
        onRequestClose={() => setIsLeaveModalVisible(false)}
      >
        <View style={modalStyles.centeredView}>
          <View style={modalStyles.modalView}>
            <Text style={modalStyles.modalText}>방을 나가시겠습니까?</Text>
            <View style={modalStyles.buttonContainer}>
              <TouchableOpacity
                style={[modalStyles.button, modalStyles.cancelButton]}
                onPress={() => setIsLeaveModalVisible(false)}
              >
                <Text style={modalStyles.buttonText}>아니오</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[modalStyles.button, modalStyles.confirmButton]}
                onPress={() => {
                  setIsLeaveModalVisible(false);
                  handleLeaveRoom();
                }}
              >
                <Text style={modalStyles.buttonText}>예</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: "10%",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
    gap: 20,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    width: 100,
  },
  cancelButton: {
    backgroundColor: "#888",
  },
  confirmButton: {
    backgroundColor: "#6049E2",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
  },
});
