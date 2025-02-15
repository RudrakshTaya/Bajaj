require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("./config/db");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/activity", require("./routes/activityRoutes"));
app.use("/api/leaderboard", require("./routes/leaderboardRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
