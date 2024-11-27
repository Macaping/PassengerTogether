import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useHostClothes(roomUsers: string[]) {
  const [hostClothes, setHostClothes] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 방장이 없거나 users 배열이 비어있는 경우
    if (!roomUsers || roomUsers.length === 0) {
      setLoading(false);
      setHostClothes(null);
      return;
    }

    const fetchHostClothes = async () => {
      try {
        setLoading(true);

        // 방장의 ID는 users 배열의 첫 번째 값
        const hostId = roomUsers[0];

        // Supabase에서 방장의 옷차림(clothes) 정보 가져오기
        const { data, error } = await supabase
          .from("users")
          .select("clothes")
          .eq("user_id", hostId)
          .single(); // 단일 데이터만 가져옴

        if (error) throw error;

        setHostClothes(data?.clothes || null);
      } catch (err) {
        console.error("Failed to fetch host clothes:", err);
        setError("Failed to fetch host clothes");
      } finally {
        setLoading(false);
      }
    };

    fetchHostClothes();
  }, [roomUsers]);

  return { hostClothes, loading, error };
}
