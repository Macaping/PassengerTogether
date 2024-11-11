import { signUpUser } from '@/utils/auth.utils';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignUpView() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignUp = async () => {
    signUpUser(email, password, confirmPassword, nickname)
      .then(() => router.replace('/(tabs)/'))
      .catch((e: string) => setErrorMessage(e));
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
        placeholder="두글자 이상의 닉네임을 입력하세요"
        value={nickname}
        onChangeText={setNickname}
      />

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
        <Text style={styles.signupButtonText}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );
}

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
  errorText: {
    color: '#FF0000',
    fontSize: 12,
    marginBottom: 12,
    textAlign: 'left',
    width: '80%',
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
