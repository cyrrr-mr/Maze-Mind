import AsyncStorage from "@react-native-async-storage/async-storage";

// La progression est désormais 100% pilotée par le compte (backend), pas par
// l'appareil. Elle est mise à jour dans AsyncStorage("user") à chaque login,
// register, ou fin de partie (voir PlayScreen -> POST /api/performances).
// Ça évite qu'un nouveau compte "hérite" de la progression d'un ancien compte
// testé sur le même téléphone.

export const getProgress = async (niveau: string): Promise<number> => {
  const fallback = niveau === "Facile" ? 1 : 0;
  try {
    const data = await AsyncStorage.getItem("user");
    if (!data) return fallback;
    const user = JSON.parse(data);
    const p = user?.progress?.[niveau];
    return typeof p === "number" ? p : fallback;
  } catch (e) {
    console.error("getProgress error:", e);
    return fallback;
  }
};

export const getMedals = async (): Promise<{ debutant: boolean; avance: boolean; pro: boolean }> => {
  const fallback = { debutant: false, avance: false, pro: false };
  try {
    const data = await AsyncStorage.getItem("user");
    if (!data) return fallback;
    const user = JSON.parse(data);
    return user?.medals || fallback;
  } catch (e) {
    console.error("getMedals error:", e);
    return fallback;
  }
};
