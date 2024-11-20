import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/supabase_type";
import { useEffect, useState } from "react";
import { useUser } from "./useUser";

type UserData = Database["public"]["Tables"]["users"]["Row"];

export function useUserData() {
  const { user } = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    supabase.channel("users").unsubscribe(); // 이전 구독 해제
    if (!user) {
      setUserData(null);
    } else {
      // 초기화
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
      const subscription = supabase
        .channel("users")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "users",
            filter: "user_id=eq." + user.id,
          },
          (payload) => {
            setUserData(payload.new as UserData);
          },
        )
        .subscribe();

      return () => {
        // 구독 해제
        subscription.unsubscribe();
      };
    }
    return () => {
      // 있는 경우 구독 해제
      supabase.channel("users").unsubscribe();
    };
  }, [user]);

  return { userData, setUserData };
}
