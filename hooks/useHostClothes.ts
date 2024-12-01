import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

/**
 * 방장의 옷차림 정보를 가져오는 커스텀 훅입니다.
 *
 * 주어진 사용자의 목록(`roomUsers`) 중 첫 번째 사용자(방장)의 `clothes` 데이터를 Supabase에서 조회합니다.
 *
 * @param {string[]} roomUsers - 방에 있는 사용자들의 ID 배열. 배열의 첫 번째 요소가 방장의 ID로 간주됩니다.
 *
 * @returns {Object} 방장의 옷차림 정보와 로딩 상태 및 에러 상태를 포함한 객체
 * - `hostClothes`: 방장의 옷차림 정보 (문자열). 정보가 없을 경우 `null`.
 * - `loading`: 데이터를 가져오는 중인지 여부를 나타내는 상태 (불리언).
 * - `error`: 데이터를 가져오는 중 발생한 에러 메시지. 에러가 없으면 `null`.
 */
export function useHostClothes(roomUsers: string[]) {
  // 방장의 옷차림 정보를 저장하는 상태
  const [hostClothes, setHostClothes] = useState<string | null>(null);
  // 로딩 상태를 관리하는 상태
  const [loading, setLoading] = useState(true);
  // 에러 메시지를 저장하는 상태
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /**
     * 방장이 없거나 사용자가 없는 경우 데이터를 가져오지 않음.
     * - `roomUsers` 배열이 비어 있는지 확인 후 상태 초기화.
     */
    if (!roomUsers || roomUsers.length === 0) {
      setLoading(false);
      setHostClothes(null);
      return;
    }

    /**
     * 방장의 옷차림 정보를 Supabase에서 가져오는 함수
     */
    const fetchHostClothes = async () => {
      try {
        setLoading(true); // 로딩 상태 활성화

        // 방장의 ID는 roomUsers 배열의 첫 번째 요소
        const hostId = roomUsers[0];

        // Supabase에서 방장의 clothes 데이터 가져오기
        const { data, error } = await supabase
          .from("users") // "users" 테이블에서
          .select("clothes") // "clothes" 컬럼 선택
          .eq("user_id", hostId) // 방장의 user_id에 해당하는 데이터 필터링
          .single(); // 단일 데이터만 가져옴

        // 에러가 발생하면 처리
        if (error) throw error;

        // 데이터가 있을 경우 상태에 저장, 없으면 null로 설정
        setHostClothes(data?.clothes || null);
      } catch (err) {
        // 에러 발생 시 상태에 에러 메시지 설정
        console.error("Failed to fetch host clothes:", err);
        setError("Failed to fetch host clothes");
      } finally {
        // 로딩 상태 해제
        setLoading(false);
      }
    };

    // 옷차림 데이터를 가져오는 함수 호출
    fetchHostClothes();
  }, [roomUsers]); // roomUsers 배열이 변경될 때마다 실행

  /**
   * 반환값:
   * - 방장의 옷차림 정보, 로딩 상태, 에러 상태를 반환
   */
  return { hostClothes, loading, error };
}
