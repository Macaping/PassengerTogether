import { router } from "expo-router";
import { signIn, signOut, signUp } from "../services/auth";
import { Alert } from 'react-native';
import { useState } from "react";

const useAuth = () => {
    const [user, setUser] = useState(null);
    //로그인 처리함수
    const handleSignIn = async (email, password) => {
        try {
            const data = await signIn(email, password);
            if (!data || !data.user) {  // data 또는 data.user가 없을 경우 처리
                throw new Error("유효하지 않은 로그인 정보입니다.");
            }
            router.replace("/(tabs)/")
            setUser(data.user);
        } catch (error) {
            console.error(error.message);
        }
    };
    
    //회원가입 처리함수
    const handleSignUp = async (email, password, confirmPassword, nickname) => {
        if (password !== confirmPassword) {
            Alert.alert('오류', '비밀번호가 일치하지 않습니다.');
            return;
        }
    
        if (!isValidPassword(password)) {
            Alert.alert('비밀번호는 최소 8자 이상, 하나 이상의 대문자, 소문자, 숫자 및 특수 문자가 필요함');
            return;
        }
    
        try {
            const { user, error } = await signUp(email, password, nickname);
            if (error) {
                throw new Error(error.message);
            }
            setUser(user);
            console.log("회원가입 성공!", user);
            router.replace("./LoginView")
        } catch (error) {
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