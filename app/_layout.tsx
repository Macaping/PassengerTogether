import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { StatusBar } from "expo-status-bar";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

/**
 * RootLayout 페이지
 *
 * - 애플리케이션의 루트 레이아웃 및 내비게이션 설정을 담당합니다.
 * - 커스텀 폰트를 로드하며, 로드 완료 전에 Splash Screen을 유지합니다.
 * - Expo Router를 활용하여 화면 간 이동을 관리합니다.
 *
 * 주요 기능:
 * 1. 커스텀 폰트를 로드하여 애플리케이션 전역에 적용.
 * 2. Splash Screen 유지 및 로드 완료 후 숨김 처리.
 * 3. Stack Navigator를 통해 화면 간 전환 설정.
 *
 * @returns {React.ReactElement} 내비게이션이 포함된 앱의 루트 컴포넌트.
 */
export default function RootLayout() {
  // 커스텀 폰트 로드 상태
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // 폰트 로드 완료 시 Splash Screen 숨김
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // 로드 완료 전에는 아무것도 렌더링하지 않음
  if (!loaded) {
    return null;
  }

  return (
    <>
      {/* 상태 표시줄 스타일 */}
      <StatusBar style="auto" />

      {/* 내비게이션 컨테이너 */}
      <NavigationContainer>
        <Stack>
          {/* 탭 내비게이션 */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          {/* 기본적으로 포함된 스크린 */}
          <Stack.Screen name="+not-found" />

          {/* 방 리스트 */}
          <Stack.Screen
            name="RoomList"
            options={{
              title: "방 리스트",
              headerTitleAlign: "center",
              headerShadowVisible: false,
              headerStyle: { backgroundColor: "#6049E2" },
              headerTintColor: "#ffffff",
            }}
          />

          {/* 방 만들기 */}
          <Stack.Screen
            name="RoomMake"
            options={{
              title: "방 만들기",
              headerTitleAlign: "center",
              headerShadowVisible: false,
              headerStyle: { backgroundColor: "#6049E2" },
              headerTintColor: "#ffffff",
            }}
          />

          {/* 회원가입 */}
          <Stack.Screen
            name="SignUp"
            options={{
              title: "",
              headerTitleAlign: "center",
              headerShadowVisible: false,
              headerStyle: { backgroundColor: "#6049E2" },
              headerTintColor: "#ffffff",
            }}
          />

          {/* 채팅방 */}
          <Stack.Screen
            name="Chat"
            options={{
              title: "채 팅 방",
              headerTitleAlign: "center",
              headerShadowVisible: false,
              headerStyle: { backgroundColor: "#6049E2" },
              headerTintColor: "#ffffff",
            }}
          />
        </Stack>
      </NavigationContainer>
    </>
  );
}
