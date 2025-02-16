require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("./config/db");

const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"]
}));


// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/activity", require("./routes/activityRoutes"));
app.use("/api/leaderboard", require("./routes/leaderboardRoutes"));
app.use("/api/user",require("./routes/userRoutes"))
app.use("/api/email", require("./routes/emailchangeRoutes"))
app.use("/api/meals", require('./routes/fetchmealsRouter'))



const workoutRoutes = require("./routes/workoutRoutes");
app.use("/api/workouts", workoutRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
