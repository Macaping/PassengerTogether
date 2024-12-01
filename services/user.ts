import { supabase } from "@/lib/supabase";

/**
 * 현재 로그인된 사용자의 정보를 가져옵니다.
 *
 * @returns {Promise<User | undefined>}
 * - 성공 시: 현재 로그인된 사용자의 정보를 반환 (`User` 객체).
 * - 실패 시: `undefined`를 반환하며 에러 로그를 콘솔에 출력.
 *
 * @throws {AuthError} 인증 오류 발생 시 Supabase에서 반환된 에러를 throw합니다.
 * @throws {Error} 사용자 정보가 없을 경우 커스텀 에러를 throw합니다.
 */
export async function User() {
  return supabase.auth
    .getUser()
    .then((value) => {
      if (value.error) throw value.error; // 인증 오류 발생 시 처리
      if (!value.data) throw Error("사용자 정보가 없습니다."); // 사용자 정보가 없을 경우 에러 발생
      return value.data.user; // 사용자 정보 반환
    })
    .catch((error) => {
      console.error("User fetch error:", error); // 에러 발생 시 로그 출력
    });
}
