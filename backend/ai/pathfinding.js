function bfs(maze, start, end) {
  const queue = [[start, [start]]];
  const visited = new Set();

  while (queue.length > 0) {
    const [current, path] = queue.shift();
    const [x, y] = current;

    if (x === end[0] && y === end[1]) {
      return path;
    }

    const key = `${x},${y}`;
    if (visited.has(key)) continue;
    visited.add(key);

    const directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (
        nx >= 0 &&
        ny >= 0 &&
        nx < maze.length &&
        ny < maze[0].length &&
        maze[nx][ny] === 0
      ) {
        queue.push([[nx, ny], [...path, [nx, ny]]]);
      }
    }
  }

  return [];
}

module.exports = bfs;