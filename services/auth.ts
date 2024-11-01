import { supabase } from "./supabaseClient";

export const signIn = async (email: string, password: string) => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error during sign-in:", error.message);
        throw new Error("로그인에 실패했습니다.");
    }
};

export const signUp = async (email: string, password: string, nickname: string): Promise<{ user: User | null, error: Error | null }> => {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        
        if (error) throw error;
        
        // 인증이 성공하면 users 테이블에 데이터 삽입
        const user = data.user;
        if (user) {
            const { error: dbError } = await supabase
                .from('users')
                .insert([{
                    user_id: user.id,
                    nickname: nickname,
                    leave_count: 0,
                    followings: [],
                    restriction_date: null,
                    current_party: null,
                }]);

            if (dbError) throw dbError;
        }

        return { user, error: null };
    } catch (error) {
        return { user: null, error: new Error("회원가입에 실패했습니다.") };
    }
};

export const signOut = async () => {
    try {
        await supabase.auth.signOut();
    } catch (error) {
        throw new Error("로그아웃에 실패했습니다.");
    }
}