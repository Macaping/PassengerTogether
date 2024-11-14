import { supabase } from "@/lib/supabase";
import { AuthError, User, UserResponse } from "@supabase/supabase-js";
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
//로그인 유저 auth정보 가져오기
export async function getUserFromSupabase() {
  return supabase.auth
    .getUser()
    .then((value: UserResponse) => {
      if (value.error) throw value.error;
      return value.data;
    })
    .catch((error: AuthError) => {
      console.log("사용자 정보를 가져오는 중 오류 발생:", error.message);
    });
}
//users테이블에서 로그인 유저의 정보 받아오기
export async function getUserByUUID(uuid: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", uuid);

  if (error) {
    console.error("UUID로 사용자 정보를 가져오는 중 오류 발생:", error.message);
    return null;
  }

  return data?.[0] ?? null;
}
