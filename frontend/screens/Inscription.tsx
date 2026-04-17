import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  Animated,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Inscription">;
};

const avatars = [
  require("../assets/avatar1.png"),
  require("../assets/avatar2.png"),
  require("../assets/avatar3.png"),
  require("../assets/avatar5.png"),
];

const balloons = [
  { left: "10%", delay: 0, color: "#FF9AA2", size: 45 },
  { left: "25%", delay: 800, color: "#FFDAC1", size: 35 },
  { left: "40%", delay: 1500, color: "#B5EAD7", size: 50 },
  { left: "60%", delay: 500, color: "#C7CEEA", size: 40 },
  { left: "75%", delay: 1200, color: "#FFB7B2", size: 30 },
  { left: "85%", delay: 2000, color: "#E2F0CB", size: 45 },
];

const Balloon = ({ left, delay, color, size }: any) => {
  const position = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(position, {
        toValue: -Dimensions.get("window").height - 120,
        duration: 6000 + delay,
        useNativeDriver: true,
      })
    );

    anim.start();

    return () => anim.stop();
  }, [position, delay]);

  return (
    <Animated.View
      style={[
        styles.balloon,
        {
          left,
          backgroundColor: color,
          width: size,
          height: size * 1.3,
          borderRadius: size / 2,
          transform: [{ translateY: position }],
        },
      ]}
    />
  );
};

export default function Inscription({ navigation }: Props) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);

  const handleSubmit = async () => {
    if (!username || !email || !password || !confirmPassword || selectedAvatar === null) {
      Alert.alert("Erreur", "Remplis tous les champs !");
      return;
    }

    if (!email.endsWith("@gmail.com")) {
      Alert.alert("Erreur", "Email invalide");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erreur", "Passwords not matching");
      return;
    }

    const user = {
      username,
      email,
      avatar: avatars[selectedAvatar],
    };

    await AsyncStorage.setItem("user", JSON.stringify(user));

    navigation.navigate("Acceuil", user);
  };

  return (
    <View style={styles.container}>
      {balloons.map((b, i) => (
        <Balloon key={i} {...b} />
      ))}

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>✨ Inscription ✨</Text>

        <TextInput
          placeholder="Username"
          placeholderTextColor="#888"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          placeholder="Email"
          placeholderTextColor="#888"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor="#888"
          secureTextEntry
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <Text style={styles.label}>👤 Choisir avatar</Text>

        <View style={styles.avatarContainer}>
          {avatars.map((img, index) => (
            <TouchableOpacity key={index} onPress={() => setSelectedAvatar(index)}>
              <Image
                source={img}
                style={[
                  styles.avatar,
                  selectedAvatar === index && styles.selected,
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>🚀 Valider</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6C63FF",
  },

  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  title: {
    fontSize: 40,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 20,
  },

  input: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 12,
    marginVertical: 8,
    borderRadius: 12,
  },

  label: {
    color: "#fff",
    marginTop: 15,
    fontSize: 18,
    fontWeight: "bold",
  },

  avatarContainer: {
    flexDirection: "row",
    marginTop: 10,
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    margin: 5,
    borderWidth: 2,
    borderColor: "transparent",
  },

  selected: {
    borderColor: "#FFD93D",
  },

  button: {
    backgroundColor: "#FFD93D",
    padding: 15,
    borderRadius: 25,
    marginTop: 20,
    width: "60%",
    alignItems: "center",
  },

  buttonText: {
    fontWeight: "bold",
    fontSize: 18,
  },

  balloon: {
    position: "absolute",
    bottom: -120,
    opacity: 0.7,
  },
});