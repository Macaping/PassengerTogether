import { supabase } from "@/lib/supabase";

export async function Room(id: string) {
  return supabase
    .from("rooms")
    .select("*")
    .eq("id", id)
    .single()
    .then((value) => value.data);
}
