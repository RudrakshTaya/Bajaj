const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const activityRoutes = require("./routes/activityRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const userRoutes = require("./routes/userRoutes");
const emailChangeRoutes = require("./routes/emailChangeRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const pricingRoutes = require("./routes/pricingRoutes");
const checkoutRoutes = require("./routes/createCheckoutSession"); 

dotenv.config();
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
// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/user", userRoutes);
app.use("/api/email", emailChangeRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/checkout", checkoutRoutes); 

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
