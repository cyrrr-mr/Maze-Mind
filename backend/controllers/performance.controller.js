const Performance = require("../models/performance.model");
const User = require("../models/user.model");

// ─── Calcul du score ──────────────────────────────────────────────────────────
function calculateScore(niveau, steps, optimalSteps, timeTaken, timeLimit) {
  let base = 1000;

  const stepRatio = optimalSteps > 0 ? optimalSteps / steps : 1;
  const stepScore = Math.round(base * Math.min(stepRatio, 1));

  if (niveau === "Facile") {
    return Math.max(stepScore, 50);
  }

  let timeBonus = 0;
  if (timeLimit > 0 && timeTaken < timeLimit) {
    const timeRatio = 1 - timeTaken / timeLimit;
    timeBonus = Math.round(500 * timeRatio);
  }

  const multiplier = niveau === "Difficile" ? 2 : 1.5;
  return Math.max(Math.round((stepScore + timeBonus) * multiplier), 50);
}

// ─── Vérifier et attribuer les médailles ──────────────────────────────────────
async function checkAndAwardMedals(userId) {
  const user = await User.findById(userId);
  if (!user) return { unlocked: null };

  const facileCompleted = (user.progress["Facile"] || 0) >= 4;
  const interCompleted = (user.progress["Intermédiaire"] || 0) >= 6;
  const hardCompleted = (user.progress["Difficile"] || 0) >= 6;

  let unlocked = null;

  // ✅ Débutant = finir Facile
  if (!user.medals.debutant && facileCompleted) {
    user.medals.debutant = true;
    unlocked = "Débutant";
  }

  // ✅ Avancé = finir Intermédiaire
  if (!user.medals.avance && interCompleted) {
    user.medals.avance = true;
    unlocked = "Avancé";
  }

  // ✅ Pro = finir Difficile UNIQUEMENT
  if (!user.medals.pro && hardCompleted) {
    user.medals.pro = true;
    unlocked = "Pro";
  }

  if (unlocked) {
    await user.save();
  }

  return { unlocked };
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

    const nextLevel = parseInt(level) + 1;
    const progressField = `progress.${niveau}`;

    const user = await User.findById(req.user.id);
    const currentProgress = user.progress[niveau] || 0;

    const updateData = { $inc: { totalScore: score } };

    // Débloquer niveau suivant
    if (nextLevel > currentProgress) {
      const maxProgress = niveau === "Facile" ? 4 : 6;
      if (nextLevel <= maxProgress) {
        updateData.$set = { [progressField]: nextLevel };
      }
    }

    // Débloquer Intermédiaire si Facile terminé
    if (niveau === "Facile" && nextLevel > 3) {
      if (!updateData.$set) updateData.$set = {};
      if ((user.progress["Intermédiaire"] || 0) === 0) {
        updateData.$set["progress.Intermédiaire"] = 1;
      }
    }

    // Débloquer Difficile si Intermédiaire terminé
    if (niveau === "Intermédiaire" && nextLevel > 5) {
      if (!updateData.$set) updateData.$set = {};
      if ((user.progress["Difficile"] || 0) === 0) {
        updateData.$set["progress.Difficile"] = 1;
      }
    }

    await User.findByIdAndUpdate(req.user.id, updateData);

    // ✅ Vérifier médailles APRÈS mise à jour
    const { unlocked } = await checkAndAwardMedals(req.user.id);

    const updatedUser = await User.findById(req.user.id).select("-password");

    res.status(201).json({
      message: "Score enregistré",
      score,
      newMedalUnlocked: unlocked,
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