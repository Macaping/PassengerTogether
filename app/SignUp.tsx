import { signUpUser } from "@/utils/auth.utils";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/**
 * SignUpView 페이지
 *
 * - 새로운 사용자가 회원가입을 할 수 있는 화면입니다.
 * - 사용자는 이메일, 비밀번호, 닉네임을 입력하여 계정을 생성할 수 있습니다.
 * - 입력 검증 실패 시 에러 메시지를 표시합니다.
 *
 * 주요 기능:
 * 1. 이메일, 비밀번호, 비밀번호 확인, 닉네임 입력 필드를 제공합니다.
 * 2. 입력된 정보를 기반으로 회원가입 요청을 처리합니다.
 * 3. 성공 시 홈 화면으로 이동하며, 실패 시 에러 메시지를 표시합니다.
 *
 * @returns {React.ReactElement} 회원가입 화면 UI.
 */
export default function SignUpView() {
  // 상태 관리
  const [email, setEmail] = useState(""); // 이메일 상태
  const [password, setPassword] = useState(""); // 비밀번호 상태
  const [confirmPassword, setConfirmPassword] = useState(""); // 비밀번호 확인 상태
  const [nickname, setNickname] = useState(""); // 닉네임 상태
  const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지 상태

  /**
   * 회원가입 처리 함수
   * - 입력된 정보를 사용하여 회원가입 요청을 보냅니다.
   * - 성공 시 홈 화면으로 이동하며, 실패 시 에러 메시지를 표시합니다.
   */
  const handleSignUp = async () => {
    signUpUser(email, password, confirmPassword, nickname)
      .then(() => router.dismissAll()) // 모든 이전 화면 닫기
      .then(() => router.replace("/(tabs)")) // 탭 화면으로 이동
      .catch((e: string) => setErrorMessage(e)); // 실패 시 에러 메시지 설정
  };

  return (
    <View style={styles.container}>
      {/* 화면 제목 */}
      <Text style={styles.title}>Passenger Together.</Text>
      <Text style={styles.subtitle}>Call Van Matching App</Text>

      {/* 이메일 입력 */}
      <TextInput
        style={styles.input}
        placeholder="이메일을 입력하세요"
        value={email}
        onChangeText={setEmail}
      />

      {/* 비밀번호 입력 */}
      <TextInput
        style={styles.input}
        placeholder="비밀번호를 입력하세요"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* 비밀번호 확인 입력 */}
      <TextInput
        style={styles.input}
        placeholder="비밀번호를 한번 더 입력하세요"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      {/* 닉네임 입력 */}
      <TextInput
        style={styles.input}
        placeholder="두글자 이상의 닉네임을 입력하세요"
        value={nickname}
        onChangeText={setNickname}
      />

      {/* 에러 메시지 */}
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      {/* 회원가입 버튼 */}
      <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
        <Text style={styles.signupButtonText}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );
}

/**
 * 스타일 정의
 */
const styles = StyleSheet.create({
  // 화면 전체 컨테이너 스타일
  container: {
    flex: 1,
    justifyContent: "center", // 세로 중앙 정렬
    alignItems: "center", // 가로 중앙 정렬
    backgroundColor: "#f5f5f5", // 연한 회색 배경
  },
  // 제목 텍스트 스타일
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#5D3FD3", // 보라색 텍스트
    marginBottom: 8,
    width: "80%",
    textAlign: "left", // 왼쪽 정렬
  },
  // 부제목 텍스트 스타일
  subtitle: {
    fontSize: 16,
    color: "#999999", // 회색 텍스트
    marginBottom: 24,
    width: "80%",
    textAlign: "left",
  },
  // 입력 필드 스타일
  input: {
    width: "80%", // 화면의 80% 너비
    height: 50,
    borderColor: "#CCCCCC", // 연한 회색 테두리
    borderWidth: 1,
    borderRadius: 8, // 둥근 모서리
    paddingHorizontal: 16, // 내부 좌우 여백
    marginBottom: 12, // 아래 여백
    backgroundColor: "#fff", // 흰색 배경
  },
  // 에러 메시지 텍스트 스타일
  errorText: {
    color: "#FF0000", // 빨간색 텍스트
    fontSize: 12,
    marginBottom: 12, // 아래 여백
    textAlign: "left", // 왼쪽 정렬
    width: "80%",
  },
  // 회원가입 버튼 스타일
  signupButton: {
    width: "80%",
    height: 50,
    backgroundColor: "#5D3FD3", // 보라색 배경
    justifyContent: "center", // 세로 중앙 정렬
    alignItems: "center", // 가로 중앙 정렬
    borderRadius: 8, // 둥근 모서리
    marginTop: 16, // 위쪽 여백
  },
  // 회원가입 버튼 텍스트 스타일
  signupButtonText: {
    color: "#fff", // 흰색 텍스트
    fontSize: 16,
    fontWeight: "bold", // 굵은 텍스트
  },
});
