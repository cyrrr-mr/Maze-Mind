import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "user";

export const saveUser = async (user: any) => {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(user));

    // ✅ Réinitialiser la progression locale pour nouveau user
    await AsyncStorage.setItem("progress_Facile", "1");
    await AsyncStorage.setItem("progress_Intermédiaire", "0");
    await AsyncStorage.setItem("progress_Difficile", "0");

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
    await AsyncStorage.multiRemove([
      KEY,
      "token",
      "progress_Facile",
      "progress_Intermédiaire",
      "progress_Difficile",
    ]);
  } catch (e) {
    console.error("clearUser error:", e);
  }
};