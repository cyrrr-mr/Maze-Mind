import React, { useEffect, useRef } from "react";
import { Text, StyleSheet, TouchableOpacity, Animated } from "react-native";

export default function FailScreen({ route, navigation }: any) {
  const { niveau, level } = route.params;

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const bgAnim    = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(bgAnim, { toValue: 1,   duration: 200, useNativeDriver: false }),
      Animated.timing(bgAnim, { toValue: 0.6, duration: 300, useNativeDriver: false }),
      Animated.timing(bgAnim, { toValue: 1,   duration: 200, useNativeDriver: false }),
    ]).start();

    Animated.sequence([
      Animated.delay(100),
      Animated.spring(scaleAnim, { toValue: 1, tension: 60, friction: 4, useNativeDriver: true }),
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 15,  duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -15, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10,  duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0,   duration: 60, useNativeDriver: true }),
      ]),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.07, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const bgColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#1a1a2e", "#c0392b"],
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor: bgColor }]}>
      <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
        <Animated.Text style={[styles.emoji, { transform: [{ translateX: shakeAnim }] }]}>
          💀
        </Animated.Text>
        <Text style={styles.title}>Temps écoulé !</Text>
        <Text style={styles.subtitle}>Level {level} — {niveau}</Text>
        <Text style={styles.message}>
          Tu n'as pas réussi à temps.{"\n"}Réessaie !
        </Text>

        <Animated.View style={[{ width: "100%" }, { transform: [{ scale: pulseAnim }] }]}>
          <TouchableOpacity
            style={styles.btnRetry}
            onPress={() => navigation.replace("Play", { niveau, level })}
          >
            <Text style={styles.btnRetryText}>🔄 Réessayer</Text>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity
          style={styles.btnBack}
          onPress={() => navigation.navigate("Progression", { niveau })}
        >
          <Text style={styles.btnBackText}>📋 Niveaux</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnQuit}
          onPress={() => navigation.navigate("Acceuil")}
        >
          <Text style={styles.btnQuitText}>🏠 Accueil</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    backgroundColor: "#fff", borderRadius: 30, padding: 40,
    alignItems: "center", width: "82%",
    shadowColor: "#000", shadowOpacity: 0.4, shadowRadius: 20, elevation: 12,
  },
  emoji:         { fontSize: 70, marginBottom: 10 },
  title:         { fontSize: 30, fontWeight: "900", color: "#c0392b", marginBottom: 5 },
  subtitle:      { fontSize: 15, color: "#888", marginBottom: 10 },
  message:       { fontSize: 15, color: "#555", textAlign: "center", marginBottom: 25, lineHeight: 22 },
  btnRetry: {
    backgroundColor: "#e74c3c", paddingVertical: 14,
    borderRadius: 25, marginBottom: 12, width: "100%", alignItems: "center",
  },
  btnRetryText:  { color: "#fff", fontSize: 18, fontWeight: "900" },
  btnBack: {
    backgroundColor: "#f0f0f0", paddingVertical: 12,
    borderRadius: 25, marginBottom: 10, width: "100%", alignItems: "center",
  },
  btnBackText:   { color: "#555", fontSize: 16, fontWeight: "700" },
  btnQuit:       { paddingVertical: 10, width: "100%", alignItems: "center" },
  btnQuitText:   { color: "#aaa", fontSize: 15 },
});