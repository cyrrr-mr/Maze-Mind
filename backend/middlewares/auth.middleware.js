const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, "secretkey"); // <-- ici
    req.user = decoded; // req.user.id disponible pour le controller
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};