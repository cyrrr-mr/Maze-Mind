import React from "react";
import { View, StyleSheet, Image } from "react-native";

type Cell = {
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

            return (
              <View
                key={c}
                style={[
                  styles.cell,
                  {
                    width: cellSize,
                    height: cellSize,
                    backgroundColor: isEnd ? END_COLOR : PATH_COLOR,
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
                {isEnd && !isPlayer && (
                  <View style={styles.endFlag}>
                  </View>
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
  endFlag: {
    width: 12, height: 12,
    borderRadius: 6,
    backgroundColor: "#FF6B6B",
  },
});