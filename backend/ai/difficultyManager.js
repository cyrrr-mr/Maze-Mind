function getDifficulty(stats) {
  const { score, time, errors } = stats;

  if (score > 80 && time < 30 && errors < 3) {
    return { level: "hard", size: 15 };
  }

  if (score < 40 || errors > 5) {
    return { level: "easy", size: 7 };
  }

  return { level: "medium", size: 11 };
}

module.exports = getDifficulty;