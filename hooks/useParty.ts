import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/supabase_type";
import { useEffect, useState } from "react";
import { useSession } from "./useSession";

type Room = Database["public"]["Tables"]["rooms"]["Row"];

export function useParty() {
  const { user } = useSession();
  const [currentParty, setCurrentParty] = useState<any | null>(null);
  const [roomData, setRoomData] = useState<Room | null>(null); // roomData의 타입을 Room으로 변경

  // 최초 데이터 로딩
  if (user) {
    supabase
      .from("users")
      .select("current_party")
      .eq("user_id", user?.id)
      .single()
      .then((value) => {
        setCurrentParty(value.data?.current_party);
      });
  }

  if (currentParty) {
    supabase
      .from("rooms")
      .select("*")
      .eq("id", currentParty)
      .single()
      .then((value) => {
        setRoomData(value.data);
      });
  }

  // 유저가 변경된 경우에 실행
  useEffect(() => {
    if (!user) {
      setCurrentParty(null);
      return;
    }

    console.log("유저 구독 시작");

    const subscription = supabase
      .channel("users")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "users",
          filter: "user_id=eq." + user.id,
        },
        (payload) => {
          console.log("User updated:", payload);
          setCurrentParty(payload.new.current_party);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user]);

  // 참가하고 있는 방 ID가 다른 경우에 실행
  useEffect(() => {
    if (!currentParty) {
      setRoomData(null);
      return;
    }
    console.log("방 구독 시작");

    const subscription = supabase
      .channel("rooms")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "rooms",
          filter: `id=eq.${currentParty}`,
        },
        (payload) => {
          setRoomData(payload.new as Room);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [currentParty]);

  return { roomData };
}
