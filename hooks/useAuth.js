import { router } from "expo-router";
import { signIn, signOut, signUp } from "../services/auth";
import { useState } from "react";

const useAuth = () => {
    const [user, setUser] = useState(null);

    const handleSignIn = async (email, password) => {
        try {
            const { data, error } = await signIn(email, password);
            if (error) {
                throw new Error(error.message);
            }
            setUser(data.user);
            console.log(data.user);
            console.log("로그인 성공!");
        } catch (error) {
            console.error(error);
        }
    };

    const handleSignUp = async (email, password, nickname) => {
        try {
            const { data, error } = await signUp(email, password, nickname);
            if (error) {
                throw new Error(error.message);
            }
            setUser(data.user);
            console.log(data.user);
            console.log("회원가입 성공!");
            router.back();
        } catch (error) {
            console.error(error);
        }
    };

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
    
    return { user, handleSignIn, handleSignUp, handleSignOut };
};

export default useAuth;