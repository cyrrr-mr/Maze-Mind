import React, { useState, useRef } from "react";
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Alert, Animated, ImageBackground, ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://maze-mind.onrender.com/api";

export default function LoginScreen({ navigation }: any) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8,   duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0,   duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleLogin = async () => {
    if (!username || !password) {
      shake();
      Alert.alert("Erreur", "Remplis tous les champs");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        shake();
        Alert.alert("Erreur", data.message || "Connexion échouée");
        return;
      }

      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      navigation.replace("Acceuil");
    } catch {
      shake();
      Alert.alert("Erreur", "Connexion au serveur impossible");
    } finally {
      setLoading(false);
    }
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
        <Text style={styles.title}>🔑 Connexion</Text>
        <Text style={styles.subtitle}>Retrouve ta progression</Text>

        <Animated.View
          style={[styles.form, { transform: [{ translateX: shakeAnim }] }]}
        >
          <TextInput
            placeholder="Nom d'utilisateur ou email"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Mot de passe"
            placeholderTextColor="#aaa"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={styles.btn}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#333" />
              : <Text style={styles.btnText}>🚀 Se connecter</Text>
            }
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity onPress={() => navigation.navigate("Inscription")}>
          <Text style={styles.link}>Pas de compte ? S'inscrire</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg:      { flex: 1 },
  // ✅ absoluteFill
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(108,99,255,0.65)" },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title:    { fontSize: 36, fontWeight: "900", color: "#fff", marginBottom: 6 },
  subtitle: { fontSize: 15, color: "rgba(255,255,255,0.8)", marginBottom: 30, fontStyle: "italic" },
  form:     { width: "100%", alignItems: "center", gap: 14 },
  input: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 16,
    fontSize: 15,
    color: "#333",
    elevation: 3,
  },
  btn: {
    backgroundColor: "#FFD93D",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 8,
    width: "70%",
    alignItems: "center",
    elevation: 4,
  },
  btnText: { fontWeight: "900", fontSize: 17, color: "#333" },
  link:    {
    color: "rgba(255,255,255,0.85)",
    marginTop: 24,
    fontSize: 14,
    textDecorationLine: "underline",
  },
});