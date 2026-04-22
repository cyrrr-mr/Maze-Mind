import React, { useRef } from "react";
import {
  View, Text, TouchableOpacity, ImageBackground,
  StyleSheet, Animated,
} from "react-native";

const LEVELS = [
  {
    label: "😊 Facile",
    color: "#FFB7B2",
    route: "Facile",
    desc: "3 niveaux • Sans chrono",
  },
  {
    label: "🧠 Intermédiaire",
    color: "#B5EAD7",
    route: "Intermédiaire",
    desc: "5 niveaux • Avec chrono",
  },
  {
    label: "🔥 Difficile",
    color: "#C7CEEA",
    route: "Difficile",
    desc: "5 niveaux • Obstacles + chrono",
  },
];

export default function Niveaux({ navigation }: any) {
  const scales = [
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
  ];

  const press = (anim: Animated.Value, route: string) => {
    Animated.sequence([
      Animated.timing(anim, { toValue: 0.93, duration: 100, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 1,    duration: 100, useNativeDriver: true }),
    ]).start(() => navigation.navigate("Progression", { niveau: route }));
  };

  return (
    <ImageBackground
      source={require("../assets/niveaux_bg.jpg")}
      style={styles.bg}
      resizeMode="cover"
    >
      {/* ✅ absoluteFill */}
      <View style={styles.overlay} />

      <Text style={styles.title}>🗺️ Choisir un niveau</Text>
      <Text style={styles.subtitle}>Quel défi veux-tu relever ?</Text>

      <View style={styles.container}>
        {LEVELS.map((item, i) => (
          <Animated.View key={i} style={{ transform: [{ scale: scales[i] }] }}>
            <TouchableOpacity
              style={[styles.card, { backgroundColor: item.color }]}
              onPress={() => press(scales[i], item.route)}
              activeOpacity={0.9}
            >
              <Text style={styles.cardLabel}>{item.label}</Text>
              <Text style={styles.cardDesc}>{item.desc}</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg:      { flex: 1 },
  // ✅ absoluteFill
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(255,255,255,0.2)" },
  title: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "900",
    color: "#333",
    marginTop: 70,
    marginBottom: 4,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 14,
    color: "#666",
    marginBottom: 30,
    fontStyle: "italic",
  },
  container: { flex: 1, justifyContent: "center", alignItems: "center", gap: 20 },
  card: {
    width: 300,
    paddingVertical: 22,
    paddingHorizontal: 28,
    borderRadius: 30,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  cardLabel: { fontSize: 22, fontWeight: "900", color: "#333", marginBottom: 4 },
  cardDesc:  { fontSize: 13, color: "#555", fontStyle: "italic" },
});