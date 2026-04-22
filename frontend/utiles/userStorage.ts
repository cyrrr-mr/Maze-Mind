import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "user";

export const saveUser = async (user: any) => {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(user));
  } catch (e) {
    console.error("saveUser error:", e);
  }
};

export const getUser = async () => {
  try {
    const data = await AsyncStorage.getItem(KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const clearUser = async () => {
  try {
    await AsyncStorage.multiRemove([KEY, "token"]);
  } catch (e) {
    console.error("clearUser error:", e);
  }
};