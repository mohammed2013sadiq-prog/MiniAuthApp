import axios from "axios";
import Constants from "expo-constants";
import { Platform } from "react-native";

const expoHost = Constants.expoConfig?.hostUri?.split(":")[0];
const fallbackHost = Platform.OS === "android" ? "10.0.2.2" : "localhost";
const configuredURL = process.env.EXPO_PUBLIC_API_URL?.trim();

export const API_BASE_URL = configuredURL || `http://${expoHost || fallbackHost}:3002`;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 10000
});
