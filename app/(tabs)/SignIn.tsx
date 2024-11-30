import { signInUser } from "@/utils/auth.utils";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/**
 * SignInView 컴포넌트
 *
 * - 사용자 로그인 화면을 제공합니다.
 * - 사용자가 이메일과 비밀번호를 입력하고 로그인을 시도할 수 있습니다.
 * - 로그인 실패 시 에러 메시지를 표시합니다.
 *
 * 주요 기능:
 * 1. 이메일과 비밀번호 입력 폼.
 * 2. 로그인 버튼을 통해 인증 요청.
 * 3. 로그인 실패 시 에러 메시지 표시.
 * 4. 회원가입 페이지로 이동할 수 있는 링크 제공.
 *
 * @returns {React.ReactElement} 로그인 화면 UI.
 */
export default function SignInView() {
  const [email, setEmail] = useState(""); // 이메일 입력 상태
  const [password, setPassword] = useState(""); // 비밀번호 입력 상태
  const [errorMessage, setErrorMessage] = useState(""); // 로그인 실패 메시지 상태

  /**
   * 로그인 처리 함수
   * - 이메일과 비밀번호를 사용하여 로그인 시도.
   * - 로그인 성공 시 메인 페이지로 이동.
   * - 실패 시 에러 메시지를 상태로 설정.
   */
  const handleSignIn = async () => {
    signInUser(email, password)
      .then(() => router.replace("/(tabs)")) // 로그인 성공 시 이동
      .catch((e: string) => setErrorMessage(e)); // 실패 시 에러 메시지 설정
  };

  return (
    <View style={styles.container}>
      {/* 화면 제목 */}
      <Text style={styles.title}>Passenger Together.</Text>
      <Text style={styles.subtitle}>Call Van Matching App</Text>

      {/* 이메일 입력 */}
      <Text style={styles.label}>이메일</Text>
      <TextInput
        style={styles.input}
        placeholder="이메일을 입력하세요"
        value={email}
        onChangeText={setEmail}
      />

      {/* 비밀번호 입력 */}
      <Text style={styles.label}>비밀번호</Text>
      <TextInput
        style={[styles.input, errorMessage ? styles.errorInput : null]}
        placeholder="비밀번호를 입력하세요"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      {/* 로그인 버튼 */}
      <TouchableOpacity style={styles.loginButton} onPress={handleSignIn}>
        <Text style={styles.loginButtonText}>로그인</Text>
      </TouchableOpacity>

      {/* 회원가입 링크 */}
      <Text style={styles.footerText}>
        <Text>아직 회원이 아니신가요?</Text>
        <Text>{"  "}</Text>
        <Link style={styles.signupText} href="/SignUp">
          회원가입
        </Link>
      </Text>
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
    justifyContent: "center", // 세로 가운데 정렬
    alignItems: "center", // 가로 가운데 정렬
    backgroundColor: "#f5f5f5", // 배경색
  },
  // 제목 스타일
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#5D3FD3", // 보라색 텍스트
    marginBottom: 8,
    width: "80%", // 화면 너비의 80%
    textAlign: "left",
  },
  // 부제목 스타일
  subtitle: {
    fontSize: 16,
    color: "#999999", // 회색 텍스트
    marginBottom: 24,
    width: "80%",
    textAlign: "left",
  },
  // 라벨 스타일
  label: {
    width: "80%",
    textAlign: "left",
    fontSize: 14,
    color: "#000",
    marginBottom: 4,
  },
  // 입력 필드 스타일
  input: {
    width: "80%",
    height: 50,
    borderColor: "#CCCCCC", // 테두리 색상
    borderWidth: 1,
    borderRadius: 8, // 둥근 모서리
    paddingHorizontal: 16, // 좌우 여백
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  // 입력 필드 에러 스타일
  errorInput: {
    borderColor: "#FF0000", // 빨간색 테두리
  },
  // 에러 메시지 텍스트 스타일
  errorText: {
    color: "#FF0000", // 빨간색 텍스트
    fontSize: 12,
    marginBottom: 24,
    marginTop: -4, // 위쪽 여백 제거
    width: "80%",
    marginLeft: 2, // 왼쪽 여백
    textAlign: "left",
  },
  // 로그인 버튼 스타일
  loginButton: {
    width: "80%",
    height: 50,
    backgroundColor: "#5D3FD3", // 보라색 배경
    justifyContent: "center", // 세로 가운데 정렬
    alignItems: "center", // 가로 가운데 정렬
    borderRadius: 8,
    marginBottom: 12,
  },
  // 로그인 버튼 텍스트 스타일
  loginButtonText: {
    color: "#fff", // 흰색 텍스트
    fontSize: 16,
    fontWeight: "bold",
  },
  // 하단 텍스트 스타일
  footerText: {
    fontSize: 14,
    color: "#999999", // 회색 텍스트
    marginTop: 16,
  },
  // 회원가입 링크 텍스트 스타일
  signupText: {
    color: "#5D3FD3", // 보라색 텍스트
    fontWeight: "bold",
  },
});
