import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeView from './HomeView'; // HomeView의 정확한 경로
import RoomMake from './RoomMake'; // RoomMake의 정확한 경로

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeView">
        <Stack.Screen name="HomeView" component={HomeView} />
        <Stack.Screen name="RoomMake" component={RoomMake} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
