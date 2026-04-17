import React, { useRef } from "react";
import { View, Animated, PanResponder } from "react-native";

export default function Joystick({ onMove }: { onMove: (dx: number, dy: number) => void }) {
  const pan = useRef(new Animated.ValueXY()).current;

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,

      onPanResponderMove: (_, g) => {
        if (Math.abs(g.dx) > Math.abs(g.dy)) {
          if (g.dx > 20) onMove(1, 0);
          if (g.dx < -20) onMove(-1, 0);
        } else {
          if (g.dy > 20) onMove(0, 1);
          if (g.dy < -20) onMove(0, -1);
        }
      },

      onPanResponderRelease: () => {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  return (
    <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: "#ddd", justifyContent: "center", alignItems: "center" }}>
      <Animated.View
        {...responder.panHandlers}
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: "#555",
        }}
      />
    </View>
  );
}