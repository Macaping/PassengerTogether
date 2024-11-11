import { supabase } from '@/lib/supabase';
import { AuthError, User, UserResponse } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

export function useAuthUser() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 초기 사용자 상태 확인
        getUserFromSupabase().then((value: void | { user: User; }) => {
            setUser(user);
            setLoading(false);
        });

        // 인증 상태 변경 구독
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    return { user, loading };
}

export async function getUserFromSupabase() {
    return supabase.auth.getUser()
        // 사용자 id 가져오기
        .then((value: UserResponse) => {
            if (value.error) throw value.error;
            return value.data;
        })
        // 오류 처리
        .catch((error: AuthError) => {
            console.log('사용자 정보를 가져오는 중 오류 발생:', error.message);
        })
}
