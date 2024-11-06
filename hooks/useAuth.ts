import { signInWithEmail, signUpWithEmail } from "@/services/auth";
import { AuthError, PostgrestError } from "@supabase/supabase-js";
import { router } from "expo-router";
import { useState } from "react";
import { signOut } from "../services/auth";

const useAuth = () => {
    const [errorMessage, setErrorMessage] = useState(''); // 오류 메시지 상태 추가

    //로그인
    const handleSignIn = async (email: string, password: string) => {
        if (!email || !password) {
            setErrorMessage('이메일과 비밀번호를 입력해주세요.');
            return;
        }
        signInWithEmail(email, password)
            // 성공
            .then(() => {
                setErrorMessage(''); // 오류 메시지 초기화
                router.replace('/(tabs)/');
            })
            // 오류
            .catch((e: AuthError) => {
                if (e.message == "Invalid login credentials") setErrorMessage("이메일 또는 비밀번호가 일치하지 않습니다.");
                else setErrorMessage(e.message);
            });
    };

    //회원가입
    const handleSignUp = async (email: string, password: string, confirmPassword: string, nickname: string) => {
        if (password !== confirmPassword) {
            setErrorMessage('비밀번호가 일치하지 않습니다.');
            return;
        }
        if (!isValidPassword(password)) {
            setErrorMessage('비밀번호는 최소 8자 이상, 하나 이상의 대문자, 소문자, 숫자 및 특수 문자가 필요합니다.');
            return;
        }
        if (nickname.length < 2) {
            setErrorMessage('닉네임은 2자 이상이어야 합니다.');
            return;
        }

        signUpWithEmail(email, password, nickname)
            // 성공
            .then(() => {
                setErrorMessage(''); // 오류 메시지 초기화
                router.replace('/(tabs)/');
            })
            // 오류
            .catch((e: AuthError | PostgrestError) => {
                if (e.message == "User already registered") setErrorMessage("이미 사용 중인 이메일입니다.");
                else setErrorMessage(e.message);
            });
    };

    const isValidPassword = (password: string) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    //로그아웃
    const handleSignOut = async () => {
        signOut()
            // 성공
            .then(() => {
                console.info('로그아웃 성공');
                router.push('/LoginView');
            })
            // 오류
            .catch((e: AuthError) => console.error(e.message));
    };

    return { errorMessage, handleSignIn, handleSignUp, handleSignOut };
};

export default useAuth;
