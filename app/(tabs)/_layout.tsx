import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useUser } from "@/hooks/useUser";

export default function TabLayout() {
  const { user } = useUser();

  // if (loading) {
  //   return null; // 또는 로딩 인디케이터 표시
  // }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#6049E2",
        headerStyle: { backgroundColor: "#6049E2" },
        headerTintColor: "#ffffff",
        headerTitleAlign: "center",
        headerShadowVisible: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "방 조회",
          tabBarLabel: "홈",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="RoomDetail"
        options={{
          title: "나의 파티",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "ticket" : "ticket-outline"}
              color={color}
            />
          ),
          href: user ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="MyPage"
        options={{
          title: "마이 페이지",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "person" : "person-outline"}
              color={color}
            />
          ),
          href: user ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="SignIn"
        options={{
          title: "로그인",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "log-in" : "log-in-outline"}
              color={color}
            />
          ),
          href: user ? null : undefined,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="CheckPassenger"
        options={{ title: "동승자", href: null }}
      />
    </Tabs>
  );
}
