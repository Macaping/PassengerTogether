import { supabase } from "@/lib/supabase";

export function LeaveRoom() {
  // 현재 사용자 가져오기
  return (
    supabase.auth
      .getUser()
      .then((data) => {
        if (data.error) throw data.error;
        const userId = data.data?.user?.id;
        if (!userId) throw new Error("User not authenticated");
        return userId;
      })
      // 유저가 속한 방 가져오기
      .then(async (userId) => {
        const currentRoom = await supabase
          .from("users")
          .select("current_party")
          .eq("user_id", userId);
        if (currentRoom.error) throw currentRoom.error;
        // 현재 유저가 속한 room ID
        const currentRoomId: string = currentRoom.data[0].current_party;
        return { userId: userId, currentRoomId: currentRoomId };
      })
      // 방 데이터 배열 가져오기
      .then((value) => {
        const { userId, currentRoomId } = value;
        supabase
          .from("rooms")
          .select("users")
          .eq("id", currentRoomId)
          .single()
          .then((value) => {
            if (value.error) throw value.error;
            // 방 데이터에서 사용자가 있으면 제거
            const users = value.data.users || [];
            if (users.includes(userId)) {
              users.splice(users.indexOf(userId), 1);
            }
            return users;
          })
          .then((users) => {
            // 방 데이터 업데이트
            supabase
              .from("rooms")
              .update({ users })
              .eq("id", currentRoomId)
              .then((value) => {
                if (value.error) throw value.error;
              });
          })
          .then(() => {
            // 사용자 테이블에 방 연결 제거
            supabase
              .from("users")
              .update({ current_party: null })
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
