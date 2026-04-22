const express = require("express");
const router = express.Router();
const { createMaze, getAllMazes, getMazeById, getAIMaze } =
  require("../controllers/maze.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/ai", getAIMaze);
router.post("/", authMiddleware, createMaze);
router.get("/", getAllMazes);
router.get("/:id", getMazeById);

module.exports = router;