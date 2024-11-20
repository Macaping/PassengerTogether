import { supabase } from "@/lib/supabase";

export async function User() {
  return supabase.auth
    .getUser()
    .then((value) => {
      if (value.error) throw value.error;
      if (!value.data) throw Error("사용자 정보가 없습니다.");
      return value.data.user;
    })
    .catch((error) => {
      console.error("User fetch error:", error);
    });
}
