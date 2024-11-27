import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; // Supabase 클라이언트 설정 파일 경로를 적절히 변경하세요.

interface Passenger {
  id: string;
  nickname: string;
  clothes: string;
}

export function usePassengers(currentPartyId: string | null) {
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentPartyId) {
      setPassengers([]);
      setLoading(false);
      return;
    }

    const fetchPassengers = async () => {
      setLoading(true);
      setError(null);

      try {
        // Step 1: Get the room data including the users array
        const { data: room, error: roomError } = await supabase
          .from("rooms")
          .select("users")
          .eq("id", currentPartyId)
          .single();

        if (roomError) {
          throw new Error(`Failed to fetch room: ${roomError.message}`);
        }

        if (!room?.users || room.users.length === 0) {
          setPassengers([]);
          setLoading(false);
          return;
        }

        // Step 2: Fetch user data for all user_ids in the room
        const { data: users, error: usersError } = await supabase
          .from("users")
          .select("id: user_id, nickname, clothes")
          .in("user_id", room.users);

        if (usersError) {
          throw new Error(`Failed to fetch users: ${usersError.message}`);
        }

        setPassengers(users || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Initial data fetch
    fetchPassengers();

    // Step 3: Set up a real-time subscription to the rooms table
    const subscription = supabase
      .channel("room-users-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "rooms",
          filter: `id=eq.${currentPartyId}`,
        },
        (payload) => {
          if (payload.new?.users) {
            // Refetch the updated passengers when the users column changes
            fetchPassengers();
          }
        },
      )
      .subscribe();

    // Cleanup the subscription on unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [currentPartyId]);

  return { passengers, loading, error };
}
