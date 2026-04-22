// ✅ Correction du chemin vers aiService.js
const { createMazeForPlayer } = require("../ai/aiService");

// 🤖 GET /api/mazes/ai?niveau=Facile&level=1
exports.getAIMaze = async (req, res) => {
  try {
    const { niveau = "Facile", level = "1" } = req.query;
    const lvl = parseInt(level, 10) || 1;

    const mazeData = createMazeForPlayer(niveau, lvl);

    res.status(200).json(mazeData);
  } catch (error) {
    console.error("getAIMaze error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ POST /api/mazes (compatibilité)
exports.createMaze = async (req, res) => {
  try {
    const { niveau = "Facile", level = 1 } = req.body;
    const lvl = parseInt(level, 10) || 1;

    const mazeData = createMazeForPlayer(niveau, lvl);

    res.status(201).json(mazeData);
  } catch (error) {
    console.error("createMaze error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ GET all (info message)
exports.getAllMazes = (req, res) => {
  res.status(200).json({
    message: "Use /api/mazes/ai for AI-generated mazes"
  });
};

// ✅ GET by ID (info message)
exports.getMazeById = (req, res) => {
  res.status(200).json({
    message: "Use /api/mazes/ai for AI-generated mazes"
  });
};