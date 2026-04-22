import React, { useEffect, useRef, useState } from "react";
import {
  View, StyleSheet, Animated, ImageBackground, Text,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Splash">;

export default function SplashScreen({ navigation }: Props) {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim     = useRef(new Animated.Value(0)).current;
  const scaleAnim    = useRef(new Animated.Value(0.8)).current;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animations
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();

    Animated.timing(progressAnim, {
      toValue: 100,
      duration: 3000,
      useNativeDriver: false,
    }).start();

    const listener = progressAnim.addListener(({ value }) => {
      setProgress(Math.floor(value));
    });

    const timer = setTimeout(async () => {
      const token = await AsyncStorage.getItem("token");
      const userData = await AsyncStorage.getItem("user");

      if (token && userData) {
        navigation.replace("Acceuil");
      } else {
        navigation.replace("Auth");
      }
    }, 3200);

    return () => {
      progressAnim.removeListener(listener);
      clearTimeout(timer);
    };
  }, []);

  return (
    <ImageBackground
      source={require("../assets/MazeMind.jpg")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <Animated.View
        style={[styles.logoContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}
      >
        <Text style={styles.logoEmoji}>🧩</Text>
        <Text style={styles.logoTitle}>MazeMind</Text>
        <Text style={styles.logoSub}>Trouve ton chemin !</Text>
      </Animated.View>

      <View style={styles.bottomContainer}>
        <Text style={styles.percent}>{progress}%</Text>
        <View style={styles.barBg}>
          <Animated.View
            style={[
              styles.barFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg:            { flex: 1, justifyContent: "space-between", alignItems: "center" },
  overlay:       { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(108,99,255,0.55)" },
  logoContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  logoEmoji:     { fontSize: 80, marginBottom: 12 },
  logoTitle:     { fontSize: 48, fontWeight: "900", color: "#fff", letterSpacing: 2 },
  logoSub:       { fontSize: 16, color: "rgba(255,255,255,0.8)", marginTop: 6, fontStyle: "italic" },
  bottomContainer: { width: "100%", alignItems: "center", paddingBottom: 60 },
  percent:       { color: "#fff", fontWeight: "bold", fontSize: 16, marginBottom: 8 },
  barBg: {
    width: "75%",
    height: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 10,
    overflow: "hidden",
  },
  barFill:       { height: "100%", backgroundColor: "#FFD93D", borderRadius: 10 },
});