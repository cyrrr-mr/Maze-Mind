import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen   from "../screens/SplashScreen";
import AuthScreen     from "../screens/AuthScreen";
import Inscription    from "../screens/Inscription";
import LoginScreen    from "../screens/LoginScreen";
import Acceuil        from "../screens/Acceuil";
import Niveaux        from "../screens/Niveaux";
import Progression    from "../screens/Progression";
import PlayScreen     from "../screens/PlayScreen";
import Profil         from "../screens/Profil";
import WinScreen      from "../screens/WinScreen";
import FailScreen     from "../screens/FailScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash"      component={SplashScreen} />
        <Stack.Screen name="Auth"        component={AuthScreen} />
        <Stack.Screen name="Inscription" component={Inscription} />
        <Stack.Screen name="Login"       component={LoginScreen} />
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