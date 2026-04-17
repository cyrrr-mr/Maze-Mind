import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Animated,
  ImageBackground,
  Text,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Splash">;

export default function SplashScreen({ navigation }: Props) {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 100,
      duration: 3000,
      useNativeDriver: false,
    }).start();

    const listener = progressAnim.addListener(({ value }) => {
      setProgress(Math.floor(value));
    });

    const timer = setTimeout(() => {
      navigation.replace("Inscription");
    }, 3000);

    return () => {
      progressAnim.removeListener(listener);
      clearTimeout(timer);
    };
  }, [navigation, progressAnim]);

  return (
    <ImageBackground
      source={require("../assets/MazeMind.jpg")}
      style={styles.bg}
    >
      {/* Percentage */}
      <Text style={styles.percent}>{progress}%</Text>

      {/* Progress Bar Background */}
      <View style={styles.barBg}>
        <Animated.View
          style={[
            styles.barFill,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },

  barBg: {
    width: "80%",
    height: 10,
    backgroundColor: "#ffffff50",
    borderRadius: 10,
    marginBottom: 60,
    overflow: "hidden",
  },

  barFill: {
    height: "100%",
    backgroundColor: "#00aaff",
  },

  percent: {
    position: "absolute",
    bottom: 80,
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});