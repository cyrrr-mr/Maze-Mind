import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, ImageBackground,
  StyleSheet, ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getProgress } from "../utiles/progress";
import { getMedalForNiveau } from "../utiles/medals";

const TOTAL: Record<string, number> = {
  Facile:           3,
  "Intermédiaire":  5,
  Difficile:        5,
};

export default function Progression({ route, navigation }: any) {
  const { niveau } = route.params;
  const total = TOTAL[niveau] || 3;
  const [unlocked, setUnlocked] = useState(1);

  useFocusEffect(
    React.useCallback(() => {
      getProgress(niveau).then((p: number) => setUnlocked(Math.max(p, 1)));
    }, [niveau])
  );

  const medal   = getMedalForNiveau(niveau);
  const allDone = unlocked > total;

  return (
    <ImageBackground
      source={require("../assets/niveaux_bg.jpg")}
      style={styles.bg}
      resizeMode="cover"
    >
      {/* ✅ absoluteFill */}
      <View style={styles.overlay} />

      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Retour</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{niveau}</Text>

        {medal && (
          <View style={[styles.medalHint, { borderColor: medal.color }]}>
            <Text style={styles.medalEmoji}>{medal.emoji}</Text>
            <Text style={styles.medalText}>
              {allDone
                ? `🎉 Médaille ${medal.label} débloquée !`
                : `Complète tous les niveaux pour la médaille ${medal.label}`}
            </Text>
          </View>
        )}

        {Array.from({ length: total }).map((_, i) => {
          const lvl    = i + 1;
          const locked = lvl > unlocked;
          const done   = lvl < unlocked;

          return (
            <TouchableOpacity
              key={lvl}
              disabled={locked}
              onPress={() => navigation.navigate("Play", { niveau, level: lvl })}
              style={[
                styles.levelBtn,
                locked ? styles.locked : done ? styles.done : styles.current,
              ]}
            >
              <Text style={styles.levelEmoji}>
                {locked ? "🔒" : done ? "✅" : "🎯"}
              </Text>
              <View>
                <Text style={styles.levelTitle}>
                  {locked ? "Verrouillé" : `Level ${lvl}`}
                </Text>
                {!locked && (
                  <Text style={styles.levelSub}>
                    {done ? "Complété ✓" : "En cours"}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg:      { flex: 1 },
  // ✅ absoluteFill
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(255,255,255,0.2)" },
  back: {
    position: "absolute",
    top: 50, left: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 14,
  },
  backText:  { color: "#fff", fontWeight: "700", fontSize: 15 },
  container: { paddingTop: 110, paddingBottom: 40, alignItems: "center", gap: 14 },
  title:     { fontSize: 32, fontWeight: "900", color: "#fff", marginBottom: 10 },
  medalHint: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.88)",
    borderRadius: 16,
    borderWidth: 2,
    padding: 12,
    width: "85%",
    gap: 10,
    marginBottom: 10,
  },
  medalEmoji: { fontSize: 28 },
  medalText:  { flex: 1, fontSize: 13, color: "#444", fontWeight: "600" },
  levelBtn: {
    flexDirection: "row",
    alignItems: "center",
    width: "85%",
    padding: 18,
    borderRadius: 22,
    gap: 16,
    elevation: 4,
  },
  locked:     { backgroundColor: "#ccc" },
  done:       { backgroundColor: "#B5EAD7" },
  current:    { backgroundColor: "#FFB7B2" },
  levelEmoji: { fontSize: 28 },
  levelTitle: { fontSize: 17, fontWeight: "800", color: "#333" },
  levelSub:   { fontSize: 12, color: "#666", marginTop: 2 },
});