function generateMaze(size, obstacleCount = 0) {
  function createBaseMaze() {
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
    maze[0][0] = 0;
    maze[size - 1][size - 1] = 0;

    return maze;
  }

  let maze = createBaseMaze();

  if (obstacleCount > 0) {
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      const tempMaze = JSON.parse(JSON.stringify(maze));
      let added = 0;

      while (added < obstacleCount) {
        const r = Math.floor(Math.random() * size);
        const c = Math.floor(Math.random() * size);

        if (
          tempMaze[r][c] === 0 &&
          !(r === 0 && c === 0) &&
          !(r === size - 1 && c === size - 1)
        ) {
          tempMaze[r][c] = 2;
          added++;
        }
      }

      const bfs = require("./pathfinding");
      const solution = bfs(tempMaze, [0, 0], [size - 1, size - 1]);

      if (solution.length > 0) {
        maze = tempMaze;
        break;
      }

      attempts++;
    }
  }

  return maze;
}

module.exports = generateMaze;