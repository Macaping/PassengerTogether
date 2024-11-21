import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/supabase_type";
import { useEffect, useState } from "react";
import { useUser } from "./useUser";

type UserData = Database["public"]["Tables"]["users"]["Row"];

export function useUserData() {
  const { user } = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (!user?.id) {
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
        .channel("userData")
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
            supabase.getChannels().forEach((channel) => {
              console.log("useUserData에서 발생. 구독 중인 채널:", channel.subTopic);
            });
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

  return { userData, setUserData };
}
