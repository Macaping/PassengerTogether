import { signInWithEmail, signOut, signUpWithEmail } from "@/services/auth";
import { AuthError, PostgrestError, User } from "@supabase/supabase-js";

// 로그인
export async function signInUser(
    email: string,
    password: string
): Promise<User> {
    if (!email || !password) throw '이메일과 비밀번호를 입력해주세요.';
    return signInWithEmail(email, password)
        .catch((e: AuthError) => {
            if (e.message == 'Invalid login credentials') throw '이메일 또는 비밀번호가 일치하지 않습니다.';
            else throw e.message;
        });
};

// 회원가입
export async function signUpUser(
    email: string,
    password: string,
    confirmPassword: string,
    nickname: string
): Promise<User> {
    if (password !== confirmPassword) throw '비밀번호가 일치하지 않습니다.';
    if (!validatePassword(password)) throw '비밀번호는 최소 8자 이상, 하나 이상의 대문자, 소문자, 숫자 및 특수 문자가 필요합니다.';
    if (nickname.length < 2) throw '닉네임은 2자 이상이어야 합니다.';

    return signUpWithEmail(email, password, nickname)
        .catch((e: AuthError | PostgrestError) => {
            if (e.message == 'User already registered') throw '이미 사용 중인 이메일입니다.';
            else throw e.message;
        });
};

const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

// 로그아웃
export async function signOutUser(
): Promise<void> {
    return signOut()
        .catch((e: Error) => {
            console.error(e.message);
        });
};