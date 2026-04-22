import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen  from "./frontend/screens/SplashScreen";
import AuthScreen    from "./frontend/screens/AuthScreen";
import LoginScreen   from "./frontend/screens/LoginScreen";
import Inscription   from "./frontend/screens/Inscription";
import Acceuil       from "./frontend/screens/Acceuil";
import Niveaux       from "./frontend/screens/Niveaux";
import Progression   from "./frontend/screens/Progression";
import PlayScreen    from "./frontend/screens/PlayScreen";
import Profil        from "./frontend/screens/Profil";
import WinScreen     from "./frontend/screens/WinScreen";
import FailScreen    from "./frontend/screens/FailScreen";

export type RootStackParamList = {
  Splash:      undefined;
  Auth:        undefined;
  Login:       undefined;
  Inscription: undefined;
  Acceuil:     undefined;
  Niveaux:     undefined;
  Progression: { niveau: string };
  Play:        { niveau: string; level: number };
  Profil:      undefined;
  Win:         { niveau: string; level: number; time: number | null; score: number };
  Fail:        { niveau: string; level: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash"      component={SplashScreen} />
        <Stack.Screen name="Auth"        component={AuthScreen} />
        <Stack.Screen name="Login"       component={LoginScreen} />
        <Stack.Screen name="Inscription" component={Inscription} />
        <Stack.Screen name="Acceuil"     component={Acceuil} />
        <Stack.Screen name="Niveaux"     component={Niveaux} />
        <Stack.Screen name="Progression" component={Progression} />
        <Stack.Screen name="Play"        component={PlayScreen} />
        <Stack.Screen name="Profil"      component={Profil} />
        <Stack.Screen name="Win"         component={WinScreen} />
        <Stack.Screen name="Fail"        component={FailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}