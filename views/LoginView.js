// src/views/LoginView.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { AuthController } from '../controllers/AuthController';

const LoginView = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      console.log('로그인 요청:', email);
      await AuthController.signIn(email, password);
      console.log('로그인에 성공했습니다.');
      navigation.navigate('Home');
    } catch (error) {
      console.error('로그인 에러:', error.message);
    }
  };

  return (
    <View>
      <Text>이메일</Text>
      <TextInput value={email} onChangeText={setEmail} />
      <Text>비밀번호</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="로그인" onPress={handleLogin} />
      <Button title="회원가입" onPress={() => navigation.navigate('Signup')} />
    </View>
  );
};

export default LoginView;
