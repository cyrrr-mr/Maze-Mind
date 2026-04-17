import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "user_data";

export const saveUser = async (user: any) => {
  await AsyncStorage.setItem(KEY, JSON.stringify(user));
};

export const getUser = async () => {
  const data = await AsyncStorage.getItem(KEY);
  return data ? JSON.parse(data) : null;
};