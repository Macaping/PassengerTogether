import { supabase } from "@/services/supabaseClient";
import { PostgrestError } from "@supabase/supabase-js";
import { useState, useEffect } from "react";

const useLoadRooms = () => {
    const [loading, setLoading] = useState(false);
    const [rooms, setRooms] = useState<any[] | null>();
    const [error, setError] = useState<string | null>(null);

    const fetchRooms = async () => {
        try {
            setLoading(true);
            let { data, error } = await supabase.from("rooms").select("*");

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
