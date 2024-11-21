import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/supabase_type";
import { useEffect, useState } from "react";
import { useUserData } from "./useUserData";
import { User } from "@supabase/supabase-js";

type Room = Database["public"]["Tables"]["rooms"]["Row"];
type UserData = Database["public"]["Tables"]["users"]["Row"];

export function useParty() {
  // const { userData } = useUserData();
  // const [roomData, setRoomData] = useState<Room | null>(null);

  // // 참가하는 방의 ID가 다른 경우에 실행
  // useEffect(() => {
  //   if (!userData?.current_party) {
  //     setRoomData(null);
  //   } else {
  //     // 초기화
  //     supabase
  //       .from("rooms")
  //       .select("*")
  //       .eq("id", userData.current_party)
  //       .single()
  //       .then((value) => {
  //         setRoomData(value.data);
  //       });

  //     // 실시간 구독
  //     const subscription = supabase
  //       .channel("party")
  //       .on(
  //         "postgres_changes",
  //         {
  //           event: "*",
  //           schema: "public",
  //           table: "rooms",
  //           filter: `id=eq.${userData.current_party}`,
  //         },
  //         (payload) => {
  //           setRoomData(payload.new as Room);
  //           supabase.getChannels().forEach((channel) => {
  //             console.log("useParty에서 발생. 구독 중인 채널:", channel.subTopic);
  //           });
  //         },
  //       )
  //       .subscribe();
  //   }
  //   return () => {
  //     // 이전 구독 해제
  //     supabase.getChannels().forEach((channel) => {
  //       if (channel.subTopic === "party") {
  //         channel.unsubscribe();
  //       }
  //     });
  //   };
  // }, [userData]);

  // return { roomData };

  // 유저 계정 가져오기
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    supabase.auth.getUser().then((value) => {
      setUser(value.data.user);
    });
  }, []);

  // 유저 정보 가져오기
  const [userData, setUserData] = useState<UserData | null>(null);
  useEffect(() => {
    if (!user) {
      setUserData(null);
    } else {
      supabase
        .from("users")
        .select("*")
        .eq("user_id", user.id)
        .single()
        .then((value) => {
          setUserData(value.data);
        });
    }
  }, [user]);

  // 유저 정보 실시간 업데이트
  if (user?.id) {
    supabase
      .channel("userData")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "users",
          filter: `user_id=eq.${user?.id}`,
        },
        (payload) => {
          setUserData(payload.new as UserData);
        },
      )
      .subscribe();
  }

  // 방 정보 가져오기
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  useEffect(() => {
    if (!userData?.current_party) {
      setRoomData(null);
    } else {
      console.log(userData);
      supabase
        .from("rooms")
        .select("*")
        .eq("id", userData.current_party)
        .single()
        .then((value) => {
          setRoomData(value.data);
        });
      supabase.getChannels().forEach((channel) => {
        console.log("구독 중인 채널:", channel.subTopic);
        if (channel.subTopic.includes("party")) {
          channel.unsubscribe();
        }
      });
      supabase
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
            console.log("payload:", payload.new);
            setRoomData(payload.new as Room);
            console.log("roomData:", roomData);
          },
        )
        .subscribe();
      console.log("구독 개수", supabase.getChannels().length);
      supabase.getChannels().forEach((channel) => {
        console.log("구독 중인 채널:", channel.subTopic);
        if (channel.subTopic.includes("party")) {
          console.log("party 채널 구독 중");
        }
      });
    }
  }, [userData]);

  return { roomData };
}
