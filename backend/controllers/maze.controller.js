// ✅ Correction du chemin vers aiService.js
const { createMazeForPlayer } = require("../ai/aiService");

// Nombre de niveaux par difficulté (cf. cahier des charges 8.1)
const LEVELS_PER_NIVEAU = { Facile: 3, "Intermédiaire": 5, Difficile: 5 };

function isValidNiveauLevel(niveau, lvl) {
  const max = LEVELS_PER_NIVEAU[niveau];
  return typeof max === "number" && Number.isInteger(lvl) && lvl >= 1 && lvl <= max;
}

// 🤖 GET /api/mazes/ai?niveau=Facile&level=1
exports.getAIMaze = async (req, res) => {
  try {
    const { niveau = "Facile", level = "1" } = req.query;
    const lvl = parseInt(level, 10) || 1;

    if (!isValidNiveauLevel(niveau, lvl)) {
      return res.status(400).json({
        error: `Niveau/level invalide : ${niveau} ${lvl}. Niveaux disponibles : Facile(1-3), Intermédiaire(1-5), Difficile(1-5).`,
      });
    }

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

    if (!isValidNiveauLevel(niveau, lvl)) {
      return res.status(400).json({
        error: `Niveau/level invalide : ${niveau} ${lvl}.`,
      });
    }

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