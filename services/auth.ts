import { supabase } from "./supabaseClient";

// 로그인 함수
export const signIn = async (email: string, password: string): Promise<{ data?: any, error?: Error }> => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { error: new Error(error.message) };
        return { data };
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error during sign-in:", error.message);
            return { error: new Error("로그인에 실패했습니다.") };
        }
        return { error: new Error("Unknown error occurred") };
    }
};

// 회원가입 함수
export const signUp = async (
    email: string,
    password: string,
    nickname: string
): Promise<{ user: any | null, error: Error | null }> => {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        
        if (error) throw new Error(error.message);
        
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

            if (dbError) throw new Error(dbError.message);
        }

        return { user, error: null };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return { user: null, error: new Error("회원가입에 실패했습니다.") };
        }
        return { user: null, error: new Error("Unknown error occurred") };
    }
};

// 로그아웃 함수
export const signOut = async (): Promise<void> => {
    try {
        await supabase.auth.signOut();
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error("로그아웃에 실패했습니다.");
        }
        throw new Error("Unknown error occurred");
    }
};

// 이메일 중복 확인 함수
export const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
        const { data, error } = await supabase
            .from('users') // 'users' 테이블에서
            .select('email') // 'email' 필드 선택
            .eq('email', email); // 입력된 이메일과 일치하는 항목 조회
        
        if (error) throw new Error(error.message);

        // data가 비어 있지 않으면 중복된 이메일이 있는 것
        return data.length > 0;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error occurred");
    }
};
