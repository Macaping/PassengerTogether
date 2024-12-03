import { partyState } from "@/atoms/partyState";
import { passengersState } from "@/atoms/passengersState";
import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/supabase_type";
import { fetchUserById } from "@/services/fetchUser";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

type UserData = Database["public"]["Tables"]["users"]["Row"];

/**
 * 현재 사용자가 속한 파티의 동승자 목록을 관리하는 커스텀 훅
 *
 * @remarks
 * 이 훅은 Supabase를 사용하여 실시간으로 동승자 정보를 구독하고 업데이트합니다.
 *
 * @example
 * ```typescript
 * const { passengers } = usePassengers();
 * if (passengers) {
 *   console.log('동승자 목록:', passengers);
 * }
 * ```
 *
 * @description
 * - partyState가 변경될 때마다 새로운 동승자 목록을 불러옵니다.
 * - 실시간 구독을 통해 동승자 목록이 업데이트될 때마다 자동으로 상태가 갱신됩니다.
 * - 컴포넌트가 언마운트되면 자동으로 구독이 해제됩니다.
 */
export function usePassengers() {
  // 파티 데이터
  const partyData = useRecoilValue(partyState);
  // 동승자 데이터
  const [passengers, setPassengers] = useRecoilState(passengersState);

  useEffect(() => {
    // 초기화
    const refresh = async () => {
      if (!partyData?.users) {
        return;
      }
      // 동승자 목록 데이터 가져오기
      const temp: UserData[] = (
        await Promise.all(partyData.users.map((user) => fetchUserById(user)))
      ).filter((user): user is UserData => user !== null);
      // 동승자 목록 업데이트
      setPassengers(temp);
    };
    refresh();

    // 실시간 구독
    supabase
      .channel("passenger")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "users",
          filter: `current_party=eq.${partyData?.id}`,
        },
        () => {
          refresh();
        },
      )
      .subscribe();

    return () => {
      // 이전 구독 해제
      supabase.getChannels().forEach((channel) => {
        if (channel.subTopic === "passenger") {
          channel.unsubscribe();
        }
      });
    };
  }, [partyData]);

  return { passengers };
}
