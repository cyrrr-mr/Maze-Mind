const bfs = require("./pathfinding");

function generateMaze(size, obstacleCount = 0) {
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

  // ✅ Génération du labyrinthe de base
  dfs(0, 0);

  // ✅ Start / End ouverts
  maze[0][0] = 0;
  maze[size - 1][size - 1] = 0;

  // ✅ Pas d'obstacles
  if (obstacleCount <= 0) {
    return maze;
  }

  // ✅ Trouver un chemin garanti AVANT obstacles
  const safePath = bfs(maze, [0, 0], [size - 1, size - 1]);

  // Si aucun chemin, on retourne le labyrinthe de base
  if (!safePath || safePath.length === 0) {
    return maze;
  }

  // ✅ Protéger le chemin principal
  const safeCells = new Set(
    safePath.map(([r, c]) => `${r},${c}`)
  );

  // ✅ Créer liste des cases où on peut placer des obstacles
  const candidates = [];

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const key = `${r},${c}`;

      if (
        maze[r][c] === 0 &&
        !safeCells.has(key) &&
        !(r === 0 && c === 0) &&
        !(r === size - 1 && c === size - 1)
      ) {
        candidates.push([r, c]);
      }
    }
  }

  // ✅ Mélanger les candidats
  const shuffledCandidates = shuffle(candidates);

  // ✅ Placer les obstacles sans bloquer le chemin sûr
  const count = Math.min(obstacleCount, shuffledCandidates.length);

  for (let i = 0; i < count; i++) {
    const [r, c] = shuffledCandidates[i];
    maze[r][c] = 2;
  }

  return maze;
}

module.exports = generateMaze;