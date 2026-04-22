const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const {
  createPerformance,
  getPerformances,
  getLeaderboard,
  getMyPerformances,
} = require("../controllers/performance.controller");

router.post("/", auth, createPerformance);
router.get("/", getPerformances);
router.get("/my", auth, getMyPerformances);
router.get("/leaderboard/:niveau", getLeaderboard);

module.exports = router;