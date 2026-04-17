import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function MazeBoard({ grid, player, end, cellSize }: any) {
  return (
    <View
      style={{
        width: grid[0].length * cellSize,
        height: grid.length * cellSize,
        position: "relative",
        backgroundColor: "#fff9f6",
      }}
    >
      {grid.map((row: any, r: number) =>
        row.map((cell: any, c: number) => {
          const x = c * cellSize;
          const y = r * cellSize;

          const isPlayer = player.r === r && player.c === c;
          const isEnd = end.r === r && end.c === c;

          return (
            <View key={`${r}-${c}`}>

              {cell.walls.top && (
                <View style={[styles.wall, { top: y, left: x, width: cellSize, height: 2 }]} />
              )}
              {cell.walls.right && (
                <View style={[styles.wall, { top: y, left: x + cellSize, width: 2, height: cellSize }]} />
              )}
              {cell.walls.bottom && (
                <View style={[styles.wall, { top: y + cellSize, left: x, width: cellSize, height: 2 }]} />
              )}
              {cell.walls.left && (
                <View style={[styles.wall, { top: y, left: x, width: 2, height: cellSize }]} />
              )}

              {isEnd && (
                <View style={[styles.cell, { top: y, left: x }]}>
                  <Text>🏁</Text>
                </View>
              )}

              {isPlayer && (
                <View style={[styles.cell, { top: y, left: x }]}>
                  <Text>😊</Text>
                </View>
              )}

            </View>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wall: {
    position: "absolute",
    backgroundColor: "#b0a090",
  },
  cell: {
    position: "absolute",
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});