const generateMaze = require("./mazeGenerator");
const bfs = require("./pathfinding");
const getDifficulty = require("./difficultyManager");

function createMazeForPlayer(playerStats) {
  const { level, size } = getDifficulty(playerStats);

  const maze = generateMaze(size);

  const solution = bfs(maze, [0, 0], [size - 1, size - 1]);

  return {
    level,
    size,
    maze,
    solution
  };
}

module.exports = { createMazeForPlayer };