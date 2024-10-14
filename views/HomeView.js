import React from 'react';
import { View, Text, Button } from 'react-native';
import { AuthController } from '../controllers/AuthController';

const HomeView = ({ navigation }) => {
  const user = AuthController.getCurrentUser();

  const handleLogout = async () => {
    try {
      await AuthController.signOut();
      navigation.navigate('Login');
    } catch (error) {
      console.error('로그아웃 에러:', error.message);
    }
  };

  return (
    <View>
      <Text>환영합니다, {user.email}님!</Text>
      <Button title="로그아웃" onPress={handleLogout} />
    </View>
  );
};

export default HomeView;
