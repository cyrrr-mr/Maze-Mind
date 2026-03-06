const jwt = require("jsonwebtoken");

// Middleware pour vérifier le token
module.exports = function (req, res, next) {
  // Récupère le token depuis les headers
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  // Le token peut être sous forme "Bearer <token>"
  const token = authHeader.split(" ")[1] || authHeader;

  try {
    const decoded = jwt.verify(token, "secretkey"); // "secretkey" doit être dans .env plus tard
    req.user = decoded; // On stocke les infos du user pour l'utiliser dans le controller
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};