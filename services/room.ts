import { supabase } from "@/lib/supabase";

/**
 * 방 정보를 조회합니다.
 *
 * @param {string} id - 방 ID
 */
export async function Room(id: string) {
  return supabase
    .from("rooms")
    .select("*")
    .eq("id", id)
    .single()
    .then((value) => value.data);
}
