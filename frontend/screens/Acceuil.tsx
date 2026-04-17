import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";

export default function Acceuil({ navigation }: any) {
  return (
    <ImageBackground
      source={require("../assets/niveaux_bg.jpg")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <View style={styles.container}>

        {/* 🎮 Jouer */}
        <TouchableOpacity
          style={[styles.btn, styles.play]}
          onPress={() => navigation.navigate("Niveaux")}
        >
          <Text style={styles.text}>🎮 Jouer</Text>
        </TouchableOpacity>

        {/* 📊 Levels */}
        <TouchableOpacity
          style={[styles.btn, styles.levels]}
          onPress={() => navigation.navigate("Niveaux")}
        >
          <Text style={styles.text}>📊 Levels</Text>
        </TouchableOpacity>

        {/* 👤 Profil */}
        <TouchableOpacity
          style={[styles.btn, styles.profile]}
          onPress={() => navigation.navigate("Profil")}
        >
          <Text style={styles.text}>👤 Profil</Text>
        </TouchableOpacity>

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
    backgroundColor: "rgba(255,255,255,0.2)", // يعطي effect pastel
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  btn: {
    width: 270,          // 👈 أكبر
    padding: 20,         // 👈 أكبر
    borderRadius: 30,    // 👈 round جميل
    marginVertical: 12,
    alignItems: "center",
    elevation: 5,        // shadow Android
  },

  text: {
    color: "#333",
    fontSize: 20,
    fontWeight: "bold",
  },

  // 🎨 pastel colors
  play: {
    backgroundColor: "#e56bdfff", // pastel pink
  },

  levels: {
    backgroundColor: "#c373a4ff", // pastel green
  },

  profile: {
    backgroundColor: "#a967c1ff", // pastel blue
  },
});