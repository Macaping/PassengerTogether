import { supabase } from "@/services/supabaseClient";
import { useState, useEffect } from "react";

const useLoadRooms = () => {
    const [loading, setLoading] = useState(false);
    const [rooms, setRooms] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRooms = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('rooms')
                    .select('*');
                
                if (error) {
                    throw error;
                }

                setRooms(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    return { loading: loading, rooms: rooms, error: error };
};

export default useLoadRooms;