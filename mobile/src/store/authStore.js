import { create } from "zustand";
import { deleteToken, getToken, saveToken } from "../utils/storage";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isReady: false,

  loadAuth: async () => {
    const token = await getToken();
    set({ token, isReady: true });
  },

  setAuth: async (user, token) => {
    await saveToken(token);
    set({ user, token });
  },

  logout: async () => {
    await deleteToken();
    set({ user: null, token: null });
  }
}));
