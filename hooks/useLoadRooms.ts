import { supabase } from "@/lib/supabase";
import { PostgrestError } from "@supabase/supabase-js";
import { useEffect, useState, useCallback } from "react";

const useLoadRooms = (
  origin: string,
  destination: string,
  minDepartureTime: Date,
) => {
  //(origin: string, destination: string)
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // `minDepartureTime`을 `ISO` 형식 문자열로 변환하여 종속성으로 사용
  const minDepartureTimeIso = minDepartureTime.toISOString();

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("origin", origin)
        .eq("destination", destination)
        .gte("departure_time", minDepartureTimeIso) // 기준 시간 이후 방만 가져옴
        .order("departure_time", { ascending: true });

      console.log("Fetched data:", data); // 데이터 확인용 로그
      if (error) {
        console.error("Fetch error:", error);
        throw error;
      }
      setRooms(data);
    } catch (error) {
      setError((error as PostgrestError).message);
    } finally {
      setLoading(false);
    }
  }, [origin, destination, minDepartureTimeIso]); // 안정적 종속성 설정

  useEffect(() => {
    // 리얼타임 데이터베이스 변경 감지
    const channel = supabase
      .channel("rooms")
      .on(
        "postgres_changes",
        {
          event: "*", // 모든 이벤트 감지 (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "rooms",
        },
        (payload) => {
          const eventTime = payload.new?.departure_time
            ? new Date(payload.new.departure_time)
            : null;
          if (
            payload.eventType === "INSERT" &&
            payload.new?.origin === origin &&
            payload.new?.destination === destination &&
            eventTime &&
            eventTime >= new Date(minDepartureTimeIso) // 기준 시간 비교
          ) {
            console.log("INSERT detected:", payload.new);
            setRooms((current) => {
              if (!current) return [payload.new];
              const newRooms = [...current, payload.new];
              // departure_time으로 정렬
              return newRooms.sort(
                (a, b) =>
                  new Date(a.departure_time).getTime() -
                  new Date(b.departure_time).getTime(),
              );
            });
          } else if (payload.eventType === "DELETE") {
            setRooms((current) =>
              current
                ? current.filter((room) => room.id !== payload.old.id)
                : null,
            );
          } else if (payload.eventType === "UPDATE") {
            setRooms((current) =>
              current
                ? current.map((room) =>
                    room.id === payload.new.id ? payload.new : room,
                  )
                : null,
            );
          }
        },
      )
      .subscribe();

    fetchRooms();

    // Clean up on unmount
    return () => {
      channel.unsubscribe();
    };
  }, [fetchRooms]);

  return { loading, rooms, error };
};

export default useLoadRooms;
