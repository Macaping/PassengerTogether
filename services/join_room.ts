import { supabase } from "@/lib/supabase";

export async function JoinRoom(roomId: string) {
  // 현재 사용자 가져오기
  return (
    supabase.auth
      .getUser()
      .then((data) => {
        const userId = data.data?.user?.id;
        if (userId) return userId;
        else throw new Error("User not authenticated");
      })
      // 방 데이터 배열 가져오기
      .then((userId) => {
        supabase
          .from("rooms")
          .select("users")
          .eq("id", roomId)
          .single()
          .then((value) => {
            if (value.error) throw value.error;
            // 방에 사용자가 포함되어 있지 않으면 추가
            const users = value.data.users || [];
            if (!users.includes(userId)) {
              users.push(userId);
            }
            return users;
          })
          .then((users) => {
            // 방 데이터 업데이트
            supabase
              .from("rooms")
              .update({ users })
              .eq("id", roomId)
              .then((value) => {
                if (value.error) throw value.error;
              });
          })
          .then(() => {
            // 사용자 테이블에 방 연결
            supabase
              .from("users")
              .update({ current_party: roomId })
              .eq("user_id", userId)
              .single()
              .then((value) => {
                if (value.error) throw value.error;
              });
          });
      })
      .catch((error) => {
        console.error(error);
        throw error;
      })
  );
}
