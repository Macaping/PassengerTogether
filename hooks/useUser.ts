import { sessionState } from "@/atoms/sessionState";
import { userState } from "@/atoms/userState";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

/**
 * 현재 사용자 정보를 가져오는 커스텀 훅입니다.
 *
 * @example
 * ```tsx
 * const { user } = useUser();
 * if (user) {
 *   console.log(user.name);
 * }
 * ```
 */
export function useUser() {
  const session = useRecoilValue(sessionState);
  const [user, setUser] = useRecoilState(userState);

  useEffect(() => {
    setUser(session?.user);
  }, [session?.user, setUser]);

  return { user };
}
