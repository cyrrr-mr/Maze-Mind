import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "maze_progress";

export async function getProgress() {
  const data = await AsyncStorage.getItem(KEY);
  return data ? JSON.parse(data) : { Facile: 1, Intermédiaire: 1, Difficile: 1 };
}

export async function unlockNext(niveau: string, level: number) {
  const progress = await getProgress();

  if (level >= progress[niveau]) {
    progress[niveau] = level + 1;
    await AsyncStorage.setItem(KEY, JSON.stringify(progress));
  }
}