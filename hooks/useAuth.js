import { router } from "expo-router";
import { useState } from "react";
import { checkEmailExists, signIn, signOut, signUp } from "../services/auth";

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState(''); // 오류 메시지 상태 추가
    //로그인
    const handleSignIn = async (email, password) => {
        try {
            if (!email || !password) {
                setErrorMessage('이메일과 비밀번호를 입력해주세요.');
                return;
            }
            const { data, error } = await signIn(email, password);
            if (error || !data?.user) {
                setErrorMessage("이메일 또는 비밀번호가 일치하지 않습니다.");
                return;
            }
            setUser(data.user);
            setErrorMessage(''); // 성공 시 오류 메시지 초기화
            router.replace("/(tabs)/");
        } catch (error) {
            setErrorMessage("로그인에 실패했습니다.");
        }
    };
    //회원가입
    const handleSignUp = async (email, password, confirmPassword, nickname) => {
        if (password !== confirmPassword) {
            setErrorMessage('비밀번호가 일치하지 않습니다.');
            return;
        }
    
        if (!isValidPassword(password)) {
            setErrorMessage('비밀번호는 최소 8자 이상, 하나 이상의 대문자, 소문자, 숫자 및 특수 문자가 필요합니다.');
            return;
        }
    
        const emailExists = await checkEmailExists(email);
        if (emailExists) {
            setErrorMessage('이미 사용 중인 이메일입니다.');
            return;
        }
    
        try {
            const { user, error } = await signUp(email, password, nickname);
            if (error) {
                throw new Error(error.message);
            }
            setUser(user);
            setErrorMessage(''); // 성공 시 오류 메시지 초기화
            console.log("회원가입 성공!");
            router.replace("./LoginView");
        } catch (error) {
            setErrorMessage('회원가입에 실패했습니다.');
            console.error("회원가입 오류:", error);
        }
    };

    const isValidPassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };
    //로그아웃
    const handleSignOut = async () => {
        try {
            await signOut();
            setUser(null);
            console.log("로그아웃 성공!");
            router.push('/LoginView');
        } catch (error) {
            console.error(error);
        }
    };

    return { user, errorMessage, handleSignIn, handleSignUp, handleSignOut };
};

export default useAuth;
