import { supabase } from "@/lib/supabase";
import { signInWithEmail, signOut, signUpWithEmail } from "@/services/auth";
import { AuthError, PostgrestError, User } from "@supabase/supabase-js";
import * as Notifications from "expo-notifications";

/**
 * Expo 푸시 알림 토큰을 가져옵니다.
 *
 * @returns {Promise<string | null>}
 * - 성공 시: 푸시 알림 토큰을 반환.
 * - 실패 시: null 반환.
 */
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
  } catch (error: any) {
    console.error("푸시 토큰을 가져오는 중 오류 발생:", error.message);
    return null;
  }
}

/**
 * 사용자 로그인 함수
 *
 * @param {string} email - 사용자 이메일.
 * @param {string} password - 사용자 비밀번호.
 *
 * @returns {Promise<User>} 로그인된 사용자 정보.
 *
 * @throws {string} 입력값 부족 또는 인증 오류 시 발생하는 에러 메시지.
 */
export async function signInUser(
  email: string,
  password: string,
): Promise<User> {
  if (!email || !password) throw "이메일과 비밀번호를 입력해주세요.";

  try {
    const user = await signInWithEmail(email, password);

    if (user && user.id) {
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

/**
 * 사용자 회원가입 함수
 *
 * @param {string} email - 사용자 이메일.
 * @param {string} password - 사용자 비밀번호.
 * @param {string} confirmPassword - 비밀번호 확인.
 * @param {string} nickname - 사용자 닉네임.
 *
 * @returns {Promise<User>} 회원가입된 사용자 정보.
 *
 * @throws {string} 입력값 부족, 조건 불충족, 또는 인증 오류 시 발생하는 에러 메시지.
 */
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
    const user = await signUpWithEmail(email, password, nickname);

    if (user && user.id) {
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
    if (e.message === "Database error saving new user")
      throw "사용할 수 없는 닉네임입니다.";
    else throw e.message;
  }
}

/**
 * 로그아웃 함수
 *
 * @returns {Promise<void>} 반환값 없음.
 *
 * @throws {Error} 로그아웃 중 발생한 에러.
 */
export async function signOutUser(): Promise<void> {
  return signOut().catch((e: Error) => {
    console.error(e.message);
  });
}

/**
 * 이메일 유효성을 확인하는 함수
 *
 * @param {string} email - 확인할 이메일 주소.
 * @returns {boolean} 유효한 이메일 주소이면 true, 아니면 false.
 */
const validateEmail = (email: string) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * 비밀번호와 비밀번호 확인이 일치하는지 확인하는 함수
 *
 * @param {string} password - 비밀번호.
 * @param {string} confirmPassword - 비밀번호 확인.
 * @returns {boolean} 비밀번호가 일치하면 true, 아니면 false.
 */
const validatePassword = (password: string, confirmPassword: string) => {
  return password === confirmPassword;
};

/**
 * 비밀번호가 보안 조건을 충족하는지 확인하는 함수
 *
 * @param {string} password - 확인할 비밀번호.
 * @returns {boolean} 조건을 충족하면 true, 아니면 false.
 */
const verifyPasswordCriteria = (password: string) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};
