import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { Link, useRouter } from "expo-router";
import { API_BASE_URL, api } from "../src/api/api";
import { useAuthStore } from "../src/store/authStore";

export default function LoginScreen() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password) {
      Alert.alert("Missing information", "Enter your email and password.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("/login", {
        email: email.trim(),
        password
      });
      await setAuth(response.data.user, response.data.token);
      router.replace("/users");
    } catch (error) {
      const message = error.response?.data?.message
        || `Could not connect to ${API_BASE_URL}. Make sure the backend is running and your phone and computer are on the same Wi-Fi.`;
      Alert.alert("Login failed", message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>Log in to continue.</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="emailAddress"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        textContentType="password"
      />

      <Pressable
        style={[styles.button, isLoading && styles.disabledButton]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading
          ? <ActivityIndicator color="#ffffff" />
          : <Text style={styles.buttonText}>Log in</Text>}
      </Pressable>

      <Text style={styles.footer}>
        New here? <Link href="/register" style={styles.link}>Create an account</Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center"
  },
  title: {
    color: "#20253a",
    fontSize: 28,
    fontWeight: "700"
  },
  subtitle: {
    color: "#737d95",
    fontSize: 16,
    marginTop: 8,
    marginBottom: 28
  },
  input: {
    backgroundColor: "#ffffff",
    borderColor: "#e1e5ef",
    borderRadius: 12,
    borderWidth: 1,
    color: "#20253a",
    fontSize: 16,
    marginBottom: 14,
    paddingHorizontal: 16,
    paddingVertical: 15
  },
  button: {
    alignItems: "center",
    backgroundColor: "#5965e8",
    borderRadius: 12,
    justifyContent: "center",
    marginTop: 8,
    minHeight: 52
  },
  disabledButton: {
    opacity: 0.7
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700"
  },
  footer: {
    color: "#737d95",
    marginTop: 22,
    textAlign: "center"
  },
  link: {
    color: "#5965e8",
    fontWeight: "700"
  }
});
