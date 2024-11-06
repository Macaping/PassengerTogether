import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { signInUser } from '@/utils/auth.utils';
import { router } from 'expo-router';

const SignInView = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignIn = async () => {
    signInUser(email, password)
      .then(() => router.replace('/(tabs)/'))
      .catch((e: string) => setErrorMessage(e));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Passenger Together.</Text>
      <Text style={styles.subtitle}>Call Van Matching App</Text>

      <Text style={styles.label}>이메일</Text>
      <TextInput
        style={styles.input}
        placeholder="이메일을 입력하세요"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>비밀번호</Text>
      <TextInput
        style={[styles.input, errorMessage ? styles.errorInput : null]}
        placeholder="비밀번호를 입력하세요"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <TouchableOpacity style={styles.loginButton} onPress={handleSignIn}>
        <Text style={styles.loginButtonText}>로그인</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>아직 회원이 아니신가요?
        <Text style={styles.signupText} onPress={() => router.push('/SignupView')}>
          {'  '}회원가입
        </Text>
      </Text>
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
  label: {
    width: '80%',
    textAlign: 'left',
    fontSize: 14,
    color: '#000',
    marginBottom: 4,
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
  errorInput: {
    borderColor: '#FF0000',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 12,
    marginBottom: 24,
    marginTop: -4,
    width: '80%',
    marginLeft: 2,
    textAlign: 'left',
  },
  loginButton: {
    width: '80%',
    height: 50,
    backgroundColor: '#5D3FD3',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 12,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerText: {
    fontSize: 14,
    color: '#999999',
    marginTop: 16,
  },
  signupText: {
    color: '#5D3FD3',
    fontWeight: 'bold',
  },
});

export default SignInView;
