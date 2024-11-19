import { useParty } from "@/hooks/useParty";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@/lib/supabase";

export function LeaveRoom() {
  // 사용자 데이터
  const { user } = useSession();
  if (!user?.id) throw Error("사용자 정보가 없습니다.");

  // 사용자가 속한 방 데이터
  const { roomData } = useParty();
  if (!roomData) throw Error("방 정보가 없습니다.");

  // 방 데이터에서 사용자가 있으면 제거
  const users = roomData.users || [];
  if (users.includes(user.id)) {
    users.splice(users.indexOf(user.id), 1);
  }

  // 방 테이블에서 적용하기
  supabase
    .from("rooms")
    .update({ users })
    .eq("id", roomData.id)
    .then((value) => {
      if (value.error) throw value.error;
    })
    // 사용자 테이블에 파티 연결 제거
    .then(() => {
      supabase
        .from("users")
        .update({ current_party: null })
        .eq("user_id", user.id)
        .single()
        .then((value) => {
          if (value.error) throw value.error;
        });
    });
}
