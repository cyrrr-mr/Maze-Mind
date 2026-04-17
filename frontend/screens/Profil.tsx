import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  Animated,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const avatars = [
  require("../assets/avatar1.png"),
  require("../assets/avatar2.png"),
  require("../assets/avatar3.png"),
  require("../assets/avatar4.png"),
  require("../assets/avatar5.png"),
  require("../assets/avatar6.png"),
];

export default function Profil({ navigation }: any) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const [username, setUsername] = useState("");
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();

    loadUser();
  }, [fadeAnim, scaleAnim]);

  const loadUser = async () => {
    try {
      const data = await AsyncStorage.getItem("user");
      if (data) {
        const user = JSON.parse(data);
        setUsername(user.username || "");
        // avatar stored as index (number)
        setAvatarIndex(
          typeof user.avatar === "number" ? user.avatar : 0
        );
        setScore(user.score || 0);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const changeAvatar = async (index: number) => {
    setAvatarIndex(index);
    try {
      const data = await AsyncStorage.getItem("user");
      if (data) {
        const user = JSON.parse(data);
        await AsyncStorage.setItem(
          "user",
          JSON.stringify({ ...user, avatar: index })
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      {/* background circles */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <Animated.View
        style={[
          styles.card,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        {/* Avatar */}
        <Image source={avatars[avatarIndex]} style={styles.avatar} />

        {/* Name */}
        <Text style={styles.name}>{username || "Player"}</Text>
        <Text style={styles.subtitle}>Maze Explorer ✨</Text>

        {/* Score */}
        <View style={styles.scoreBox}>
          <Text style={styles.scoreValue}>{score}</Text>
          <Text style={styles.scoreLabel}>Score</Text>
        </View>

        {/* Avatar picker */}
        <Text style={styles.sectionTitle}>   Modifier votre avatar 🎨</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.avatarScroll}
        >
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
                  avatarIndex === index && styles.smallAvatarSelected,
                ]}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Medals */}
        <TouchableOpacity style={styles.medalBtn} activeOpacity={0.8}>
          <Text style={styles.medalBtnText}>🏅 My Medals</Text>
        </TouchableOpacity>

        {/* Home */}
        <TouchableOpacity
          style={styles.homeBtn}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("Acceuil")}
        >
          <Text style={styles.homeBtnText}>🏠 Home</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const PINK  = "#FFB7B2";
const GREEN = "#B5EAD7";
const BLUE  = "#C7CEEA";
const BG    = "#F8F7FF";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    justifyContent: "center",
    alignItems: "center",
  },

  bgCircle1: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: PINK,
    opacity: 0.2,
    top: -50,
    left: -60,
  },
  bgCircle2: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: BLUE,
    opacity: 0.2,
    bottom: -80,
    right: -70,
  },

  card: {
    width: "88%",
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 22,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: PINK,
  },

  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 13,
    color: "#999",
    marginBottom: 14,
  },

  scoreBox: {
    backgroundColor: BLUE,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 30,
    alignItems: "center",
    marginBottom: 20,
  },
  scoreValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#444",
  },
  scoreLabel: {
    fontSize: 12,
    color: "#666",
    letterSpacing: 1,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  avatarScroll: {
    marginBottom: 20,
  },
  smallAvatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    margin: 6,
    borderWidth: 2.5,
    borderColor: "transparent",
    opacity: 0.75,
  },
  smallAvatarSelected: {
    borderColor: "#6C63FF",
    opacity: 1,
  },

  medalBtn: {
    backgroundColor: PINK,
    padding: 13,
    borderRadius: 16,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  medalBtnText: {
    fontWeight: "bold",
    color: "#333",
    fontSize: 14,
  },

  homeBtn: {
    backgroundColor: GREEN,
    padding: 13,
    borderRadius: 16,
    width: "100%",
    alignItems: "center",
  },
  homeBtnText: {
    fontWeight: "bold",
    color: "#333",
    fontSize: 14,
  },
});