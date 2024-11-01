import { supabase } from "@/services/supabaseClient";

export async function createRoom(
    { departure_time, origin, destination, limit_people, users = [], details }:
        { departure_time: string, origin: string, destination: string, limit_people: number, users: string[], details: string }) {
    var roomData = {
        departure_time: departure_time,
        origin: origin,
        destination: destination,
        // 최대 인원은 4명으로 고정됨
        // limit_people: limit_people,
        users: users,
        details: details,
    };
    roomData.users.push((await (supabase.auth.getSession())).data.session?.user?.id as string);
    console.log('roomData:', roomData);

    try {
        const { error } = await supabase
            .from('rooms')
            .insert([roomData]);

        if (error) {
            throw error.message;
        }
        console.log('Room created successfully');
    } catch (error) {
        console.error('Failed to create room:', error);
    }
}