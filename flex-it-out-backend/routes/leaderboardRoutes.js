const express = require("express");
const { getLeaderboard } = require("../controllers/leaderboardController");

const router = express.Router();

// Get leaderboard rankings
router.get("/", getLeaderboard);

module.exports = router;