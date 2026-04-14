const Maze = require("../models/maze.model");
const { createMazeForPlayer } = require("../ai/aiService"); // 🔥 AI

// 🔹 Créer un labyrinthe (manuel / admin)
exports.createMaze = async (req, res) => {
  try {
    const { name, difficulty, layout } = req.body;

    const maze = new Maze({
      name,
      difficulty,
      layout,
      createdBy: req.user.id
    });

    await maze.save();

    res.status(201).json({
      message: "Maze created successfully",
      maze
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 🔹 Récupérer tous les labyrinthes
exports.getAllMazes = async (req, res) => {
  try {
    const mazes = await Maze.find();
    res.json(mazes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Récupérer un labyrinthe par ID
exports.getMazeById = async (req, res) => {
  try {
    const { id } = req.params;
    const maze = await Maze.findById(id);

    if (!maze) {
      return res.status(404).json({ message: "Maze not found" });
    }

    res.json(maze);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🤖 🔥 NOUVELLE PARTIE AI
exports.getAIMaze = async (req, res) => {
  try {
    // ⚠️ plus tard tu prendras les vraies stats depuis DB
    const playerStats = {
      score: 60,
      time: 40,
      errors: 2
    };

    const result = createMazeForPlayer(playerStats);

    res.json({
      message: "AI Maze generated",
      ...result
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};