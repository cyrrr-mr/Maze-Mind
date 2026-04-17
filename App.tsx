import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "./frontend/screens/SplashScreen";
import Inscription from "./frontend/screens/Inscription";
import Acceuil from "./frontend/screens/Acceuil";
import Niveaux from "./frontend/screens/Niveaux";
import Levels from "./frontend/screens/Levels";
import PlayScreen from "./frontend/screens/PlayScreen";
import Profil from "./frontend/screens/Profil"; // 👈 لازم تضيفها

export type RootStackParamList = {
  Splash: undefined;
  Inscription: undefined;
  Acceuil: undefined;
  Niveaux: undefined;
  Levels: { niveau: string };
  Play: { niveau: string; level: number };
  Profil: undefined; // 👈 مهم
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Inscription" component={Inscription} />
        <Stack.Screen name="Acceuil" component={Acceuil} />
        <Stack.Screen name="Niveaux" component={Niveaux} />
        <Stack.Screen name="Levels" component={Levels} />
        <Stack.Screen name="Play" component={PlayScreen} />

        {/* 👤 PROFIL */}
        <Stack.Screen name="Profil" component={Profil} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}