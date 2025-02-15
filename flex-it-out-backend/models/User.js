const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "" }, // Profile picture
    score: { type: Number, default: 0 }, // User score for leaderboard
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
