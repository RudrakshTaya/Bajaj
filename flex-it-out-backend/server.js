import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";

// Import Routes
import authRoutes from "./routes/authRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import emailChangeRoutes from "./routes/emailChangeRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import pricingRoutes from "./routes/pricingRoutes.js";

dotenv.config();
const app = express();

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/user", userRoutes);
app.use("/api/email", emailChangeRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/pricing", pricingRoutes);

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
