import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/supabase_type";
import { useEffect, useState } from "react";
import { useUser } from "./useUser";
import { User } from "@supabase/supabase-js";

type UserData = Database["public"]["Tables"]["users"]["Row"];

export function useUserData() {
  // const { user } = useUser();
  // const [userData, setUserData] = useState<UserData | null>(null);

  // useEffect(() => {
  //   if (!user?.id) {
  //     setUserData(null);
  //   } else {
  //     // 초기화
  //     supabase
  //       .schema("public")
  //       .from("users")
  //       .select("*")
  //       .eq("user_id", user.id)
  //       .single()
  //       .then((value) => {
  //         setUserData(value.data);
  //       });

  //     // 실시간 구독
  //     const subscription = supabase
  //       .channel("userData")
  //       .on(
  //         "postgres_changes",
  //         {
  //           event: "*",
  //           schema: "public",
  //           table: "users",
  //           filter: "user_id=eq." + user.id,
  //         },
  //         (payload) => {
  //           setUserData(payload.new as UserData);
  //           supabase.getChannels().forEach((channel) => {
  //             console.log("useUserData에서 발생. 구독 중인 채널:", channel.subTopic);
  //           });
  //         },
  //       )
  //       .subscribe();
  //   }
  //   return () => {
  //     // 이전 구독 해제
  //     supabase.getChannels().forEach((channel) => {
  //       if (channel.subTopic === "userData") {
  //         channel.unsubscribe();
  //       }
  //     });
  //   };
  // }, [user]);

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

  return { userData, setUserData };
}
