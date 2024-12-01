import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; // Supabase 클라이언트 설정 파일 경로

/**
 * 사용자 정보를 나타내는 인터페이스
 */
interface Passenger {
  id: string; // 사용자 ID
  nickname: string; // 사용자 닉네임
  clothes: string; // 사용자 옷차림 정보
}

/**
 * 주어진 방의 사용자(승객) 정보를 관리하는 커스텀 훅입니다.
 *
 * @param {string | null} currentPartyId - 현재 방 ID. null일 경우 데이터를 가져오지 않음.
 *
 * @returns {Object} 승객 목록, 로딩 상태, 에러 상태를 포함하는 객체
 * - `passengers`: 방에 속한 사용자 목록
 * - `loading`: 데이터를 가져오는 중인지 여부
 * - `error`: 데이터 가져오기 중 발생한 에러 메시지
 */
export function usePassengers(currentPartyId: string | null) {
  const [passengers, setPassengers] = useState<Passenger[]>([]); // 방에 속한 승객 목록
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState<string | null>(null); // 에러 메시지

  useEffect(() => {
    /**
     * 방 ID가 없으면 데이터를 초기화하고 로딩을 중단합니다.
     */
    if (!currentPartyId) {
      setPassengers([]);
      setLoading(false);
      return;
    }

    /**
     * 방에 속한 사용자 데이터를 Supabase에서 가져오는 함수
     */
    const fetchPassengers = async () => {
      setLoading(true); // 로딩 상태 활성화
      setError(null); // 이전 에러 상태 초기화

      try {
        // Step 1: 방 정보 가져오기 (users 배열 포함)
        const { data: room, error: roomError } = await supabase
          .from("rooms")
          .select("users") // 방에 속한 사용자 ID 배열 가져오기
          .eq("id", currentPartyId) // 현재 방 ID로 필터링
          .single(); // 단일 방 데이터만 가져옴

        if (roomError) {
          throw new Error(
            `방 정보를 가져오는 데 실패했습니다: ${roomError.message}`,
          );
        }

        if (!room?.users || room.users.length === 0) {
          // 사용자가 없으면 승객 목록 초기화
          setPassengers([]);
          setLoading(false);
          return;
        }

        // Step 2: 사용자 데이터 가져오기
        const { data: users, error: usersError } = await supabase
          .from("users") // "users" 테이블에서
          .select("id: user_id, nickname, clothes") // 사용자 ID, 닉네임, 옷차림 데이터 선택
          .in("user_id", room.users); // 방에 포함된 사용자 ID 필터링

        if (usersError) {
          throw new Error(
            `사용자 정보를 가져오는 데 실패했습니다: ${usersError.message}`,
          );
        }

        // 승객 목록 상태 업데이트
        setPassengers(users || []);
      } catch (err: any) {
        setError(err.message); // 에러 메시지 설정
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    };

    // 초기 데이터 가져오기
    fetchPassengers();

    // Step 3: "rooms" 테이블의 실시간 업데이트 구독
    const subscription = supabase
      .channel("room-users-updates") // 실시간 구독 채널 이름
      .on(
        "postgres_changes", // Postgres 변경 이벤트 구독
        {
          event: "*", // 모든 이벤트 감지
          schema: "public",
          table: "rooms", // "rooms" 테이블 구독
          filter: `id=eq.${currentPartyId}`, // 현재 방 ID로 필터링
        },
        (payload) => {
          if (payload.new?.users) {
            // 사용자가 변경되었을 때 승객 목록 갱신
            fetchPassengers();
          }
        },
      )
      .subscribe();

    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [currentPartyId]); // 방 ID 변경 시 효과 실행

  /**
   * 반환값:
   * - `passengers`: 방에 속한 사용자 목록
   * - `loading`: 데이터 로딩 상태
   * - `error`: 데이터 가져오기 실패 시 에러 메시지
   */
  return { passengers, loading, error };
}
