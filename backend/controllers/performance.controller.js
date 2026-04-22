const Performance = require("../models/performance.model");
const User = require("../models/user.model");

// ─── Calcul du score ──────────────────────────────────────────────────────────
function calculateScore(niveau, steps, optimalSteps, timeTaken, timeLimit) {
  let base = 1000;

  // Pénalité sur les pas (plus on dépasse l'optimal, moins de points)
  const stepRatio = optimalSteps > 0 ? optimalSteps / steps : 1;
  const stepScore = Math.round(base * Math.min(stepRatio, 1));

  if (niveau === "Facile") {
    // Juste basé sur les pas
    return Math.max(stepScore, 50);
  }

  // Bonus temps pour inter et difficile
  let timeBonus = 0;
  if (timeLimit > 0 && timeTaken < timeLimit) {
    const timeRatio = 1 - timeTaken / timeLimit;
    timeBonus = Math.round(500 * timeRatio);
  }

  const multiplier = niveau === "Difficile" ? 2 : 1.5;
  return Math.max(Math.round((stepScore + timeBonus) * multiplier), 50);
}

// ─── Vérifier et attribuer les medals ────────────────────────────────────────
async function checkAndAwardMedals(userId) {
  const user = await User.findById(userId);
  if (!user) return;

  const updates = {};

  // Medal débutant : Facile level 3 débloqué (progress Facile >= 4 = tous complétés)
  if (!user.medals.debutant && user.progress.get
    ? user.progress.get("Facile") > 3
    : user.progress["Facile"] > 3) {
    updates["medals.debutant"] = true;
  }

  // Medal avancé : Intermédiaire level 5 complété
  const interProgress = user.progress["Intermédiaire"] || user.progress.get?.("Intermédiaire") || 0;
  if (!user.medals.avance && interProgress > 5) {
    updates["medals.avance"] = true;
  }

  // Medal pro : Difficile level 5 complété
  const hardProgress = user.progress["Difficile"] || user.progress.get?.("Difficile") || 0;
  if (!user.medals.pro && hardProgress > 5) {
    updates["medals.pro"] = true;
  }

  if (Object.keys(updates).length > 0) {
    await User.findByIdAndUpdate(userId, { $set: updates });
  }
}

// ─── POST /api/performances ───────────────────────────────────────────────────
exports.createPerformance = async (req, res) => {
  try {
    const { niveau, level, steps, optimalSteps, timeTaken, timeLimit } = req.body;

    const score = calculateScore(niveau, steps, optimalSteps, timeTaken, timeLimit);

    const performance = new Performance({
      user: req.user.id,
      niveau,
      level,
      score,
      steps,
      optimalSteps,
      timeTaken,
      timeLimit,
      completed: true,
    });

    await performance.save();

    // Mise à jour du score total utilisateur
    const nextLevel = parseInt(level) + 1;
    const progressField = `progress.${niveau}`;
    const user = await User.findById(req.user.id);

    const currentProgress = user.progress[niveau] || 0;
    const updateData = { $inc: { totalScore: score } };

    // Débloquer le niveau suivant
    if (nextLevel > currentProgress) {
      // Pour Facile : max 4 (indique que tous les 3 niveaux sont faits)
      // Pour Inter/Difficile : max 6
      const maxProgress =
        niveau === "Facile" ? 4 : 6;
      if (nextLevel <= maxProgress) {
        updateData.$set = { [progressField]: nextLevel };
      }
    }

    // Débloquer Intermédiaire si Facile complété (progress Facile > 3)
    if (niveau === "Facile" && nextLevel > 3) {
      if (!updateData.$set) updateData.$set = {};
      if ((user.progress["Intermédiaire"] || 0) === 0) {
        updateData.$set["progress.Intermédiaire"] = 1;
      }
    }

    // Débloquer Difficile si Intermédiaire complété
    if (niveau === "Intermédiaire" && nextLevel > 5) {
      if (!updateData.$set) updateData.$set = {};
      if ((user.progress["Difficile"] || 0) === 0) {
        updateData.$set["progress.Difficile"] = 1;
      }
    }

    await User.findByIdAndUpdate(req.user.id, updateData);
    await checkAndAwardMedals(req.user.id);

    const updatedUser = await User.findById(req.user.id).select("-password");

    res.status(201).json({
      message: "Score enregistré",
      score,
      performance,
      user: updatedUser,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ─── GET /api/performances ────────────────────────────────────────────────────
exports.getPerformances = async (req, res) => {
  try {
    const performances = await Performance.find()
      .populate("user", "username avatar")
      .sort({ score: -1 })
      .limit(50);
    res.json(performances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── GET /api/performances/leaderboard/:niveau ───────────────────────────────
exports.getLeaderboard = async (req, res) => {
  try {
    const { niveau } = req.params;
    const leaderboard = await Performance.find({ niveau })
      .sort({ score: -1 })
      .limit(10)
      .populate("user", "username avatar");
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── GET /api/performances/my ─────────────────────────────────────────────────
exports.getMyPerformances = async (req, res) => {
  try {
    const performances = await Performance.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(performances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};