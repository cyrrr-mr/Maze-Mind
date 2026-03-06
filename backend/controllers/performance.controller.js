// controllers/performance.controller.js
const Performance = require('../models/performance.model');

// ⚡ Pour tester sans auth, on met un user fixe
const TEST_USER_ID = "69ab39256155943f7c44d22d"; // remplace par ton vrai ID utilisateur

exports.createPerformance = async (req, res) => {
  try {
    const { maze, score, time } = req.body;

    const performance = new Performance({
      user: TEST_USER_ID,
      maze,
      score,
      time
    });

    await performance.save();
    res.status(201).json({ message: "Score recorded successfully", performance });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getPerformances = async (req, res) => {
  try {
    const performances = await Performance.find()
      .populate('user', 'username')
      .populate('maze', 'name difficulty');
    res.json(performances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Leaderboard par labyrinthe
exports.getLeaderboard = async (req, res) => {
  try {
    const { mazeId } = req.params;
    const leaderboard = await Performance.find({ maze: mazeId })
      .sort({ score: -1 }) // du meilleur score au plus faible
      .limit(10)
      .populate('user', 'username');
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};