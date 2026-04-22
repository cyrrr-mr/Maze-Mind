const generateMaze = require("./mazeGenerator");
const bfs = require("./pathfinding");
const getDifficulty = require("./difficultyManager");

function createMazeForPlayer(niveau, level) {
  const config = getDifficulty(niveau, level);
  const { size } = config;

  const maze = generateMaze(size);
  const solution = bfs(maze, [0, 0], [size - 1, size - 1]);
  const optimalSteps = solution ? solution.length - 1 : 0;

  return {
    ...config,
    maze,
    solution,
    optimalSteps,
    startPos: [0, 0],
    endPos: [size - 1, size - 1],
  };
}

module.exports = { createMazeForPlayer };