import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import useAuth from '../../hooks/useAuth';
import { router } from 'expo-router';

const SignupView = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const { handleSignUp } = useAuth(); // useAuth에서 handleSignUp 가져오기

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      Alert.alert('오류', '비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await handleSignUp(email, password, confirmPassword, nickname);
    } catch (error) {
      Alert.alert('회원가입 오류', error.message); // 에러 발생 시 Alert 표시
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Passenger Together.</Text>
      <Text style={styles.subtitle}>Call Van Matching App</Text>

      <TextInput
        style={styles.input}
        placeholder="이메일을 입력하세요"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호를 입력하세요"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호를 한번 더 입력하세요"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="닉네임을 입력하세요"
        value={nickname}
        onChangeText={setNickname}
      />

      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.signupButtonText}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#5D3FD3',
    marginBottom: 8,
    width: '80%',
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 16,
    color: '#999999',
    marginBottom: 24,
    width: '80%',
    textAlign: 'left',
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  signupButton: {
    width: '80%',
    height: 50,
    backgroundColor: '#5D3FD3',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 16,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SignupView;
