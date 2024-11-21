import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/supabase_type";
import { useEffect, useState } from "react";
import { useUserData } from "./useUserData";

type Room = Database["public"]["Tables"]["rooms"]["Row"];

export function useParty() {
  const { userData } = useUserData();
  const [roomData, setRoomData] = useState<Room | null>(null);

  // 참가하는 방의 ID가 다른 경우에 실행
  useEffect(() => {
    if (!userData?.current_party) {
      setRoomData(null);
    } else {
      // 초기화
      supabase
        .from("rooms")
        .select("*")
        .eq("id", userData.current_party)
        .single()
        .then((value) => {
          setRoomData(value.data);
        });

      // 실시간 구독
      const subscription = supabase
        .channel("party")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "rooms",
            filter: `id=eq.${userData.current_party}`,
          },
          (payload) => {
            setRoomData(payload.new as Room);
            supabase.getChannels().forEach((channel) => {
              console.log(
                "useParty에서 발생. 구독 중인 채널:",
                channel.subTopic,
              );
            });
          },
        )
        .subscribe();
    }
    return () => {
      // 이전 구독 해제
      supabase.getChannels().forEach((channel) => {
        if (channel.subTopic === "party") {
          channel.unsubscribe();
        }
      });
    };
  }, [userData]);

  return { roomData };
}
