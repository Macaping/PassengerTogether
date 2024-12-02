import { Session } from "@supabase/supabase-js";
import { atom } from "recoil";

/**
 * supabase의 세션 정보를 저장하는 atom
 *
 * @example
 * ```tsx
 * const session = useRecoilValue(sessionState);
 * ```
 *
 * @remarks
 * 이 atom은 supabase의 인증 상태를 저장합니다.
 */
export const sessionState = atom<Session | null>({
  key: "sessionState",
  default: null,
});
