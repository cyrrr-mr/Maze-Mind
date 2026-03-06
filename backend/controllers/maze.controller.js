const Maze = require("../models/maze.model"); // require en dehors des fonctions

exports.createMaze = async (req, res) => {
  try {
    const { name, difficulty, layout } = req.body;

    const maze = new Maze({
      name,
      difficulty,
      layout,
      createdBy: req.user.id // Assure-toi que authMiddleware ajoute req.user
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

exports.getAllMazes = async (req, res) => {
  try {
    const mazes = await Maze.find();
    res.json(mazes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// controllers/maze.controller.js

// Récupérer un labyrinthe par son ID
exports.getMazeById = async (req, res) => {
  try {
    const { id } = req.params; // récupère l'ID depuis l'URL
    const maze = await Maze.findById(id);

    if (!maze) {
      return res.status(404).json({ message: "Maze not found" });
    }

    res.json(maze);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};