import React, { useEffect, useRef } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");

const CONFETTI_COLORS = [
  "#FF6B6B","#FFE66D","#4ECDC4","#45B7D1",
  "#96CEB4","#FFEAA7","#DDA0DD","#98D8C8",
];

function ConfettiPiece({ color, delay }: { color: string; delay: number }) {
  const translateY = useRef(new Animated.Value(-20)).current;
  const translateX = useRef(new Animated.Value(Math.random() * width)).current;
  const rotate     = useRef(new Animated.Value(0)).current;
  const opacity    = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(translateY, { toValue: height + 20, duration: 2500 + Math.random() * 1500, useNativeDriver: true }),
        Animated.timing(rotate,     { toValue: 10, duration: 2500, useNativeDriver: true }),
        Animated.sequence([
          Animated.delay(1500),
          Animated.timing(opacity, { toValue: 0, duration: 1000, useNativeDriver: true }),
        ]),
      ]),
    ]).start();
  }, []);

  const spin = rotate.interpolate({ inputRange: [0, 10], outputRange: ["0deg", "720deg"] });

  return (
    <Animated.View
      style={[
        styles.confettiPiece,
        { backgroundColor: color, transform: [{ translateX }, { translateY }, { rotate: spin }], opacity },
      ]}
    />
  );
}

export default function WinScreen({ route, navigation }: any) {
  const { niveau, level, time, score } = route.params;

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const [s1, s2, s3] = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  const getStars = () => {
    if (!time) return 3;
    if (time < 15) return 3;
    if (time < 30) return 2;
    return 1;
  };
  const stars = getStars();

  useEffect(() => {
    Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 5, useNativeDriver: true }).start();
    Animated.sequence([
      Animated.delay(300),
      Animated.spring(s1, { toValue: 1, tension: 80, friction: 5, useNativeDriver: true }),
      Animated.delay(150),
      Animated.spring(s2, { toValue: 1, tension: 80, friction: 5, useNativeDriver: true }),
      Animated.delay(150),
      Animated.spring(s3, { toValue: 1, tension: 80, friction: 5, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {Array.from({ length: 30 }).map((_, i) => (
        <ConfettiPiece key={i} color={CONFETTI_COLORS[i % CONFETTI_COLORS.length]} delay={i * 80} />
      ))}

      <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
        <Text style={styles.emoji}>🎉</Text>
        <Text style={styles.title}>Bravo !</Text>
        <Text style={styles.subtitle}>Level {level} — {niveau}</Text>

        {/* Étoiles */}
        <View style={styles.starsRow}>
          {[s1, s2, s3].map((anim, i) => (
            <Animated.Text
              key={i}
              style={[styles.star, { transform: [{ scale: anim }] }, i >= stars && styles.starOff]}
            >⭐</Animated.Text>
          ))}
        </View>

        {/* Score */}
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>Score</Text>
          <Text style={styles.scoreValue}>+{score ?? 0}</Text>
        </View>

        {time != null && (
          <Text style={styles.time}>⏱ Temps : {time}s</Text>
        )}

        <TouchableOpacity
          style={styles.btnNext}
          onPress={() => navigation.replace("Play", { niveau, level: level + 1 })}
        >
          <Text style={styles.btnNextText}>▶ Niveau suivant</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnBack}
          onPress={() => navigation.navigate("Progression", { niveau })}
        >
          <Text style={styles.btnBackText}>📋 Niveaux</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: "#1a1a2e", justifyContent: "center", alignItems: "center" },
  confettiPiece:{ position: "absolute", top: 0, left: 0, width: 10, height: 10, borderRadius: 2 },
  card: {
    backgroundColor: "#fff", borderRadius: 30,
    padding: 36, alignItems: "center", width: "82%",
    elevation: 12, shadowColor: "#000",
    shadowOpacity: 0.3, shadowRadius: 20,
  },
  emoji:       { fontSize: 64, marginBottom: 8 },
  title:       { fontSize: 36, fontWeight: "900", color: "#333" },
  subtitle:    { fontSize: 16, color: "#888", marginBottom: 16 },
  starsRow:    { flexDirection: "row", gap: 8, marginBottom: 12 },
  star:        { fontSize: 38 },
  starOff:     { opacity: 0.2 },
  scoreBox:    {
    backgroundColor: "#FFD93D33", borderRadius: 16,
    paddingVertical: 10, paddingHorizontal: 28,
    alignItems: "center", marginBottom: 10,
  },
  scoreLabel:  { fontSize: 12, color: "#888", letterSpacing: 1 },
  scoreValue:  { fontSize: 28, fontWeight: "900", color: "#333" },
  time:        { fontSize: 14, color: "#666", marginBottom: 20 },
  btnNext: {
    backgroundColor: "#6C63FF", paddingVertical: 14,
    paddingHorizontal: 30, borderRadius: 25, marginBottom: 10,
    width: "100%", alignItems: "center", elevation: 4,
  },
  btnNextText: { color: "#fff", fontSize: 17, fontWeight: "900" },
  btnBack: {
    backgroundColor: "#f0f0f0", paddingVertical: 12,
    borderRadius: 25, width: "100%", alignItems: "center",
  },
  btnBackText: { color: "#555", fontSize: 15, fontWeight: "700" },
});