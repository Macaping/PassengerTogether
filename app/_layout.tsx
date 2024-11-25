import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { StatusBar } from "expo-status-bar";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
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
          <Stack.Screen
            name="RoomMake"
            options={{
              title: "",
              headerTitleAlign: "center",
              headerShadowVisible: false,
              headerStyle: { backgroundColor: "#6049E2" },
              headerTintColor: "#ffffff",
            }}
          />
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
