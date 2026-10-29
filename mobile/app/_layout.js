import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "../src/store/authStore";

export default function RootLayout() {
  const loadAuth = useAuthStore((state) => state.loadAuth);

  useEffect(() => {
    loadAuth();
  }, [loadAuth]);

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#f7f8fc" },
          headerTintColor: "#20253a",
          contentStyle: { backgroundColor: "#f7f8fc" }
        }}
      >
        <Stack.Screen name="index" options={{ title: "MiniAuth", headerShown: false }} />
        <Stack.Screen name="register" options={{ title: "Create account" }} />
        <Stack.Screen name="login" options={{ title: "Login" }} />
        <Stack.Screen name="users" options={{ title: "Users" }} />
      </Stack>
    </>
  );
}
