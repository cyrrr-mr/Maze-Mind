import React, { useEffect, useRef, useState } from "react";
import {
  View, Text, Image, Animated, StyleSheet,
  TouchableOpacity, ScrollView, Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authFetch } from "../utiles/api";
import { MEDALS } from "../utiles/medals";

const avatars = [
  require("../assets/avatar1.png"),
  require("../assets/avatar2.png"),
  require("../assets/avatar3.png"),
  require("../assets/avatar4.png"),
  require("../assets/avatar5.png"),
  require("../assets/avatar6.png"),
];

export default function Profil({ navigation }: any) {
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  const [username, setUsername]   = useState("");
  const [avatarIdx, setAvatarIdx] = useState(0);
  const [score, setScore]         = useState(0);
  const [medals, setMedals]       = useState({ debutant: false, avance: false, pro: false });

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      // Essaie backend d'abord
      const res = await authFetch("/api/auth/profile");
      if (res.ok) {
        const user = await res.json();
        setUsername(user.username || "");
        setAvatarIdx(typeof user.avatar === "number" ? user.avatar : 0);
        setScore(user.totalScore || 0);
        setMedals(user.medals || { debutant: false, avance: false, pro: false });
        await AsyncStorage.setItem("user", JSON.stringify({
          ...user,
          score: user.totalScore,
        }));
        return;
      }
    } catch {}

    // Fallback local
    const data = await AsyncStorage.getItem("user");
    if (data) {
      const u = JSON.parse(data);
      setUsername(u.username || "");
      setAvatarIdx(typeof u.avatar === "number" ? u.avatar : 0);
      setScore(u.score || u.totalScore || 0);
      setMedals(u.medals || { debutant: false, avance: false, pro: false });
    }
  };

  const changeAvatar = async (index: number) => {
    setAvatarIdx(index);
    try {
      await authFetch("/api/auth/avatar", {
        method: "PUT",
        body: JSON.stringify({ avatar: index }),
      });
      const data = await AsyncStorage.getItem("user");
      if (data) {
        const user = JSON.parse(data);
        await AsyncStorage.setItem("user", JSON.stringify({ ...user, avatar: index }));
      }
    } catch {}
  };

  const earnedCount = Object.values(medals).filter(Boolean).length;

  return (
    <View style={styles.container}>
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <Animated.ScrollView
        contentContainerStyle={styles.scroll}
        style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}
      >
        {/* Avatar */}
        <View style={styles.avatarWrapper}>
          <Image source={avatars[avatarIdx]} style={styles.avatar} />
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreBadgeText}>⭐ {score}</Text>
          </View>
        </View>

        <Text style={styles.name}>{username || "Player"}</Text>
        <Text style={styles.subtitle}>Maze Explorer ✨</Text>

        {/* Medals Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏅 Mes Médailles ({earnedCount}/3)</Text>
          <View style={styles.medalsRow}>
            {MEDALS.map((medal) => {
              const earned = medals[medal.id as keyof typeof medals];
              return (
                <View
                  key={medal.id}
                  style={[
                    styles.medalCard,
                    earned ? { borderColor: medal.color, backgroundColor: medal.color + "22" } : styles.medalLocked,
                  ]}
                >
                  <Text style={[styles.medalEmoji, !earned && { opacity: 0.3 }]}>
                    {medal.emoji}
                  </Text>
                  <Text style={[styles.medalLabel, !earned && { color: "#bbb" }]}>
                    {medal.label}
                  </Text>
                  {!earned && <Text style={styles.medalLockIcon}>🔒</Text>}
                </View>
              );
            })}
          </View>
        </View>

        {/* Avatar Picker */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎨 Changer d'avatar</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {avatars.map((img, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => changeAvatar(index)}
                activeOpacity={0.8}
              >
                <Image
                  source={img}
                  style={[
                    styles.smallAvatar,
                    avatarIdx === index && styles.smallAvatarSelected,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Boutons */}
        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => navigation.navigate("Acceuil")}
        >
          <Text style={styles.homeBtnText}>🏠 Accueil</Text>
        </TouchableOpacity>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: "#F8F7FF",
  },
  bgCircle1: {
    position: "absolute", width: 260, height: 260,
    borderRadius: 130, backgroundColor: "#FFB7B2",
    opacity: 0.2, top: -50, left: -60,
  },
  bgCircle2: {
    position: "absolute", width: 300, height: 300,
    borderRadius: 150, backgroundColor: "#C7CEEA",
    opacity: 0.2, bottom: -80, right: -70,
  },
  scroll:        { padding: 24, paddingTop: 60, alignItems: "center" },
  avatarWrapper: { position: "relative", marginBottom: 10 },
  avatar: {
    width: 120, height: 120, borderRadius: 60,
    borderWidth: 4, borderColor: "#6C63FF",
  },
  scoreBadge: {
    position: "absolute", bottom: -8, right: -8,
    backgroundColor: "#FFD93D", borderRadius: 16,
    paddingHorizontal: 10, paddingVertical: 4,
    elevation: 4,
  },
  scoreBadgeText: { fontWeight: "900", fontSize: 13, color: "#333" },
  name:     { fontSize: 26, fontWeight: "900", color: "#333", marginTop: 14 },
  subtitle: { fontSize: 13, color: "#999", marginBottom: 20, fontStyle: "italic" },
  section:  { width: "100%", marginBottom: 20 },
  sectionTitle: {
    fontSize: 15, fontWeight: "800", color: "#555",
    marginBottom: 12,
  },
  medalsRow:   { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  medalCard: {
    flex: 1, alignItems: "center", padding: 12,
    borderRadius: 18, borderWidth: 2,
    backgroundColor: "#fff", elevation: 3,
  },
  medalLocked: { borderColor: "#ddd", backgroundColor: "#f5f5f5" },
  medalEmoji:  { fontSize: 32, marginBottom: 4 },
  medalLabel:  { fontSize: 12, fontWeight: "700", color: "#444" },
  medalLockIcon: { fontSize: 14, marginTop: 4 },
  smallAvatar: {
    width: 60, height: 60, borderRadius: 30, margin: 6,
    borderWidth: 2.5, borderColor: "transparent", opacity: 0.75,
  },
  smallAvatarSelected: { borderColor: "#6C63FF", opacity: 1 },
  homeBtn: {
    backgroundColor: "#B5EAD7", padding: 14,
    borderRadius: 20, width: "100%", alignItems: "center",
    marginTop: 8, elevation: 3,
  },
  homeBtnText: { fontWeight: "800", color: "#333", fontSize: 15 },
});