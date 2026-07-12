const generateMaze = require("./mazeGenerator");
const bfs = require("./pathfinding");
const getDifficulty = require("./difficultyManager");

// ─── Placement intelligent des obstacles (cf. rapport 7.4) ───────────────────
// Protège toutes les cellules du chemin optimal (BFS), puis place aléatoirement
// des obstacles sur les cellules restantes praticables (jamais sur le chemin,
// jamais sur le départ/l'arrivée) afin de garantir la solvabilité.
function placeObstacles(maze, solution, obstacleCount, startPos, endPos) {
  if (!obstacleCount || obstacleCount <= 0) return [];

  const protectedCells = new Set(
    (solution || []).map(([x, y]) => `${x},${y}`)
  );
  protectedCells.add(`${startPos[0]},${startPos[1]}`);
  protectedCells.add(`${endPos[0]},${endPos[1]}`);

  const candidates = [];
  for (let x = 0; x < maze.length; x++) {
    for (let y = 0; y < maze[x].length; y++) {
      if (maze[x][y] === 0 && !protectedCells.has(`${x},${y}`)) {
        candidates.push([x, y]);
      }
    }
  }

  // Mélange (Fisher-Yates) puis sélection du nombre d'obstacles demandé
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }

  return candidates.slice(0, Math.min(obstacleCount, candidates.length));
}

function createMazeForPlayer(niveau, level) {
  const config = getDifficulty(niveau, level);
  const { size } = config;

  const maze = generateMaze(size);
  const startPos = [0, 0];
  const endPos = [size - 1, size - 1];
  const solution = bfs(maze, startPos, endPos);
  const optimalSteps = solution ? solution.length - 1 : 0;

  const obstacles = config.obstacles
    ? placeObstacles(maze, solution, config.obstacleCount, startPos, endPos)
    : [];

  return {
    ...config,
    maze,
    solution,
    optimalSteps,
    obstacles,
    startPos,
    endPos,
  };
}

module.exports = { createMazeForPlayer };