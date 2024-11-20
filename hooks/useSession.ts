import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { useEffect, useRef } from "react";

export function useSession() {
  const session = useRef<Session | null>(null);

  useEffect(() => {
    // 초기화
    supabase.auth
      .getSession()
      .then((value) => (session.current = value.data.session));

    // 실시간 구독
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, sessionRealtime) => {
        session.current = sessionRealtime;
      },
    );

    return () => {
      // 구독 해제
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return { session };
}
