import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
} from "react-native";
import { getProgress } from "../utiles/progress";

export default function Levels({ route, navigation }: any) {
  const { niveau } = route.params;

  const total = 6;
  const [unlocked, setUnlocked] = useState(1);

  useEffect(() => {
    getProgress().then((p: any) => setUnlocked(p[niveau] || 1));
  }, [niveau]);

  return (
    <ImageBackground
      source={require("../assets/niveaux_bg.jpg")}
      style={styles.bg}
      resizeMode="cover"
    >
      {/* Fake blur overlay */}
      <View style={styles.overlay} />

      {/* Back button */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.navigate("Niveau")}
      >
        <Text style={styles.backText}>⬅ Back</Text>
      </TouchableOpacity>

      <View style={styles.container}>
        <Text style={styles.title}>{niveau}</Text>

        {Array.from({ length: total }).map((_, i) => {
          const level = i + 1;
          const locked = level > unlocked;

          return (
            <TouchableOpacity
              key={i}
              disabled={locked}
              onPress={() =>
                navigation.navigate("Play", { niveau, level })
              }
              style={[
                styles.button,
                locked ? styles.locked : styles.unlocked,
              ]}
            >
              <Text style={styles.text}>
                {locked ? "🔒 Locked" : `Level ${level}`}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },

  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(255,255,255,0.18)",
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },

  button: {
    width: "70%",
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },

  unlocked: {
    backgroundColor: "#F8BBD0", // rose pastel
  },

  locked: {
    backgroundColor: "#B0B0B0",
  },

  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },

  backBtn: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },

  backText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});