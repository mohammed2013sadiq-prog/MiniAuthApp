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

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert("Missing information", "Enter your name, email, and password.");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/register", {
        name: name.trim(),
        email: email.trim(),
        password
      });
      Alert.alert("Account created", "You can now log in.", [
        { text: "Continue", onPress: () => router.replace("/login") }
      ]);
    } catch (error) {
      const message = error.response?.data?.message
        || `Could not connect to ${API_BASE_URL}. Make sure the backend is running and your phone and computer are on the same Wi-Fi.`;
      Alert.alert("Registration failed", message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create your account</Text>
      <Text style={styles.subtitle}>Register to use MiniAuth.</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        textContentType="name"
      />
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
        placeholder="Password (at least 6 characters)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        textContentType="newPassword"
      />

      <Pressable
        style={[styles.button, isLoading && styles.disabledButton]}
        onPress={handleRegister}
        disabled={isLoading}
      >
        {isLoading
          ? <ActivityIndicator color="#ffffff" />
          : <Text style={styles.buttonText}>Create account</Text>}
      </Pressable>

      <Text style={styles.footer}>
        Already registered? <Link href="/login" style={styles.link}>Log in</Link>
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
