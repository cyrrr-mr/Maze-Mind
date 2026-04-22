import React, { useState, useRef, useEffect } from "react";
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Alert, ScrollView, Image, Animated, Dimensions, ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://maze-mind.onrender.com/api";

const avatars = [
  require("../assets/avatar1.png"),
  require("../assets/avatar2.png"),
  require("../assets/avatar3.png"),
  require("../assets/avatar5.png"),
];

const BALLOONS = [
  { left: "8%",  delay: 0,    color: "#FFB7B2", size: 44 },
  { left: "22%", delay: 900,  color: "#FFDAC1", size: 34 },
  { left: "38%", delay: 1600, color: "#B5EAD7", size: 52 },
  { left: "58%", delay: 600,  color: "#C7CEEA", size: 38 },
  { left: "74%", delay: 1300, color: "#FFB7B2", size: 30 },
  { left: "88%", delay: 2100, color: "#E2F0CB", size: 46 },
];

const Balloon = ({ left, delay, color, size }: any) => {
  const pos = useRef(new Animated.Value(Dimensions.get("window").height + 60)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(pos, {
        toValue: -140,
        duration: 7000 + delay,
        useNativeDriver: true,
      })
    ).start();
  }, []);
  return (
    <Animated.View
      style={{
        position: "absolute",
        left,
        bottom: 0,
        width: size,
        height: size * 1.35,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity: 0.65,
        transform: [{ translateY: pos }],
      }}
    />
  );
};

export default function Inscription({ navigation }: any) {
  const [username, setUsername]           = useState("");
  const [email, setEmail]                 = useState("");
  const [password, setPassword]           = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedAvatar, setSelectedAvatar]   = useState<number>(0);
  const [loading, setLoading]             = useState(false);

  const handleSubmit = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert("Erreur", "Remplis tous les champs !");
      return;
    }
    if (!email.includes("@")) {
      Alert.alert("Erreur", "Email invalide");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Erreur", "Mot de passe trop court (min 6 caractères)");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, avatar: selectedAvatar }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Erreur", data.message || "Inscription échouée");
        return;
      }

      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      navigation.replace("Acceuil");
    } catch {
      Alert.alert("Erreur", "Connexion au serveur impossible");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {BALLOONS.map((b, i) => <Balloon key={i} {...b} />)}

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.logo}>🧩</Text>
        <Text style={styles.title}>Inscription</Text>
        <Text style={styles.subtitle}>Rejoins l'aventure MazeMind !</Text>

        <TextInput
          placeholder="Nom d'utilisateur"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
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
        <TextInput
          placeholder="Confirmer le mot de passe"
          placeholderTextColor="#aaa"
          secureTextEntry
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <Text style={styles.label}>👤 Choisis ton avatar</Text>
        <View style={styles.avatarRow}>
          {avatars.map((img, index) => (
            <TouchableOpacity key={index} onPress={() => setSelectedAvatar(index)}>
              <Image
                source={img}
                style={[
                  styles.avatar,
                  selectedAvatar === index && styles.avatarSelected,
                ]}
              />
              {selectedAvatar === index && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#333" />
          ) : (
            <Text style={styles.buttonText}>🚀 C'est parti !</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.link}>Déjà un compte ? Se connecter</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#6C63FF" },
  scroll:    { flexGrow: 1, alignItems: "center", padding: 24, paddingTop: 60 },
  logo:      { fontSize: 64, marginBottom: 4 },
  title:     { fontSize: 34, fontWeight: "900", color: "#fff", letterSpacing: 1 },
  subtitle:  { fontSize: 14, color: "rgba(255,255,255,0.8)", marginBottom: 24, fontStyle: "italic" },
  input: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 14,
    marginVertical: 7,
    borderRadius: 16,
    fontSize: 15,
    color: "#333",
    elevation: 3,
  },
  label:     { color: "#fff", marginTop: 16, fontSize: 17, fontWeight: "700", alignSelf: "flex-start", marginLeft: "5%" },
  avatarRow: { flexDirection: "row", marginTop: 12, marginBottom: 8 },
  avatar: {
    width: 72, height: 72, borderRadius: 36,
    margin: 6, borderWidth: 3, borderColor: "transparent",
  },
  avatarSelected: { borderColor: "#FFD93D", opacity: 1 },
  checkmark: {
    position: "absolute", bottom: 4, right: 4,
    color: "#FFD93D", fontWeight: "900", fontSize: 16,
  },
  button: {
    backgroundColor: "#FFD93D",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 20,
    width: "70%",
    alignItems: "center",
    elevation: 5,
  },
  buttonText: { fontWeight: "900", fontSize: 18, color: "#333" },
  link:       { color: "rgba(255,255,255,0.85)", marginTop: 20, fontSize: 14, textDecorationLine: "underline" },
});