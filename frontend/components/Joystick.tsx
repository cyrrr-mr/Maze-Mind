import React, { useRef } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Animated } from "react-native";

export default function Joystick({ onMove }: { onMove: (dx: number, dy: number) => void }) {
  const makeAnim = () => useRef(new Animated.Value(1)).current;
  const upA = makeAnim(), downA = makeAnim(), leftA = makeAnim(), rightA = makeAnim();

  const pressBtn = (anim: Animated.Value, dx: number, dy: number) => {
    Animated.sequence([
      Animated.timing(anim, { toValue: 0.85, duration: 80, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 1,    duration: 80, useNativeDriver: true }),
    ]).start();
    onMove(dx, dy);
  };

  const Btn = ({
    anim, dx, dy, label,
  }: {
    anim: Animated.Value; dx: number; dy: number; label: string;
  }) => (
    <Animated.View style={{ transform: [{ scale: anim }] }}>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => pressBtn(anim, dx, dy)}
        activeOpacity={0.8}
      >
        <Text style={styles.arrow}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <Btn anim={upA}    dx={0}  dy={-1} label="▲" />
      <View style={styles.row}>
        <Btn anim={leftA}  dx={-1} dy={0}  label="◀" />
        <View style={styles.center}><Text style={styles.dot}>⬤</Text></View>
        <Btn anim={rightA} dx={1}  dy={0}  label="▶" />
      </View>
      <Btn anim={downA}  dx={0}  dy={1}  label="▼" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", marginTop: 16, marginBottom: 24 },
  row:       { flexDirection: "row", alignItems: "center" },
  btn: {
    width: 64, height: 64,
    backgroundColor: "#6C63FF",
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    margin: 6,
    elevation: 4,
    shadowColor: "#6C63FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
  arrow:  { fontSize: 24, color: "#fff", fontWeight: "900" },
  center: { width: 64, height: 64, justifyContent: "center", alignItems: "center" },
  dot:    { fontSize: 18, color: "rgba(108,99,255,0.3)" },
});