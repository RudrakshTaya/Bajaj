const Leaderboard = require("../models/Leaderboard");

const getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await Leaderboard.find().sort({ totalScore: -1 }).limit(10);
        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

module.exports = { getLeaderboard };
