import { supabase } from "@/lib/supabase";
import { PostgrestError } from "@supabase/supabase-js";
import { useEffect, useState, useCallback } from "react";

const useLoadRooms = (origin: string, destination: string, minDepartureTime: Date) => {
    const [loading, setLoading] = useState(false);
    const [rooms, setRooms] = useState<any[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    // 기준 시간을 ISO 형식으로 변환
    const minDepartureTimeIso = minDepartureTime.toISOString();

    // 선택한 날짜를 "YYYY-MM-DD" 형식으로 변환하여 사용
    const selectedDate = minDepartureTime.toISOString().split("T")[0]; // "YYYY-MM-DD" 형식

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

            if (error) {
                console.error("Fetch error:", error);
                throw error;
            }

            // 클라이언트 측에서 선택한 날짜와 일치하는 항목만 필터링
            const filteredData = data?.filter(room => 
                new Date(room.departure_time).toISOString().split("T")[0] === selectedDate
            );

            console.log("Filtered data:", filteredData); // 필터링된 데이터 확인용 로그
            setRooms(filteredData || []);
        } catch (error) {
            setError((error as PostgrestError).message);
        } finally {
            setLoading(false);
        }
    }, [origin, destination, minDepartureTimeIso, selectedDate]);

    useEffect(() => {
        // 리얼타임 데이터베이스 변경 감지
        const channel = supabase
            .channel("rooms")
            .on("postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "rooms"
                },
                (payload) => {
                    const eventTime = payload.new?.departure_time ? new Date(payload.new.departure_time) : null;
                    const eventDate = eventTime ? eventTime.toISOString().split("T")[0] : null;
                    if (
                        payload.eventType === "INSERT" && 
                        payload.new?.origin === origin && 
                        payload.new?.destination === destination &&
                        eventTime && 
                        eventDate === selectedDate && // 선택한 날짜와 일치하는지 확인
                        eventTime >= new Date(minDepartureTimeIso) // 기준 시간 비교
                    ) {

                        console.log("INSERT detected:", payload.new);
                        setRooms((current) => {
                            if (!current) return [payload.new];
                            const newRooms = [...current, payload.new];
                            // departure_time으로 정렬
                            return newRooms.sort((a, b) => 
                                new Date(a.departure_time).getTime() - new Date(b.departure_time).getTime()
                            );
                        });
                    } 
                    else if (payload.eventType === "DELETE") {
                        setRooms((current) => 
                            current ? current.filter(room => room.id !== payload.old.id) : null
                        );
                    }
                    else if (payload.eventType === "UPDATE") {
                        setRooms((current) => 
                            current ? current.map(room => 
                                room.id === payload.new.id ? payload.new : room
                            ) : null
                        );
                    }
                }
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
