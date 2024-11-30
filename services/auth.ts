import { supabase } from "@/lib/supabase";
import {
  AuthError,
  AuthResponse,
  AuthTokenResponsePassword,
  User,
} from "@supabase/supabase-js";

/**
 * 이메일과 비밀번호를 사용하여 로그인합니다.
 *
 * @param {string} email - 로그인에 사용할 이메일 주소
 * @param {string} password - 로그인에 사용할 비밀번호
 *
 * @returns {Promise<User>} 로그인된 사용자 정보를 반환
 *
 * @throws {AuthError} 로그인 실패 시 발생하는 Supabase 인증 에러
 * @throws {Error} 사용자 정보가 null인 경우
 */
export async function signInWithEmail(
  email: string,
  password: string,
): Promise<User> {
  return supabase.auth
    .signInWithPassword({ email: email, password: password })
    .then((value: AuthTokenResponsePassword) => {
      if (value.error) {
        throw value.error; // Supabase 인증 에러 처리
      }
      if (!value.data.user) {
        throw new Error("User is null"); // 사용자 정보가 null일 경우 에러 발생
      }
      return value.data.user; // 로그인된 사용자 정보 반환
    });
}

/**
 * 이메일, 비밀번호, 닉네임을 사용하여 회원가입을 수행합니다.
 *
 * @param {string} email - 회원가입에 사용할 이메일 주소
 * @param {string} password - 회원가입에 사용할 비밀번호
 * @param {string} nickname - 회원가입 시 설정할 닉네임
 *
 * @returns {Promise<User>} 회원가입이 완료된 사용자 정보를 반환
 *
 * @throws {AuthError} 회원가입 실패 시 발생하는 Supabase 인증 에러
 * @throws {Error} 사용자 정보가 null인 경우
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  nickname: string,
): Promise<User> {
  return supabase.auth
    .signUp({
      email: email,
      password: password,
      options: {
        data: {
          // 사용자 추가 데이터에 닉네임 포함
          username: nickname,
        },
      },
    })
    .then((value: AuthResponse) => {
      if (value.error) {
        throw value.error; // Supabase 인증 에러 처리
      }
      if (!value.data.user) {
        throw new Error("User is null"); // 사용자 정보가 null일 경우 에러 발생
      }
      return value.data.user; // 회원가입된 사용자 정보 반환
    });
}

/**
 * 현재 로그인된 사용자를 로그아웃합니다.
 *
 * @returns {Promise<void>} 로그아웃 완료 시 반환값 없음
 *
 * @throws {AuthError} 로그아웃 실패 시 발생하는 Supabase 인증 에러
 */
export async function signOut(): Promise<void> {
  supabase.auth.signOut().then((value: { error: AuthError | null }) => {
    if (value.error) {
      throw value.error; // Supabase 인증 에러 처리
    }
  });
}
