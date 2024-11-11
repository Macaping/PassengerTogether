import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/supabase_type";
import { RealtimeChannel } from "@supabase/supabase-js";

type Room = Database['public']['Tables']['rooms']['Row'];
type User = Database['public']['Tables']['users']['Row'];

const useUserDataManagement = () => {
  const [room, setRoom] = useState<Room | null>(null);
  const [roomChannel, setRoomChannel] = useState<RealtimeChannel>();

  const fetchRoomDetails = async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error("User fetch error:", userError);
      return;
    }

    const userId = user?.id;
    if (!userId) {
      console.error("No user ID found.");
      return;
    }

    const { data: userData, error: userFetchError } = await supabase
      .from("users")
      .select("current_party")
      .eq("user_id", userId)
      .single();

    if (userFetchError) {
      console.error("User data fetch error:", userFetchError);
      return;
    }

    const currentPartyId = userData?.current_party;
    if (!currentPartyId) {
      setRoom(null);
      return;
    }

    const { data: roomData, error: roomFetchError } = await supabase
      .from("rooms")
      .select("*")
      .eq("id", currentPartyId)
      .single();

    if (roomFetchError) {
      console.error("Room data fetch error:", roomFetchError);
      setRoom(null);
      return;
    }

    // Check if the user is in the room
    const filteredUsers = roomData?.users?.filter(Boolean) as string[];
    if (!filteredUsers.includes(userId)) {
      setRoom(null);
      return;
    }

    setRoom(roomData);
  };

  const subscribeToRoomUpdates = (roomId: string) => {
    // 구독이 이미 설정된 경우 해제
    if (roomChannel) {
      supabase.removeChannel(roomChannel);
    }

    const channel = supabase
      .channel("rooms")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "rooms",
          filter: `id=eq.${roomId}`,
        },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            console.log("Room updated:", payload.new);
            setRoom(payload.new as Room);
          }
        }
      )
      .subscribe();

    // 채널 상태를 roomChannel에 저장
    setRoomChannel(channel);
  };

  useEffect(() => {
    fetchRoomDetails();

    if (room?.id) {
      subscribeToRoomUpdates(room.id);

      return () => {
        if (roomChannel) {
          supabase.removeChannel(roomChannel); // 해당 구독만 해제
        }
      };
    }
  }, [room?.id]);

  return { room, fetchRoomDetails };
};

export default useUserDataManagement;
