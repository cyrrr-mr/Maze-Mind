// controllers/performance.controller.js
const Performance = require('../models/performance.model');

// 🔹 Créer une performance (score) — JWT requis
exports.createPerformance = async (req, res) => {
  try {
    const { maze, score, time } = req.body;

    // req.user.id est injecté par le middleware auth
    const performance = new Performance({
      user: req.user.id,
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

// 🔹 Récupérer toutes les performances
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

// 🔹 Leaderboard par labyrinthe
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