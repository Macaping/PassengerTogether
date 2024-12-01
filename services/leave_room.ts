import { supabase } from "@/lib/supabase";
import { Room } from "./room";
import { User } from "./user";

/**
 * 사용자가 현재 속한 방에서 나가게 합니다.
 */
export async function LeaveRoom() {
  // 사용자 데이터
  const user = await User();
  if (!user?.id) throw Error("사용자 정보가 없습니다.");

  // 사용자가 속한 방 아이디
  let currentPartyId: string | null = null;
  await supabase
    .from("users")
    .select("current_party")
    .eq("user_id", user.id)
    .single()
    .then((value) => {
      if (value.error) throw value.error;
      currentPartyId = value.data?.current_party;
    });
  if (!currentPartyId) throw Error("방 정보가 없습니다.");

  // 방 데이터
  const room = await Room(currentPartyId);
  if (!room) throw Error("방 정보가 없습니다.");

  // 방 데이터에서 사용자가 있으면 제거
  const users = room.users || [];
  if (users.includes(user.id)) {
    users.splice(users.indexOf(user.id), 1);
  }

  // 방 테이블에서 적용하기
  supabase
    .from("rooms")
    .update({ users })
    .eq("id", room.id)
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
