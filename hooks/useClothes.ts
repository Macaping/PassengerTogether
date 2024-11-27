import { useState } from "react";
import { supabase } from "@/lib/supabase"; // Supabase 클라이언트의 경로를 맞춰주세요.

export default function useClothes() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Updates the clothes column for a user in the users table.
   * @param userId - The user's ID (user_id).
   * @param clothes - The outfit description to save.
   * @returns The updated user data or null if failed.
   */
  const updateClothes = async (userId: string, clothes: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("users")
        .update({ clothes })
        .eq("user_id", userId);

      if (error) throw new Error(error.message); // 에러가 있으면 예외를 던짐
      return data?.[0] || true; // 성공 시 데이터 반환
    } catch (err: any) {
      setError(err.message); // 에러 메시지 설정
      console.error("Error updating clothes:", err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    updateClothes,
  };
}
