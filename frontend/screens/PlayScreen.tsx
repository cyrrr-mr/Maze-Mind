import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MazeBoard from "../components/MazeBoard";
import Joystick from "../components/Joystick";
import { addScore } from "../utiles/score";

const API_URL = "https://maze-mind.onrender.com";

type Cell = {
  type: number;
  walls: { top: boolean; right: boolean; bottom: boolean; left: boolean };
};

export default function PlayScreen({ route, navigation }: any) {
  const { niveau, level } = route.params;

  const [mazeGrid, setMazeGrid] = useState<Cell[][]>([]);
  const [player, setPlayer] = useState({ r: 0, c: 0 });
  const [end, setEnd] = useState({ r: 0, c: 0 });
  const [loading, setLoading] = useState(true);
  const [won, setWon] = useState(false);
  const [avatarIdx, setAvatarIdx] = useState(0);
  const [optimalSteps, setOptimalSteps] = useState(0);
  const [hasTimer, setHasTimer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const stepsRef = useRef(0);
  const elapsedRef = useRef(0);
  const timeLimitRef = useRef(0);

  useEffect(() => {
    AsyncStorage.getItem("user").then((d) => {
      if (d) {
        const u = JSON.parse(d);
        setAvatarIdx(typeof u.avatar === "number" ? u.avatar : 0);
      }
    });
  }, []);

  const convertMaze = (maze: number[][]): Cell[][] => {
    const size = maze.length;
    return maze.map((row, r) =>
      row.map((value, c) => ({
        type: value,
        walls: {
          top: r === 0 || maze[r - 1][c] === 1,
          bottom: r === size - 1 || maze[r + 1][c] === 1,
          left: c === 0 || maze[r][c - 1] === 1,
          right: c === size - 1 || maze[r][c + 1] === 1,
        },
      }))
    );
  };

  const loadMaze = useCallback(async () => {
    try {
      setLoading(true);
      setWon(false);
      stepsRef.current = 0;
      elapsedRef.current = 0;

      const res = await fetch(
        `${API_URL}/api/mazes/ai?niveau=${encodeURIComponent(
          niveau
        )}&level=${level}`
      );

      const data = await res.json();

      setMazeGrid(convertMaze(data.maze));
      setPlayer({ r: 0, c: 0 });
      setEnd({ r: data.size - 1, c: data.size - 1 });
      setOptimalSteps(data.optimalSteps || 0);

      setHasTimer(data.hasTimer || false);
      setTimeLeft(data.timeLimit || 0);
      timeLimitRef.current = data.timeLimit || 0;
    } catch (err) {
      console.error("loadMaze error:", err);
    } finally {
      setLoading(false);
    }
  }, [niveau, level]);

  useEffect(() => {
    loadMaze();
  }, [loadMaze]);

  useEffect(() => {
    if (!hasTimer || loading) return;

    const interval = setInterval(() => {
      elapsedRef.current += 1;

      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigation.replace("Fail", { niveau, level });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [hasTimer, loading]);

  const move = (dx: number, dy: number) => {
    setPlayer((prev) => {
      const newR = prev.r + dy;
      const newC = prev.c + dx;

      if (!mazeGrid[newR] || mazeGrid[newR][newC] === undefined) return prev;

      const cell = mazeGrid[prev.r][prev.c];

      if (dx === 1 && cell.walls.right) return prev;
      if (dx === -1 && cell.walls.left) return prev;
      if (dy === 1 && cell.walls.bottom) return prev;
      if (dy === -1 && cell.walls.top) return prev;

      if (mazeGrid[newR][newC].type === 2) return prev;

      stepsRef.current += 1;
      return { r: newR, c: newC };
    });
  };

  useEffect(() => {
    if (!mazeGrid.length || won) return;
    if (player.r !== end.r || player.c !== end.c) return;

    const handleWin = async () => {
      setWon(true);

      const steps = stepsRef.current;
      const elapsed = elapsedRef.current;
      const timeLimit = timeLimitRef.current;

      const data = await addScore(
        niveau,
        level,
        steps,
        optimalSteps,
        elapsed,
        timeLimit
      );

      let nextNiveau = niveau;
      let nextLevel = level + 1;

      if (niveau === "Facile" && level >= 3) {
        nextNiveau = "Intermédiaire";
        nextLevel = 1;
      } else if (niveau === "Intermédiaire" && level >= 5) {
        nextNiveau = "Difficile";
        nextLevel = 1;
      }

      navigation.replace("Win", {
        niveau: nextNiveau,
        level: nextLevel,
        score: data?.score || 0,
        time: hasTimer ? elapsed : null,
        medal: data?.newMedalUnlocked || null,
      });
    };

    handleWin();
  }, [player, end]);

  const { width, height } = Dimensions.get("window");
  const gridSize = mazeGrid.length;
  const reservedHeight = 220;

  const cellSize = Math.floor(
    Math.min((width * 0.9) / gridSize, (height - reservedHeight) / gridSize)
  );

  if (loading || !mazeGrid.length) {
    return (
      <ImageBackground
        source={require("../assets/play.png")}
        style={styles.bg}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <View style={styles.center}>
          <Text style={styles.loadingEmoji}>🧩</Text>
          <Text style={styles.loadingText}>Génération du labyrinthe…</Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={require("../assets/play.png")} style={styles.bg}>
      <View style={styles.overlay} />

      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {niveau} — Level {level}
          </Text>
          {hasTimer && <Text style={styles.timer}>⏱ {timeLeft}s</Text>}
        </View>

        <MazeBoard
          grid={mazeGrid}
          player={player}
          end={end}
          cellSize={cellSize}
          avatarIndex={avatarIdx}
        />

        <Joystick onMove={move} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(255,255,255,0.22)",
  },
  container: { flex: 1, alignItems: "center" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { marginTop: 52, marginBottom: 12, alignItems: "center" },
  title: { fontSize: 18, fontWeight: "900", color: "#333" },
  timer: { fontSize: 16, fontWeight: "700", marginTop: 6, color: "#F44336" },
  loadingEmoji: { fontSize: 52, marginBottom: 12 },
  loadingText: { fontSize: 16, color: "#333", fontWeight: "700" },
});