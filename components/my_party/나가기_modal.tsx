import { LeaveRoom } from "@/services/leave_room";
import { router } from "expo-router";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface 나가기ModalProps {
  isVisible: boolean;
  setVisible: (visible: boolean) => void;
}

export default function 나가기Modal({
  isVisible,
  setVisible,
}: 나가기ModalProps) {
  const onClose = () => setVisible(false);

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
            {/* 아니오 */}
            <TouchableOpacity
              style={[modalStyles.button, modalStyles.cancelButton]}
              // 모달창 닫기
              onPress={onClose}
            >
              <Text style={modalStyles.buttonText}>아니오</Text>
            </TouchableOpacity>
            {/* 예 */}
            <TouchableOpacity
              style={[modalStyles.button, modalStyles.confirmButton]}
              // 모달창 닫기
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
  // 뒷배경
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  // 모달창
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: "10%",
    gap: 20,
  },
  // 몯달창 안 텍스트
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
  },
  // 버튼 영역
  buttonContainer: {
    flexDirection: "row",
    gap: 20,
  },
  // 버튼의 공통 스타일
  button: {
    borderRadius: 10,
    padding: 10,
    width: 100,
  },
  // 아니오 버튼 색상
  cancelButton: {
    backgroundColor: "#888",
  },
  // 예 버튼 색상
  confirmButton: {
    backgroundColor: "#6049E2",
  },
  // 버튼 공통 텍스트
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
});
