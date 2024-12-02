import { partyState } from "@/atoms/partyState";
import { userDataState } from "@/atoms/userDataState";
import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/supabase_type";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

type Room = Database["public"]["Tables"]["rooms"]["Row"];

/**
 * 사용자의 현재 파티(방) 정보를 관리하는 커스텀 훅
 *
 * @remarks
 * 이 훅은 Supabase를 사용하여 실시간으로 방 정보를 구독하고 업데이트합니다.
 *
 * @example
 * ```typescript
 * const { roomData } = useParty();
 * if (roomData) {
 *   console.log('현재 방 정보:', roomData);
 * }
 * ```
 *
 * @description
 * - userData.current_party가 변경될 때마다 새로운 방 정보를 불러옵니다.
 * - 실시간 구독을 통해 방 정보가 업데이트될 때마다 자동으로 상태가 갱신됩니다.
 * - 컴포넌트가 언마운트되면 자동으로 구독이 해제됩니다.
 */
export function useParty() {
  const userData = useRecoilValue(userDataState);
  const [roomData, setRoomData] = useRecoilState(partyState);

  // 참가하는 방의 ID가 다른 경우에 실행
  useEffect(() => {
    // 초기화
    if (!userData?.current_party) {
      // 사용자가 방에 참가하지 않은 경우
      setRoomData(null);
    } else {
      // 사용자가 방에 참가한 경우
      supabase
        .from("rooms")
        .select("*")
        .eq("id", userData.current_party)
        .single()
        .then((value) => {
          setRoomData(value.data);
        });

      // 실시간 구독
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
            setRoomData(payload.new as Room);
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
  }, [setRoomData, userData?.current_party]);

  return { roomData };
}
