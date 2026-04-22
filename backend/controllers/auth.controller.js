const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "mazemind_secret_2024";

// ─── REGISTER ─────────────────────────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const { username, email, password, avatar } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Nom d'utilisateur ou email déjà utilisé" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      avatar: avatar || 0,
      totalScore: 0,
      medals: { debutant: false, avance: false, pro: false },
      progress: { Facile: 1, "Intermédiaire": 0, Difficile: 0 },
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      message: "Compte créé avec succès",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        totalScore: user.totalScore,
        medals: user.medals,
        progress: user.progress,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Champs requis" });
    }

    const user = await User.findOne({
      $or: [{ username }, { email: username }],
    });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        totalScore: user.totalScore,
        medals: user.medals,
        progress: user.progress,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── GET PROFILE ──────────────────────────────────────────────────────────────
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── UPDATE AVATAR ────────────────────────────────────────────────────────────
exports.updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};