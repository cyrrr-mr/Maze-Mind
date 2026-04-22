import AsyncStorage from "@react-native-async-storage/async-storage";

export const addScore = async (points: number) => {
  try {
    const data = await AsyncStorage.getItem("user");
    if (!data) return;
    const user = JSON.parse(data);
    const newScore = (user.score || 0) + points;
    await AsyncStorage.setItem("user", JSON.stringify({ ...user, score: newScore }));
  } catch (e) {
    console.error("addScore error:", e);
  }
};

export const getScore = async (): Promise<number> => {
  try {
    const data = await AsyncStorage.getItem("user");
    if (!data) return 0;
    return JSON.parse(data).score || 0;
  } catch {
    return 0;
  }
};