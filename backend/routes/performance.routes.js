// routes/performance.routes.js
const express = require('express');
const router = express.Router();
const {
  createPerformance,
  getPerformances,
  getLeaderboard
} = require('../controllers/performance.controller');

// Routes Performance

// POST /api/performance -> enregistrer un score
router.post('/', createPerformance);

// GET /api/performance -> tous les scores
router.get('/', getPerformances);

// GET /api/performance/leaderboard/:mazeId -> top 10 scores d'un labyrinthe
router.get('/leaderboard/:mazeId', getLeaderboard);

module.exports = router;