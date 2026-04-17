import React from "react";
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from "react-native";

export default function Niveau({ navigation }: any) {
  return (
    <ImageBackground
      source={require("../assets/niveaux_bg.jpg")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={styles.container}>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#c272cdff" }]}
          onPress={() => navigation.navigate("Levels", { niveau: "Facile" })}
        >
          <Text style={styles.text}>Facile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#c445a8ff" }]}
          onPress={() => navigation.navigate("Levels", { niveau: "Intermédiaire" })}
        >
          <Text style={styles.text}>Intermédiaire</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#4c93bcff" }]}
          onPress={() => navigation.navigate("Levels", { niveau: "Difficile" })}
        >
          <Text style={styles.text}>Difficile</Text>
        </TouchableOpacity>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 45,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  text: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
});