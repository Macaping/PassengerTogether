import { supabase } from "@/lib/supabase";
import { signInWithEmail, signOut, signUpWithEmail } from "@/services/auth";
import { AuthError, PostgrestError, User } from "@supabase/supabase-js";
import * as Notifications from "expo-notifications";

async function getExpoPushToken() {
  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus === "granted") {
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      if (!token) {
        console.warn("푸시 토큰을 받아오지 못했습니다.");
      }
      return token;
    } else {
      console.warn("푸시 알림 권한이 없습니다.");
      return null;
    }
  } catch (error) {
    console.error("푸시 토큰을 가져오는 중 오류 발생:", error.message);
    return null;
  }
}

// 로그인
export async function signInUser(
  email: string,
  password: string,
): Promise<User> {
  if (!email || !password) throw "이메일과 비밀번호를 입력해주세요.";

  try {
    // 사용자 로그인 시도
    const user = await signInWithEmail(email, password);

    if (user && user.id) {
      // 로그인 후 푸시 토큰 저장
      const token = await getExpoPushToken();
      if (token) {
        const { error } = await supabase
          .from("users")
          .update({ expo_push_token: token })
          .eq("user_id", user.id);

        if (error) {
          console.error("푸시 토큰 저장 중 오류 발생:", error.message);
        }
      }
    }

    return user;
  } catch (e: any) {
    if (e.message === "Invalid login credentials")
      throw "이메일 또는 비밀번호가 일치하지 않습니다.";
    else throw e.message;
  }
}

// 회원가입
export async function signUpUser(
  email: string,
  password: string,
  confirmPassword: string,
  nickname: string,
): Promise<User> {
  if (!email || !password || !confirmPassword || !nickname)
    throw "모든 항목을 입력해주세요.";
  if (!validateEmail(email)) throw "올바른 이메일 주소를 입력해주세요.";
  if (!validatePassword(password, confirmPassword))
    throw "비밀번호가 일치하지 않습니다.";
  if (!verifyPasswordCriteria(password))
    throw "비밀번호는 최소 8자 이상, 하나 이상의 대문자, 소문자, 숫자 및 특수 문자가 필요합니다.";
  if (nickname.length < 2) throw "닉네임은 2자 이상이어야 합니다.";

  try {
    // 회원가입 실행
    const user = await signUpWithEmail(email, password, nickname);

    if (user && user.id) {
      // 회원가입 후 푸시 토큰 저장
      const token = await getExpoPushToken();
      if (token) {
        const { error } = await supabase
          .from("users")
          .update({ expo_push_token: token })
          .eq("user_id", user.id);

        if (error) {
          console.error("푸시 토큰 저장 중 오류 발생:", error.message);
        }
      }
    }

    return user;
  } catch (e: AuthError | PostgrestError) {
    if (e.message === "User already registered")
      throw "이미 사용 중인 이메일입니다.";
    // 닉네임 중복 시 발생하는 오류
    if (e.message === "Database error saving new user")
      throw "사용할 수 없는 닉네임입니다.";
    else throw e.message;
  }
}

// 사전에 데이터가 올바른지 확인하는 함수
const validateEmail = (email: string) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// 비밀번호와 확인 비밀번호가 일치하는지 확인하는 함수
const validatePassword = (password: string, confirmPassword: string) => {
  return password === confirmPassword;
};

// 비밀번호 조건을 충족하는지 확인하는 함수
const verifyPasswordCriteria = (password: string) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// 로그아웃
export async function signOutUser(): Promise<void> {
  return signOut().catch((e: Error) => {
    console.error(e.message);
  });
}
