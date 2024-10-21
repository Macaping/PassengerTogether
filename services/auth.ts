import { supabase } from "./supabaseClient";

export const signIn = async (email: string, password: string) => {
    try {
        const user = await supabase.auth.signInWithPassword({email: email, password: password});
        return user;
    } catch (error) {
        throw new Error("로그인에 실패했습니다.");
    }
};

export const signUp = async (email: string, password: string) => {
    try {
        const user = await supabase.auth.signUp({email: email, password: password});
        return user;
    } catch (error) {
        throw new Error("회원가입에 실패했습니다.");
    }
}

export const signOut = async () => {
    try {
        await supabase.auth.signOut();
    } catch (error) {
        throw new Error("로그아웃에 실패했습니다.");
    }
}