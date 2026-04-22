import React, { useRef } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, ImageBackground,
} from "react-native";

export default function AuthScreen({ navigation }: any) {
  const scaleNew   = useRef(new Animated.Value(1)).current;
  const scaleExist = useRef(new Animated.Value(1)).current;

  const animPress = (anim: Animated.Value, cb: () => void) => {
    Animated.sequence([
      Animated.timing(anim, { toValue: 0.94, duration: 100, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 1,    duration: 100, useNativeDriver: true }),
    ]).start(cb);
  };

  return (
    <ImageBackground
      source={require("../assets/niveaux_bg.jpg")}
      style={styles.bg}
      resizeMode="cover"
    >
      {/* ✅ absoluteFill */}
      <View style={styles.overlay} />

      <View style={styles.container}>
        <View style={styles.logoBox}>
          <Text style={styles.logoEmoji}>🧩</Text>
          <Text style={styles.logoTitle}>MazeMind</Text>
          <Text style={styles.logoSub}>Bienvenue dans l'aventure !</Text>
        </View>

        <Animated.View style={{ transform: [{ scale: scaleNew }], width: "80%" }}>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => animPress(scaleNew, () => navigation.navigate("Inscription"))}
          >
            <Text style={styles.btnPrimaryText}>✨ Créer un compte</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: scaleExist }], width: "80%" }}>
          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() => animPress(scaleExist, () => navigation.navigate("Login"))}
          >
            <Text style={styles.btnSecondaryText}>🔑 J'ai déjà un compte</Text>
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.hint}>
          Connecte-toi pour retrouver ta progression
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg:      { flex: 1 },
  // ✅ absoluteFill
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(108,99,255,0.6)" },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 20,
  },
  logoBox:   { alignItems: "center", marginBottom: 40 },
  logoEmoji: { fontSize: 72, marginBottom: 8 },
  logoTitle: { fontSize: 44, fontWeight: "900", color: "#fff", letterSpacing: 2 },
  logoSub:   { fontSize: 15, color: "rgba(255,255,255,0.85)", marginTop: 4, fontStyle: "italic" },
  btnPrimary: {
    backgroundColor: "#FFD93D",
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
    elevation: 6,
  },
  btnPrimaryText:   { fontWeight: "900", fontSize: 18, color: "#333" },
  btnSecondary: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.6)",
  },
  btnSecondaryText: { fontWeight: "700", fontSize: 18, color: "#fff" },
  hint: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 13,
    marginTop: 10,
    textAlign: "center",
  },
});