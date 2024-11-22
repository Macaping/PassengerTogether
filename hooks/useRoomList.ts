import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/supabase_type";
import { useEffect, useState } from "react";

type Room = Database["public"]["Tables"]["rooms"]["Row"];

export function useRoomList({
  departure,
  destination,
  date,
}: {
  departure: string;
  destination: string;
  date: Date;
}) {
  const [loading, setLoading] = useState(true);
  const [roomList, setRoomList] = useState<Room[] | null>();

  useEffect(() => {
    // 초기화
    if (!departure || !destination || !date) {
      setRoomList(null);
    } else {
      const fromDate = new Date(date);

      // 선택된 날의 특정 시간부터 선택된 날의 마지막 시간까지 시간을 설정합니다.
      // date에서 그날의 시간을 가져오고
      const lastDate = new Date(fromDate);
      // 하루를 더합니다.
      lastDate.setDate(lastDate.getDate() + 1);
      // 시간을 0시 0분 0초 0밀리초로 설정합니다.
      lastDate.setHours(0, 0, 0, 0);

      console.log("date:", fromDate.toLocaleString());
      console.log("lastDate:", lastDate.toLocaleString());
      // 조건에 맞는 방 정보를 가져옵니다.
      supabase
        .from("rooms")
        .select("*")
        .eq("origin", departure)
        .eq("destination", destination)
        .gte("departure_time", fromDate.toISOString())
        .lt("departure_time", lastDate.toISOString())
        .order("departure_time", { ascending: true })
        .then((value) => {
          value.data && setRoomList(value.data);
        });

      // 실시간 구독
      // TODO 지금은 잘 안되는 것 같습니다.
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
              // 삽입된 데이터인 경우 추가합니다.
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
              // 업데이트된 데이터인 경우 업데이트합니다.
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
    // 로딩 완료
    setLoading(false);

    return () => {
      // 이전 구독 해제
      supabase.getChannels().forEach((channel) => {
        if (channel.subTopic === "roomList") {
          channel.unsubscribe();
        }
      });
    };
  }, [date, departure, destination]);

  return { loading, roomList };
}
