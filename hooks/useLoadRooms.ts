import { supabase } from "@/lib/supabase";
import { PostgrestError } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const useLoadRooms = () => {
    const [loading, setLoading] = useState(false);
    const [rooms, setRooms] = useState<any[] | null>();
    const [error, setError] = useState<string | null>(null);

    const fetchRooms = async () => {
        try {
            setLoading(true);
            // departure_time 순으로 가져오기
            let { data, error } = await supabase.from("rooms")
                .select("*")
                .order("departure_time", { ascending: true });

            if (error) {
                throw error;
            }
            setRooms(data);
        } catch (error) {
            setError((error as PostgrestError).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // 리얼타임 데이터베이스 변경 감지
        const channel = supabase
            .channel("rooms")
            .on("postgres_changes",
                {
                    event: "*",  // 모든 이벤트 감지 (INSERT, UPDATE, DELETE)
                    schema: "public",
                    table: "rooms"
                },
                (payload) => {
                    if (payload.eventType === "INSERT") {
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
    }, []);

    return { loading, rooms, error };
};

export default useLoadRooms;
