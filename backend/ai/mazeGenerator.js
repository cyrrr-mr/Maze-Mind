function generateMaze(size) {
  const maze = Array(size).fill().map(() => Array(size).fill(1));

  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  function dfs(x, y) {
    maze[x][y] = 0;

    const directions = shuffle([
      [0, 2], [0, -2], [2, 0], [-2, 0]
    ]);

    for (let [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (
        nx >= 0 && ny >= 0 &&
        nx < size && ny < size &&
        maze[nx][ny] === 1
      ) {
        maze[x + dx / 2][y + dy / 2] = 0;
        dfs(nx, ny);
      }
    }
  }

  dfs(0, 0);
  return maze;
}

module.exports = generateMaze;