import { useState } from "react";
import { supabase } from "@/lib/supabase";

const useUserDataManagement = () => {
  const [room, setRoom] = useState(null);

  const fetchRoomDetails = async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error("로그인한 사용자 정보 가져오기 오류:", userError);
      return;
    }

    const userId = user?.id;
    if (!userId) {
      console.error("사용자 ID가 없습니다.");
      return;
    }

    const { data: userData, error: userFetchError } = await supabase
      .from("users")
      .select("current_party")
      .eq("user_id", userId)
      .single();

    if (userFetchError) {
      console.error("사용자 정보 가져오기 오류:", userFetchError);
      return;
    }

    const currentPartyId = userData?.current_party;
    if (!currentPartyId) {
      console.error("현재 사용자가 참여 중인 방이 없습니다.");
      return;
    }

    const { data: roomData, error: roomFetchError } = await supabase
      .from("rooms")
      .select("*")
      .eq("id", currentPartyId)
      .single();

    if (roomFetchError) {
      console.error("방 정보 가져오기 오류:", roomFetchError);
    } else {
      setRoom(roomData);
    }
  };

  return { room, fetchRoomDetails };
};

export default useUserDataManagement;
