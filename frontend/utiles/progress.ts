import AsyncStorage from "@react-native-async-storage/async-storage";

export const unlockLevel = async (niveau: string, level: number): Promise<void> => {
  const key = `progress_${niveau}`;
  try {
    const data = await AsyncStorage.getItem(key);
    const current = data ? JSON.parse(data) : 1;
    if (level > current) {
      await AsyncStorage.setItem(key, JSON.stringify(level));
    }
  } catch (e) {
    console.error("unlockLevel error:", e);
  }
};

export const getProgress = async (niveau: string): Promise<number> => {
  const key = `progress_${niveau}`;
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : 1;
  } catch (e) {
    console.error("getProgress error:", e);
    return 1;
  }
};