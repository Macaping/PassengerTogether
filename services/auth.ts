import { supabase } from "@/lib/supabase";
import {
  AuthError,
  AuthResponse,
  AuthTokenResponsePassword,
  PostgrestSingleResponse,
  User,
} from "@supabase/supabase-js";

// 로그인
export async function signInWithEmail(
  email: string,
  password: string,
): Promise<User> {
  return supabase.auth
    .signInWithPassword({ email: email, password: password })
    .then((value: AuthTokenResponsePassword) => {
      if (value.error) {
        throw value.error;
      }
      if (!value.data.user) {
        throw new Error("User is null");
      }
      return value.data.user;
    });
}

// 회원가입
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
          // 닉네임 추가
          username: nickname,
        },
      },
    })
    .then((value: AuthResponse) => {
      if (value.error) {
        throw value.error;
      }
      if (!value.data.user) {
        throw new Error("User is null");
      }
      return value.data.user;
    });
}

// 로그아웃
export async function signOut(): Promise<void> {
  supabase.auth.signOut().then((value: { error: AuthError | null }) => {
    if (value.error) {
      throw value.error;
    }
  });
}
