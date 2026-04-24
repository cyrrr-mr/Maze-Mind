function getDifficulty(niveau, level) {
  // Niveau FACILE — 3 levels, pas de timer, pas d'obstacles
  if (niveau === "Facile") {
    const sizes = { 1: 7, 2: 9, 3: 11 };
    return {
      level: "easy",
      size: sizes[level] || 7,
      hasTimer: false,
      timeLimit: 0,
      obstacles: false,
      obstacleCount: 0,
    };
  }

  // Niveau INTERMÉDIAIRE — 5 levels, timer + obstacles modérés
  if (niveau === "Intermédiaire") {
  const sizes = { 1: 11, 2: 13, 3: 13, 4: 15, 5: 15 };
  const times = { 1: 120, 2: 100, 3: 90, 4: 80, 5: 70 };
  return {
    level: "medium",
    size: sizes[level] || 11,
    hasTimer: true,
    timeLimit: times[level] || 90,
    obstacles: false,      // ✅ plus d'obstacles
    obstacleCount: 0,
  };
}

  // Niveau DIFFICILE — 5 levels, timer serré + beaucoup d'obstacles
 // Niveau DIFFICILE — toujours beaucoup d'obstacles
if (niveau === "Difficile") {
  const sizes = { 1: 15, 2: 17, 3: 17, 4: 19, 5: 21 };
  const times = { 1: 60, 2: 55, 3: 50, 4: 45, 5: 40 };

  const baseObstacles = 15; // ✅ minimum garanti
  const extraObstacles = level * 5;

  return {
    level: "hard",
    size: sizes[level] || 15,
    hasTimer: true,
    timeLimit: times[level] || 50,
    obstacles: true,
    obstacleCount: baseObstacles + extraObstacles,
  };
}
  // Fallback
  return {
    level: "easy",
    size: 7,
    hasTimer: false,
    timeLimit: 0,
    obstacles: false,
    obstacleCount: 0,
  };
}

module.exports = getDifficulty;