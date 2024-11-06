import { supabase } from "@/lib/supabase";
import { AuthError, AuthResponse, AuthTokenResponsePassword, PostgrestSingleResponse, User } from "@supabase/supabase-js";

// 로그인
export async function signInWithEmail(email: string, password: string): Promise<User> {
    return supabase.auth.signInWithPassword({ email: email, password: password }).then((value: AuthTokenResponsePassword) => {
        if (value.error) {
            throw value.error;
        }
        return value.data.user;
    });
}

// 회원가입
export async function signUpWithEmail(email: string, password: string, nickname: string): Promise<User> {
    return supabase.from('users').select('nickname').eq('nickname', nickname)
        // 닉네임 중복 체크
        .then((value: PostgrestSingleResponse<{ nickname: any; }[]>) => {
            if (value.error) {
                throw value.error;
            }
            if (value.data.length > 0) {
                throw new Error("이미 사용 중인 닉네임입니다. 다른 닉네임을 선택해주세요.");
            }
        })
        // 회원가입
        .then(() => {
            return supabase.auth.signUp({ email: email, password: password })
                .then((value: AuthResponse) => {
                    if (value.error) {
                        throw value.error;
                    }
                    return value.data.user;
                })
                .then((user: User | null) => {
                    if (!user) {
                        throw new Error("User is null");
                    }
                    // 닉네임 업데이트
                    return supabase.from('users')
                        .update({ nickname: nickname })
                        .eq('user_id', user.id)
                        .then((value) => {
                            if (value.error) {
                                throw value.error;
                            }
                            return user;
                        });
                });
        });
}

// 로그아웃
export async function signOut(): Promise<void> {
    supabase.auth.signOut().then((value: { error: AuthError | null; }) => {
        if (value.error) {
            throw value.error;
        }
    });
}