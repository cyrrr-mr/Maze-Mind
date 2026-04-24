import AsyncStorage from "@react-native-async-storage/async-storage";
import { authFetch, BASE_URL } from "./api";

export const addScore = async (
  niveau: string,
  level: number,
  steps: number,
  optimalSteps: number,
  timeTaken: number,
  timeLimit: number
) => {
  try {
    const response = await authFetch("/api/performances", {
      method: "POST",
      body: JSON.stringify({
        niveau,
        level,
        steps,
        optimalSteps,
        timeTaken,
        timeLimit,
      }),
    });

    const data = await response.json();

    if (data.user) {
      // ✅ Mettre à jour le user complet venant du backend
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
    }

    return data; // contient newMedalUnlocked
  } catch (e) {
    console.error("addScore error:", e);
  }
};