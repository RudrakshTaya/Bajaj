const mongoose = require("mongoose");

const LeaderboardSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true },
    totalScore: { type: Number, default: 0 }, // Total score based on activities
    lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Leaderboard", LeaderboardSchema);
