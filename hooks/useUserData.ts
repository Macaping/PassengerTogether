import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/supabase_type";
import { useEffect, useState } from "react";
import { useUser } from "./useUser";

type UserData = Database["public"]["Tables"]["users"]["Row"];

/**
 * 현재 사용자의 데이터를 가져오고 실시간으로 구독하는 커스텀 훅
 *
 * @remarks
 * 이 훅은 Supabase의 실시간 구독 기능을 사용하여 사용자 데이터의 변경사항을 즉시 반영합니다.
 *
 * @example
 * ```typescript
 * const { userData } = useUserData();
 * ```
 */
export function useUserData() {
  const { user } = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    // 초기화
    if (!user?.id) {
      // 사용자가 없는 경우
      setUserData(null);
    } else {
      // 사용자가 있는 경우
      supabase
        .schema("public")
        .from("users")
        .select("*")
        .eq("user_id", user.id)
        .single()
        .then((value) => {
          setUserData(value.data);
        });

      // 실시간 구독
      supabase
        .channel("userData")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "users",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            setUserData(payload.new as UserData);
          },
        )
        .subscribe();
    }
    return () => {
      // 이전 구독 해제
      supabase.getChannels().forEach((channel) => {
        if (channel.subTopic === "userData") {
          channel.unsubscribe();
        }
      });
    };
  }, [user]);

  return { userData };
}
