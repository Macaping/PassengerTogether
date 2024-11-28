import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import * as Notifications from "expo-notifications";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useUser } from "@/hooks/useUser";

export default function TabLayout() {
  const { user } = useUser();

  // if (loading) {
  //   return null; // 또는 로딩 인디케이터 표시
  // }
  useEffect(() => {
    // 알림 처리기 설정
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
    // 알림 수신 리스너 등록
    const subscriptionReceived = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("알림 수신:", notification);
        // 여기에서 알림 수신 시 추가적인 처리를 할 수 있습니다.
      },
    );
    // 알림 응답 리스너 등록 (사용자가 알림을 클릭했을 때)
    const subscriptionResponse =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("사용자가 알림을 클릭했습니다:", response);
        // 여기에서 사용자가 알림을 클릭했을 때 추가적인 처리를 할 수 있습니다.
      });
    return () => {
      // 컴포넌트가 언마운트 될 때 리스너 제거
      subscriptionReceived.remove();
      subscriptionResponse.remove();
    };
  }, []);
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
