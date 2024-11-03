import { router } from "expo-router";
import { checkEmailExists, signIn, signOut, signUp } from "../services/auth";
import { Alert } from 'react-native';
import { useState } from "react";
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Error during sign-in: Invalid login credentials']); // 특정 오류 메시지 무시

const useAuth = () => {
    const [user, setUser] = useState(null);
    //로그인 처리함수
    const handleSignIn = async (email, password) => {
        try {
            const { data, error } = await signIn(email, password);
            if (error || !data?.user) {
                setErrorMessage("유효하지 않은 로그인 정보입니다.");
                return;
            }
            setUser(data.user);
            router.replace("/(tabs)/");
        } catch (error) {
            setErrorMessage("로그인에 실패했습니다.");
        }
    };
    
    
    //회원가입 처리함수
    const handleSignUp = async (email, password, confirmPassword, nickname) => {
        if (password !== confirmPassword) {
            setErrorMessage('비밀번호가 일치하지 않습니다.');
            return;
        }
    
        if (!isValidPassword(password)) {
            setErrorMessage('비밀번호는 최소 8자 이상, 하나 이상의 대문자, 소문자, 숫자 및 특수 문자가 필요합니다.');
            return;
        }
    
        // 이메일 중복 확인
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
            console.log("회원가입 성공!");
            router.replace("./LoginView");
        } catch (error) {
            setErrorMessage('회원가입에 실패했습니다.');
            console.error("회원가입 오류:", error);
        }
    };
    
    
    //비밀번호 특수문자 확인
    const isValidPassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
      };
    //로그아웃 함수
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
    //기능들을 외부로 내보내주는 것
    return { user, handleSignIn, handleSignUp, handleSignOut };
};

export default useAuth;