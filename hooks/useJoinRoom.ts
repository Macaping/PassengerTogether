import { supabase } from "@/lib/supabase";

export default async function useJoinRoom(roomId: string) {
    // 현재 사용자 가져오기
    const user = await supabase.auth.getUser();
    const userId = user.data?.user?.id;
    console.log('userId:', userId);

    if (userId) {
        // 방 데이터 배열 가져오기
        const { data: roomData, error: fetchError } = await supabase
            .from('rooms')
            .select('users')
            .eq('id', roomId)
            .single();

        console.log('roomData:', roomData);
        if (fetchError) {
            // 오류 처리
            console.error(fetchError);
        } else {
            // 방에 사용자가 포함되어 있지 않으면 추가
            const users = roomData.users || [];
            if (!users.includes(userId)) {
                users.push(userId);

                // 방 데이터 업데이트
                const { error: updateError } = await supabase
                    .from('rooms')
                    .update({ users })
                    .eq('id', roomId);
                console.log('users:', users);

                if (updateError) {
                    // 오류 처리
                    console.error(updateError);
                }

                // 사용자 테이블에 방 추가
                const { error: insertError } = await supabase
                    .from('users')
                    .update({ current_party: roomId })
                    .eq('user_id', userId)
                    .single();

                if (insertError) {
                    // 오류 처리
                    console.error(insertError);
                }
            }
        }
    } else {
        // Handle unauthenticated user
        console.error('User not authenticated');
    }
};