import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import { useRouter } from "expo-router";
import { API_BASE_URL, api } from "../src/api/api";
import { useAuthStore } from "../src/store/authStore";

export default function UsersScreen() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadUsers = useCallback(async () => {
    if (!token) {
      router.replace("/login");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.get("/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.users);
    } catch (error) {
      const message = error.response?.data?.message
        || `Could not connect to ${API_BASE_URL}. Make sure the backend is running and your phone and computer are on the same Wi-Fi.`;
      Alert.alert("Could not load users", message);
      if (error.response?.status === 401) {
        await logout();
        router.replace("/login");
      }
    } finally {
      setIsLoading(false);
    }
  }, [logout, router, token]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  function renderUser({ item }) {
    return (
      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <View>
          <Text style={styles.title}>Users</Text>
          <Text style={styles.subtitle}>Accounts registered in the app</Text>
        </View>
        <Pressable onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#5965e8" style={styles.loader} />
      ) : (
        <FlatList
          data={users}
          renderItem={renderUser}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={users.length === 0 ? styles.emptyList : styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>No users found.</Text>}
          refreshing={isLoading}
          onRefresh={loadUsers}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  heading: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20
  },
  title: {
    color: "#20253a",
    fontSize: 28,
    fontWeight: "700"
  },
  subtitle: {
    color: "#737d95",
    fontSize: 14,
    marginTop: 5
  },
  logoutButton: {
    backgroundColor: "#eceeff",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  logoutText: {
    color: "#5965e8",
    fontWeight: "700"
  },
  loader: {
    flex: 1
  },
  list: {
    paddingBottom: 24
  },
  emptyList: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  emptyText: {
    color: "#737d95",
    fontSize: 16
  },
  userCard: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#e9ebf2",
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    marginBottom: 12,
    padding: 16
  },
  avatar: {
    alignItems: "center",
    backgroundColor: "#eceeff",
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    width: 44
  },
  avatarText: {
    color: "#5965e8",
    fontSize: 18,
    fontWeight: "700"
  },
  userDetails: {
    marginLeft: 14
  },
  userName: {
    color: "#20253a",
    fontSize: 16,
    fontWeight: "700"
  },
  userEmail: {
    color: "#737d95",
    fontSize: 14,
    marginTop: 4
  }
});
