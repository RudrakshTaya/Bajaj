// routes/leaderboard.js
const express = require("express");
const Leaderboard = require("../models/Leaderboard");
const router = express.Router();

// Get the leaderboard sorted by score (descending)
router.get("/", async (req, res) => {
  try {
    const leaderboard = await Leaderboard.find()
      .sort({ score: -1 })
      .limit(10)  // Adjust number of results (top 10 users)
      .populate("userId", "name")  // Get the user's username from User model
      .exec();
    res.json(leaderboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch leaderboard." });
  }
});

// Post a new score to the leaderboard
router.post("/", async (req, res) => {
  const { userId, score } = req.body;

  try {
    const newScore = new Leaderboard({ userId, score });
    await newScore.save();
    res.status(201).json(newScore);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to post score." });
  }
});

module.exports = router;
