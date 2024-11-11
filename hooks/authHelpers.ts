import { supabase } from '@/lib/supabase';

export async function getCurrentUserId() {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
        console.error('사용자 정보를 가져오는 중 오류 발생:', error.message);
        return null;
    }

    return data?.user?.id; // 현재 로그인한 사용자의 UUID를 반환
}
