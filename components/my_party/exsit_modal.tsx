import { LeaveRoom } from "@/services/leave_room";
import { router } from "expo-router";
import { Text, TouchableOpacity, Modal, View, StyleSheet } from "react-native";
import { styles } from "./icon_styles";
import React from "react";

interface ExsitModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function ExsitModal({ isVisible, onClose }: ExsitModalProps) {
  function handleLeaveRoom() {
    LeaveRoom()
      .then(() => {
        router.replace("/(tabs)");
      })
      .catch((error: Error) => console.error("나가기 오류:", error));
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          <Text style={modalStyles.modalText}>방을 나가시겠습니까?</Text>
          <View style={modalStyles.buttonContainer}>
            <TouchableOpacity
              style={[modalStyles.button, modalStyles.cancelButton]}
              onPress={onClose}
            >
              <Text style={modalStyles.buttonText}>아니오</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[modalStyles.button, modalStyles.confirmButton]}
              onPress={() => {
                onClose();
                handleLeaveRoom();
              }}
            >
              <Text style={modalStyles.buttonText}>예</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
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
