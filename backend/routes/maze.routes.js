const express = require('express');
const router = express.Router();

const { 
  createMaze, 
  getAllMazes, 
  getMazeById,
  getAIMaze // 🔥 AJOUT
} = require('../controllers/maze.controller');

const authMiddleware = require('../middlewares/auth.middleware');

// POST /api/mazes -> créer un labyrinthe
router.post('/', authMiddleware, createMaze);

// GET /api/mazes -> récupérer tous les labyrinthes
router.get('/', getAllMazes);

// 🤖 GET /api/mazes/ai -> labyrinthe généré par AI
router.get('/ai', getAIMaze); // 🔥 AJOUT IMPORTANT

// GET /api/mazes/:id -> récupérer un labyrinthe par son ID
router.get('/:id', getMazeById);

module.exports = router;