import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import useAuth from '../../hooks/useAuth';

const SignupView = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { handleSignUp } = useAuth(); // Destructure handleSignUp from useAuth

  const handleSignup = async () => {
    try {
      await handleSignUp(email, password);
    } catch (error) {
      console.error('회원가입 에러:', error.message);
    }
  };

  return (
    <View>
      <Text>이메일</Text>
      <TextInput value={email} onChangeText={setEmail} />
      <Text>비밀번호</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="회원가입" onPress={handleSignup} />
    </View>
  );
};

export default SignupView;
