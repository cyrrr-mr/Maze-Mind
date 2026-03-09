// routes/performance.routes.js
const express = require('express');
const router = express.Router();

// ✅ Ici on met le bon chemin vers le middleware
const auth = require('../middlewares/auth.middleware'); // <-- ajouter le "s" à "middlewares"

const {
  createPerformance,
  getPerformances,
  getLeaderboard
} = require('../controllers/performance.controller');

// POST /api/performances -> enregistrer un score (auth requis)
router.post('/', auth, createPerformance);

// GET /api/performances -> tous les scores (public)
router.get('/', getPerformances);

// GET /api/performances/leaderboard/:mazeId -> top 10 scores d'un labyrinthe (public)
router.get('/leaderboard/:mazeId', getLeaderboard);

module.exports = router;