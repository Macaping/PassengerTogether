import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/supabase_type";
import { useEffect, useState } from "react";

type Room = Database["public"]["Tables"]["rooms"]["Row"];

/**
 * useRoomList 훅
 *
 * - 사용자가 지정한 출발지, 도착지, 날짜를 기준으로 방 목록을 가져옵니다.
 * - 실시간 데이터 구독을 통해 방 목록의 변경 사항을 반영합니다.
 *
 * 주요 기능:
 * 1. 지정된 조건(출발지, 도착지, 날짜)에 따라 방 목록을 필터링합니다.
 * 2. 날짜 범위를 계산하여 선택된 날짜의 방만 조회합니다.
 * 3. `supabase`의 실시간 기능을 사용하여 데이터베이스 변경 사항을 반영합니다.
 * 4. 방 목록을 상태로 관리하며 로딩 상태를 제공합니다.
 *
 * @param {Object} params
 * @param {string} params.departure - 출발지.
 * @param {string} params.destination - 도착지.
 * @param {Date} params.date - 선택된 날짜.
 * @returns {Object} 방 목록 및 로딩 상태를 반환합니다.
 */
export function useRoomList({
  departure,
  destination,
  date,
}: {
  departure: string;
  destination: string;
  date: Date;
}) {
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [roomList, setRoomList] = useState<Room[] | null>(); // 방 목록 상태

  useEffect(() => {
    // 초기화
    if (!departure || !destination || !date) {
      setRoomList(null);
    } else {
      const fromDate = new Date(date);

      // 선택된 날짜의 시작 시간과 종료 시간 계산
      const lastDate = new Date(fromDate);
      lastDate.setDate(lastDate.getDate() + 1); // 다음 날로 설정
      lastDate.setHours(0, 0, 0, 0); // 0시 0분 0초로 초기화

      console.log("date:", fromDate.toLocaleString());
      console.log("lastDate:", lastDate.toLocaleString());

      // 조건에 맞는 방 목록 가져오기
      supabase
        .from("rooms")
        .select("*")
        .eq("origin", departure)
        .eq("destination", destination)
        .gte("departure_time", fromDate.toISOString())
        .lt("departure_time", lastDate.toISOString())
        .order("departure_time", { ascending: true })
        .then((value) => {
          value.data && setRoomList(value.data); // 데이터 설정
        });

      // 실시간 구독 설정
      supabase
        .channel("roomList")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "rooms",
          },
          (payload) => {
            if (payload.eventType === "INSERT") {
              // 방이 추가되었을 때 목록에 추가
              const newRoom = payload.new as Room;
              if (
                newRoom.origin === departure &&
                newRoom.destination === destination &&
                newRoom.departure_time &&
                new Date(newRoom.departure_time) >= date &&
                new Date(newRoom.departure_time) < lastDate
              ) {
                setRoomList((prev) => (prev ? [...prev, newRoom] : [newRoom]));
              }
            } else if (payload.eventType === "UPDATE") {
              // 방이 업데이트되었을 때 목록 갱신
              const updatedRoom = payload.new as Room;
              setRoomList((prev) =>
                prev
                  ? prev.map((room) =>
                      room.id === updatedRoom.id ? updatedRoom : room,
                    )
                  : prev,
              );
            }
          },
        )
        .subscribe();
    }

    // 로딩 상태 업데이트
    setLoading(false);

    return () => {
      // 구독 해제
      supabase.getChannels().forEach((channel) => {
        if (channel.subTopic === "roomList") {
          channel.unsubscribe();
        }
      });
    };
  }, [date, departure, destination]);

  return { loading, roomList };
}
