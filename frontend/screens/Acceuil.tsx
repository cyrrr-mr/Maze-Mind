import React, { useEffect, useRef, useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
  ImageBackground, Image, Alert, Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const avatars = [
  require("../assets/avatar1.png"),
  require("../assets/avatar2.png"),
  require("../assets/avatar3.png"),
  require("../assets/avatar5.png"),
];

export default function Acceuil({ navigation }: any) {
  const [username, setUsername] = useState("Player");
  const [avatarIdx, setAvatarIdx] = useState(0);
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    loadUser();
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const loadUser = async () => {
    const data = await AsyncStorage.getItem("user");
    if (data) {
      const u = JSON.parse(data);
      setUsername(u.username || "Player");
      setAvatarIdx(typeof u.avatar === "number" ? u.avatar : 0);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Déconnexion",
      "Tu vas perdre ta session locale. Continuer ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Déconnecter",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.multiRemove(["token", "user"]);
            navigation.replace("Auth");
          },
        },
      ]
    );
  };

  const MENU = [
    { label: "🎮 Jouer",       color: "#e56bdf", onPress: () => navigation.navigate("Niveaux") },
    { label: "📊 Progression", color: "#c373a4", onPress: () => navigation.navigate("Niveaux") },
    { label: "👤 Profil",      color: "#a967c1", onPress: () => navigation.navigate("Profil") },
    { label: "🚪 Déconnexion", color: "#888",    onPress: handleLogout },
  ];

  return (
    <ImageBackground
      source={require("../assets/niveaux_bg.jpg")}
      style={styles.bg}
      resizeMode="cover"
    >
      {/* ✅ absoluteFill */}
      <View style={styles.overlay} />

      <Animated.View
        style={[
          styles.header,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <Image source={avatars[avatarIdx]} style={styles.headerAvatar} />
        <View>
          <Text style={styles.welcome}>Bonjour 👋</Text>
          <Text style={styles.username}>{username}</Text>
        </View>
      </Animated.View>

      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {MENU.map((item, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.btn, { backgroundColor: item.color }]}
            onPress={item.onPress}
            activeOpacity={0.85}
          >
            <Text style={styles.text}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg:      { flex: 1 },
  // ✅ absoluteFill (sans Object)
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(255,255,255,0.18)" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 55,
    paddingHorizontal: 24,
    gap: 14,
  },
  headerAvatar: {
    width: 52, height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: "#fff",
  },
  welcome:   { fontSize: 13, color: "#555" },
  username:  { fontSize: 20, fontWeight: "900", color: "#333" },
  container: { flex: 1, justifyContent: "center", alignItems: "center", gap: 14 },
  btn: {
    width: 280,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  text: { color: "#fff", fontSize: 18, fontWeight: "800", letterSpacing: 0.5 },
});