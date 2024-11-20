import { supabase } from "@/lib/supabase";
import { getUserByUUID, getUserFromSupabase } from "@/utils/auth.utils";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserFromSupabase()
      .then((value: void | { user: User }) => {
        const currentUser = value?.user ?? null;
        setUser(currentUser); //로그인 유저 auth정보 저장
        if (currentUser?.id) {
          getUserByUUID(currentUser.id).then((data) => setUserData(data)); //로그인 유저 users테이블 정보 저장
        }
      })
      .finally(() => setLoading(false))
      .catch((error: Error) => {
        console.log(error.message);
      });

    // 인증 상태 변경 구독
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser?.id) {
        getUserByUUID(currentUser.id).then((data) => setUserData(data));
      } else {
        setUserData(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, userData, loading };
}
