import { supabase } from "@/lib/supabase";
import { PostgrestError } from "@supabase/supabase-js";
import { useEffect, useState, useCallback, useRef } from "react";

const useLoadRooms = (
  origin: string,
  destination: string,
  minDepartureTime: Date,
) => {
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedRef = useRef(false); // fetch 실행 여부

  // 기준 시간을 ISO 형식으로 변환
  const minDepartureTimeIso = minDepartureTime.toISOString();
  const selectedDate = minDepartureTime.toISOString().split("T")[0]; // YYYY-MM-DD

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("origin", origin)
        .eq("destination", destination)
        .gte("departure_time", minDepartureTimeIso)
        .order("departure_time", { ascending: true });

      if (error) {
        console.error("Fetch error:", error);
        throw error;
      }

      // 필터링된 데이터
      const filteredData = data?.filter(
        (room) =>
          new Date(room.departure_time).toISOString().split("T")[0] ===
          selectedDate,
      );

      console.log("Filtered data:", filteredData); // 로그가 한 번만 출력되게 설정
      setRooms(filteredData || []);
      hasFetchedRef.current = true; // fetch 완료 상태 업데이트
    } catch (error) {
      setError((error as PostgrestError).message);
    } finally {
      setLoading(false);
    }
  }, [origin, destination, minDepartureTimeIso, selectedDate]);

  // fetchRooms를 조건이 맞을 때 한 번만 실행
  useEffect(() => {
    if (!hasFetchedRef.current && origin && destination && minDepartureTime) {
      console.log("Fetching rooms...");
      fetchRooms();
    }
  }, [fetchRooms]); // `fetchRooms` 자체가 의존성을 포함하므로 추가 의존성 불필요

  useEffect(() => {
    // 리얼타임 데이터베이스 변경 감지
    const channel = supabase
      .channel("rooms")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "rooms",
        },
        (payload) => {
          const eventTime = payload.new?.departure_time
            ? new Date(payload.new.departure_time)
            : null;
          const eventDate = eventTime
            ? eventTime.toISOString().split("T")[0]
            : null;

          if (
            payload.eventType === "INSERT" &&
            payload.new?.origin === origin &&
            payload.new?.destination === destination &&
            eventTime &&
            eventDate === selectedDate &&
            eventTime >= new Date(minDepartureTimeIso)
          ) {
            console.log("INSERT detected:", payload.new);
            setRooms((current) => {
              if (!current) return [payload.new];
              const newRooms = [...current, payload.new];
              return newRooms.sort(
                (a, b) =>
                  new Date(a.departure_time).getTime() -
                  new Date(b.departure_time).getTime(),
              );
            });
          }
        },
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [origin, destination, minDepartureTimeIso, selectedDate]);

  return { loading, rooms, error };
};

export default useLoadRooms;
