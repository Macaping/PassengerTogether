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
    if (!email || !password || !confirmPassword || !nickname) throw '모든 항목을 입력해주세요.';
    if (!validateEmail(email)) throw '올바른 이메일 주소를 입력해주세요.';
    if (!validatePassword(password, confirmPassword)) throw '비밀번호가 일치하지 않습니다.';
    if (!verifyPasswordCriteria(password)) throw '비밀번호는 최소 8자 이상, 하나 이상의 대문자, 소문자, 숫자 및 특수 문자가 필요합니다.';
    if (nickname.length < 2) throw '닉네임은 2자 이상이어야 합니다.';

    return signUpWithEmail(email, password, nickname)
        .catch((e: AuthError | PostgrestError) => {
            if (e.message == 'User already registered') throw '이미 사용 중인 이메일입니다.';
            // 닉네임이 중복되었을 때 발생하는 오류라고 판단함.
            if (e.message == 'Database error saving new user') throw '사용할 수 없는 닉네임입니다.';
            else throw e.message;
        });
};

// 사전에 데이터가 올바른지 확인하는 함수
const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

// 비밀번호와 확인 비밀번호가 일치하는지 확인하는 함수
const validatePassword = (password: string, confirmPassword: string) => {
    return password === confirmPassword;
};

// 비밀번호 조건을 충족하는지 확인하는 함수
const verifyPasswordCriteria = (password: string) => {
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