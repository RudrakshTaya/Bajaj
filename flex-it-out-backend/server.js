const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http"); // Needed for Socket.io
const { Server } = require("socket.io");

dotenv.config();
const app = express();
const server = http.createServer(app); // Create HTTP server for Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
});

// ✅ Import Routes (Removing Duplicates)
const authRoutes = require("./routes/authRoutes");
const activityRoutes = require("./routes/activityRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const userRoutes = require("./routes/userRoutes");
const emailChangeRoutes = require("./routes/emailChangeRoutes");
const pricingRoutes = require("./routes/pricingRoutes");
const checkoutRoutes = require("./routes/createCheckoutSession");
const workoutRoutes = require("./routes/workoutRoutes");
const mealRoutes = require("./routes/fetchmealsRouter");
const videoRoutes = require("./routes/videoRoutes");
const groupRoutes = require("./routes/groupRoutes"); // Ensure this file exists

// ✅ Middleware
app.use(cors());
app.use(express.json()); // Built-in JSON parsing middleware

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/user", userRoutes);
app.use("/api/email", emailChangeRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/video", videoRoutes);
app.use("/api/group", groupRoutes);

// ✅ Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("❌ Unhandled Error:", err);
  res.status(500).json({ error: "Something went wrong!" });
});

// ✅ MongoDB Connection without deprecated options
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout for server selection
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1); // Exit if MongoDB connection fails
  });

// ✅ Socket.io - Real-Time Chat
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinGroup", (groupId) => {
    socket.join(groupId);
    console.log(`User joined group: ${groupId}`);
  });

  socket.on("sendMessage", async ({ groupId, senderId, text }) => {
    io.to(groupId).emit("newMessage", { sender: senderId, text });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
