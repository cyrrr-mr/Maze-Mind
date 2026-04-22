import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View, Text, StyleSheet, ImageBackground,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MazeBoard from "../components/MazeBoard";
import Joystick  from "../components/Joystick";
import { unlockLevel } from "../utiles/progress";
import { addScore }    from "../utiles/score";

const API_URL = "https://maze-mind.onrender.com";

type Cell = {
  walls: { top: boolean; right: boolean; bottom: boolean; left: boolean };
};

export default function PlayScreen({ route, navigation }: any) {
  const { niveau, level } = route.params;

  const [mazeGrid, setMazeGrid]         = useState<Cell[][]>([]);
  const [player, setPlayer]             = useState({ r: 0, c: 0 });
  const [end, setEnd]                   = useState({ r: 0, c: 0 });
  const [loading, setLoading]           = useState(true);
  const [won, setWon]                   = useState(false);
  const [timeLeft, setTimeLeft]         = useState(0);
  const [hasTimer, setHasTimer]         = useState(false);
  const [avatarIdx, setAvatarIdx]       = useState(0);
  const [optimalSteps, setOptimalSteps] = useState(0);

  const timerRef     = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepsRef     = useRef(0);
  const elapsedRef   = useRef(0);
  const wonRef       = useRef(false);
  const timeLimitRef = useRef(0);

  // Charger avatar
  useEffect(() => {
    AsyncStorage.getItem("user").then((d) => {
      if (d) {
        const u = JSON.parse(d);
        setAvatarIdx(typeof u.avatar === "number" ? u.avatar : 0);
      }
    });
  }, []);

  // Conversion grille 0/1 → murs
  const convertMaze = (maze: number[][]): Cell[][] => {
    const size = maze.length;
    return maze.map((row, r) =>
      row.map((_, c) => ({
        walls: {
          top:    r === 0        || maze[r - 1][c] === 1,
          bottom: r === size - 1 || maze[r + 1][c] === 1,
          left:   c === 0        || maze[r][c - 1] === 1,
          right:  c === size - 1 || maze[r][c + 1] === 1,
        },
      }))
    );
  };

  // Load maze
  const loadMaze = useCallback(async () => {
    try {
      setLoading(true);
      setWon(false);
      wonRef.current     = false;
      stepsRef.current   = 0;
      elapsedRef.current = 0;

      if (timerRef.current) clearInterval(timerRef.current);

      const res = await fetch(
        `${API_URL}/api/mazes/ai?niveau=${encodeURIComponent(niveau)}&level=${level}`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      if (!data.maze) throw new Error("No maze data");

      setMazeGrid(convertMaze(data.maze));
      setPlayer({ r: 0, c: 0 });
      setEnd({ r: data.size - 1, c: data.size - 1 });
      setHasTimer(data.hasTimer || false);
      setTimeLeft(data.timeLimit || 0);
      setOptimalSteps(data.optimalSteps || 0);
      timeLimitRef.current = data.timeLimit || 0;
    } catch (err) {
      console.error("loadMaze error:", err);
    } finally {
      setLoading(false);
    }
  }, [niveau, level]);

  useEffect(() => { loadMaze(); }, [loadMaze]);

  // Timer
  useEffect(() => {
    if (loading || !hasTimer) return;

    timerRef.current = setInterval(() => {
      if (wonRef.current) {
        clearInterval(timerRef.current!);
        return;
      }
      elapsedRef.current += 1;
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          navigation.replace("Fail", { niveau, level });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [loading, hasTimer, navigation, niveau, level]);

  // Move
  const move = (dx: number, dy: number) => {
    setPlayer((prev) => {
      const newR = prev.r + dy;
      const newC = prev.c + dx;

      if (!mazeGrid[newR] || mazeGrid[newR][newC] === undefined) return prev;

      const cell = mazeGrid[prev.r][prev.c];
      if (dx === 1  && cell.walls.right)  return prev;
      if (dx === -1 && cell.walls.left)   return prev;
      if (dy === 1  && cell.walls.bottom) return prev;
      if (dy === -1 && cell.walls.top)    return prev;

      stepsRef.current += 1;
      return { r: newR, c: newC };
    });
  };

  // Win check
  useEffect(() => {
    if (!mazeGrid.length || won) return;
    if (player.r !== end.r || player.c !== end.c) return;

    setWon(true);
    wonRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);

    const steps     = stepsRef.current;
    const elapsed   = elapsedRef.current;
    const timeLimit = timeLimitRef.current;

    const stepRatio = optimalSteps > 0 ? optimalSteps / Math.max(steps, 1) : 1;
    let score = Math.round(1000 * Math.min(stepRatio, 1));
    if (hasTimer && timeLimit > 0) {
      const timeBonus = Math.round(500 * (1 - elapsed / timeLimit));
      score += Math.max(timeBonus, 0);
      if (niveau === "Difficile")       score *= 2;
      else if (niveau === "Intermédiaire") score = Math.round(score * 1.5);
    }
    score = Math.max(score, 50);

    unlockLevel(niveau, level + 1);
    addScore(score);

    navigation.replace("Win", {
      niveau, level,
      time:  hasTimer ? elapsed : null,
      score,
    });
  }, [player, end, mazeGrid.length, won, navigation, niveau, level, hasTimer, optimalSteps]);

  const timerColor = () => {
    if (timeLeft > 30) return "#4CAF50";
    if (timeLeft > 15) return "#FF9800";
    return "#F44336";
  };

  if (loading || !mazeGrid.length) {
    return (
      <ImageBackground
        source={require("../assets/play.png")}
        style={styles.bg}
        resizeMode="cover"
      >
        {/* ✅ absoluteFill */}
        <View style={styles.overlay} />
        <View style={styles.center}>
          <Text style={styles.loadingEmoji}>🧩</Text>
          <Text style={styles.loadingText}>Génération du labyrinthe…</Text>
        </View>
      </ImageBackground>
    );
  }

  const cellSize = Math.min(Math.floor(320 / mazeGrid.length), 36);

  return (
    <ImageBackground
      source={require("../assets/play.png")}
      style={styles.bg}
      resizeMode="cover"
    >
      {/* ✅ absoluteFill */}
      <View style={styles.overlay} />

      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{niveau} — Level {level}</Text>
          <Text style={styles.steps}>👣 {stepsRef.current} pas</Text>
          {hasTimer && (
            <View style={[styles.timerBox, { borderColor: timerColor() }]}>
              <Text style={[styles.timerText, { color: timerColor() }]}>
                ⏱ {timeLeft}s
              </Text>
            </View>
          )}
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
  bg:          { flex: 1 },
  // ✅ absoluteFill
  overlay:     { ...StyleSheet.absoluteFill, backgroundColor: "rgba(255,255,255,0.22)" },
  container:   { flex: 1, alignItems: "center" },
  center:      { flex: 1, justifyContent: "center", alignItems: "center" },
  header:      { marginTop: 52, marginBottom: 12, alignItems: "center", gap: 6 },
  title:       { fontSize: 18, fontWeight: "900", color: "#333", letterSpacing: 0.5 },
  steps:       { fontSize: 13, color: "#666" },
  timerBox:    {
    borderWidth: 2, borderRadius: 20,
    paddingHorizontal: 18, paddingVertical: 5, marginTop: 4,
  },
  timerText:    { fontSize: 18, fontWeight: "800" },
  loadingEmoji: { fontSize: 52, marginBottom: 12 },
  loadingText:  { fontSize: 16, color: "#333", fontWeight: "700" },
});