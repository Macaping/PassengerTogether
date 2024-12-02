import * as Notifications from "expo-notifications";
import { Tabs } from "expo-router";
import React, { useEffect } from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useSession } from "@/hooks/useSession";
import { useUser } from "@/hooks/useUser";
import { useUserData } from "@/hooks/useUserData";

/**
 * TabLayout 페이지
 *
 * - 앱의 하단 탭 내비게이션을 구성합니다.
 * - 알림 수신 및 응답 처리를 설정합니다.
 *
 * 주요 기능:
 * 1. Expo Notifications를 사용한 알림 수신 및 응답 리스너 설정.
 * 2. 로그인 상태에 따라 탭 화면의 접근성을 제어.
 * 3. 사용자 친화적인 UI 옵션 설정 (활성화된 탭 색상, 헤더 스타일 등).
 *
 * @returns {React.ReactElement} 구성된 Tabs 레이아웃을 반환.
 */
export default function TabLayout() {
  const { session } = useSession();
  const { user } = useUser();
  const { userData } = useUserData();

  useEffect(() => {
    /**
     * 알림 처리 설정
     * - 알림 표시, 소리 재생, 배지 설정 여부를 제어.
     */
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    /**
     * 알림 수신 리스너
     * - 알림이 수신되었을 때 처리.
     */
    const subscriptionReceived = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("알림 수신:", notification);
      },
    );

    /**
     * 알림 응답 리스너
     * - 사용자가 알림을 클릭했을 때 처리.
     */
    const subscriptionResponse =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("사용자가 알림을 클릭했습니다:", response);
      });

    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
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
      {/* 홈 탭 */}
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
      {/* 나의 파티 탭 */}
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
      {/* 마이 페이지 탭 */}
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
      {/* 로그인 탭 */}
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
      {/* 동승자 확인 탭 */}
      <Tabs.Screen
        name="CheckPassenger"
        options={{ title: "동승자", href: null }}
      />
    </Tabs>
  );
}
