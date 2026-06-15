import AsyncStorage from "@react-native-async-storage/async-storage";

// URL base da API REST (a mesma do deploy web na Vercel).
// Configure em mobile/.env -> EXPO_PUBLIC_API_URL=https://seu-deploy.vercel.app/api
// Para teste local com Expo Go use o IP da sua maquina, ex: http://192.168.0.10:3000/api
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api";

const TOKEN_KEY = "vf_token";
const USER_KEY = "vf_user";

export async function getToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function getUser() {
  const raw = await AsyncStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function saveSession(token, user) {
  await AsyncStorage.setItem(TOKEN_KEY, token);
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function clearSession() {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
}

export async function api(path, options = {}) {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || "Erro na requisicao");
  return data;
}
