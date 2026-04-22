import AsyncStorage from "@react-native-async-storage/async-storage";

export const BASE_URL = "https://maze-mind.onrender.com";

export const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = await AsyncStorage.getItem("token");
  return fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...(options.headers || {}),
    },
  });
};

export const getMaze = async (niveau: string, level: number) => {
  const res = await fetch(
    `${BASE_URL}/api/mazes/ai?niveau=${encodeURIComponent(niveau)}&level=${level}`
  );
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
};