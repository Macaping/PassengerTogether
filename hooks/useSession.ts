import { sessionState } from "@/atoms/sessionState";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import { useRecoilState } from "recoil";

/**
 * supabase의 세션 정보를 가져오고 실시간으로 구독하는 커스텀 훅
 *
 * @example
 * ```typescript
 * const { session } = useSession();
 * console.log(session);
 * ```
 *
 * @remarks
 * 이 훅은 Supabase의 인증 상태 변화를 감지하고, 세션 정보를 업데이트합니다.
 * 컴포넌트가 언마운트될 때 구독을 해제합니다.
 */
export function useSession() {
  const [session, setSession] = useRecoilState(sessionState);

  useEffect(() => {
    // 초기화
    supabase.auth.getSession().then((value) => setSession(value.data.session));

    // 실시간 구독
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
      },
    );

    return () => {
      // 구독 해제
      authListener?.subscription.unsubscribe();
    };
  }, [setSession]);

  return { session };
}
