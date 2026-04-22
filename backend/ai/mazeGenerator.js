function generateMaze(size) {
  // Grille initialisée à 1 (murs)
  const maze = Array(size)
    .fill(null)
    .map(() => Array(size).fill(1));

  function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function dfs(x, y) {
    maze[x][y] = 0;
    const directions = shuffle([
      [0, 2],
      [0, -2],
      [2, 0],
      [-2, 0],
    ]);

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      if (
        nx >= 0 &&
        ny >= 0 &&
        nx < size &&
        ny < size &&
        maze[nx][ny] === 1
      ) {
        maze[x + dx / 2][y + dy / 2] = 0;
        dfs(nx, ny);
      }
    }
  }

  dfs(0, 0);

  // S'assurer que start et end sont ouverts
  maze[0][0] = 0;
  maze[size - 1][size - 1] = 0;

  return maze;
}

module.exports = generateMaze;