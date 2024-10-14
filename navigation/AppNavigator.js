import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginView from '../views/LoginView';
import RoomDetailView from '../views/RoomDetailView';
import SignupView from '../views/SignupView';
import HomeView from '../views/HomeView';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// RoomDetail을 위한 Tab Navigator 설정
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: {
          fontSize: 16,
        },
        // tabBarStyle: {
        //   height: 50, // 탭바의 높이 설정 부분
        // },
      }}
    >
      <Tab.Screen name="Detail" component={RoomDetailView} options={{ tabBarLabel: '나의 티켓' }} />
      {/* 필요한 탭 추가 */}
    </Tab.Navigator>
  );
};

// Stack Navigator 설정
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          headerTintColor: 'white',
          headerStyle: { backgroundColor: 'tomato' },
        }}
      >
        <Stack.Screen name="Tab" component={TabNavigator} />
        <Stack.Screen name="Login" component={LoginView} />
        <Stack.Screen name="Signup" component={SignupView} />
        <Stack.Screen name="Home" component={HomeView} />
        {/* 필요한 탭 추가 */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
