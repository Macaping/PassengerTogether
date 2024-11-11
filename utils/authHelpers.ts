import { supabase } from '@/lib/supabase';
import { AuthError, UserResponse } from '@supabase/supabase-js';

export async function getCurrentUserId() {
    return supabase.auth.getUser()
        // 사용자 id 가져오기
        .then((value: UserResponse) => {
            if (value.error) throw value.error;
            return value.data.user.id;
        })
        // 오류 처리
        .catch((error: AuthError) => {
            console.error('사용자 정보를 가져오는 중 오류 발생:', error.message);
            return null;
        });
}
