import { supabase } from "@/services/supabaseClient";
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
        fetchRooms();
    }, []);

    return { loading, rooms, error };
};

export default useLoadRooms;
