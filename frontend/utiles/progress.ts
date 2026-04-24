import AsyncStorage from "@react-native-async-storage/async-storage";

// ✅ On ne stocke plus la progression localement.
// ✅ On utilise uniquement la progression venant du backend.

export const getProgress = async (niveau: string): Promise<number> => {
  try {
    const data = await AsyncStorage.getItem("user");
    if (!data) return 0;

    const user = JSON.parse(data);
    return user?.progress?.[niveau] || 0;
  } catch (e) {
    console.error("getProgress error:", e);
    return 0;
  }
};

// ✅ Plus rien ici : backend gère tout
export const unlockLevel = async () => {
  return;
};