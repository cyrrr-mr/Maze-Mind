import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { generateMaze } from "../utiles/mazeGenerator";

export default function PlayScreen() {
  const rows = 10;
  const cols = 10;

  const [grid, setGrid] = useState<any[][]>([]);
  const [player, setPlayer] = useState({ r: 0, c: 0 });
  const [won, setWon] = useState(false);

  // INIT MAZE
  useEffect(() => {
    setGrid(generateMaze(rows, cols));
  }, []);

  // MOVE PLAYER
  const move = useCallback(
    (dir: "up" | "down" | "left" | "right") => {
      if (!grid.length || won) return;

      setPlayer((p) => {
        const cell = grid[p.r][p.c];

        let nr = p.r;
        let nc = p.c;

        if (dir === "up" && !cell.walls.top) nr--;
        if (dir === "down" && !cell.walls.bottom) nr++;
        if (dir === "left" && !cell.walls.left) nc--;
        if (dir === "right" && !cell.walls.right) nc++;

        return { r: nr, c: nc };
      });
    },
    [grid, won]
  );

  // WIN CHECK (FIXED)
  useEffect(() => {
    if (!grid.length || won) return;

    const end = { r: rows - 1, c: cols - 1 };

    if (player.r === end.r && player.c === end.c) {
      setWon(true);

      Alert.alert("🎉 Bravo", "You finished the maze!");

      setTimeout(() => {
        setGrid(generateMaze(rows, cols));
        setPlayer({ r: 0, c: 0 });
        setWon(false);
      }, 1200);
    }
  }, [player, grid, won]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Maze Game</Text>

      {/* MAZE */}
      <View style={styles.maze}>
        {grid.map((row, r) => (
          <View key={r} style={{ flexDirection: "row" }}>
            {row.map((cell, c) => {
              const isPlayer = player.r === r && player.c === c;
              const isEnd = r === rows - 1 && c === cols - 1;

              return (
                <View
                  key={c}
                  style={[
                    styles.cell,
                    {
                      backgroundColor: isPlayer
                        ? "#4CAF50"
                        : isEnd
                        ? "#FFD93D"
                        : "#fff",
                      borderTopWidth: cell.walls.top ? 2 : 0,
                      borderBottomWidth: cell.walls.bottom ? 2 : 0,
                      borderLeftWidth: cell.walls.left ? 2 : 0,
                      borderRightWidth: cell.walls.right ? 2 : 0,
                    },
                  ]}
                />
              );
            })}
          </View>
        ))}
      </View>

      {/* CONTROLS */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={() => move("up")} style={styles.btn}>
          <Text>⬆️</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={() => move("left")} style={styles.btn}>
            <Text>⬅️</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => move("down")} style={styles.btn}>
            <Text>⬇️</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => move("right")} style={styles.btn}>
            <Text>➡️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2", padding: 20 },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },

  maze: {
    alignSelf: "center",
    marginTop: 20,
  },

  cell: {
    width: 28,
    height: 28,
  },

  controls: {
    marginTop: 30,
    alignItems: "center",
  },

  btn: {
    backgroundColor: "#ddd",
    padding: 15,
    margin: 5,
    borderRadius: 10,
  },
});