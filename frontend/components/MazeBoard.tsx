import React from "react";
import { View, StyleSheet, Image } from "react-native";

// ✅ Type mis à jour pour inclure 'type'
type Cell = {
  type: number; // 0: chemin, 1: mur, 2: obstacle
  walls: { top: boolean; right: boolean; bottom: boolean; left: boolean };
};

type Props = {
  grid: Cell[][];
  player: { r: number; c: number };
  end: { r: number; c: number };
  cellSize: number;
  avatarIndex?: number;
};

const avatars = [
  require("../assets/avatar1.png"),
  require("../assets/avatar2.png"),
  require("../assets/avatar3.png"),
  require("../assets/avatar5.png"),
];

const WALL_COLOR      = "#6C63FF";
const PATH_COLOR      = "#FFF8F0";
const END_COLOR       = "#FFD93D";
const OBSTACLE_COLOR  = "#FF6B6B"; // ✅ Couleur Rouge pour les obstacles
const BORDER_RADIUS   = 3;
const WALL_THICKNESS  = 2;

export default function MazeBoard({ grid, player, end, cellSize, avatarIndex = 0 }: Props) {
  if (!grid || !grid.length) return null;

  return (
    <View style={[styles.mazeWrapper, { borderColor: WALL_COLOR, borderWidth: 3, borderRadius: 12, overflow: "hidden" }]}>
      {grid.map((row, r) => (
        <View key={r} style={styles.row}>
          {row.map((cell, c) => {
            const isPlayer = player.r === r && player.c === c;
            const isEnd    = end.r === r && end.c === c;

            // ✅ Logique de couleur dynamique
            let cellColor = PATH_COLOR;
            if (isEnd) {
              cellColor = END_COLOR;
            } else if (cell.type === 2) {
              cellColor = OBSTACLE_COLOR; // ✅ Affiche l'obstacle en rouge
            }

            return (
              <View
                key={c}
                style={[
                  styles.cell,
                  {
                    width: cellSize,
                    height: cellSize,
                    backgroundColor: cellColor,
                    borderTopWidth:    cell.walls.top    ? WALL_THICKNESS : 0,
                    borderRightWidth:  cell.walls.right  ? WALL_THICKNESS : 0,
                    borderBottomWidth: cell.walls.bottom ? WALL_THICKNESS : 0,
                    borderLeftWidth:   cell.walls.left   ? WALL_THICKNESS : 0,
                    borderColor: WALL_COLOR,
                  },
                ]}
              >
                {isPlayer && (
                  <Image
                    source={avatars[avatarIndex] || avatars[0]}
                    style={{
                      width: cellSize - 4,
                      height: cellSize - 4,
                      borderRadius: (cellSize - 4) / 2,
                    }}
                  />
                )}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  mazeWrapper: { alignSelf: "center" },
  row:         { flexDirection: "row" },
  cell: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: BORDER_RADIUS,
  },
});