import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../src/store/authStore";

export default function HomeScreen() {
  const router = useRouter();
  const isReady = useAuthStore((state) => state.isReady);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (isReady) {
      router.replace(token ? "/users" : "/login");
    }
  }, [isReady, token, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#5965e8" />
      <Text style={styles.text}>Preparing your account...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f7f8fc"
  },
  text: {
    marginTop: 14,
    color: "#65708a",
    fontSize: 16
  }
});
