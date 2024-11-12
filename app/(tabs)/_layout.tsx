import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useAuthUser } from '@/hooks/useAuthUser';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user, loading } = useAuthUser();

  if (loading) {
    return null; // 또는 로딩 인디케이터 표시
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerStyle: { backgroundColor: '#6049E2' },
        headerTintColor: '#ffffff',
        headerTitleAlign: 'center',
      }}>
      <Tabs.Screen
        name="RoomDetail"
        options={{
          title: '나의 파티',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'ticket' : 'ticket-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: '방 조회',
          tabBarLabel: '홈',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      {/* user가 있으면 마이 페이지, 없으면 로그인 */}
      {user ? (
        <Tabs.Screen
          name="MyPage"
          options={{
            title: '마이 페이지',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'person-circle' : 'person-circle-outline'} color={color} />
            ),
          }}
        />
      ) : (
        <Tabs.Screen
          name="SignIn"
          options={{
            title: '로그인',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'log-in' : 'log-in-outline'} color={color} />
            ),
          }}
        />
      )}
    </Tabs>
  );
}
