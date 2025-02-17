const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const http = require("http"); // Needed for Socket.io
const { Server } = require("socket.io");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const activityRoutes = require("./routes/activityRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const userRoutes = require("./routes/userRoutes");
const emailChangeRoutes = require("./routes/emailChangeRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const pricingRoutes = require("./routes/pricingRoutes");
const checkoutRoutes = require("./routes/createCheckoutSession"); 
const workoutRoutes= require("./routes/workoutRoutes");
const mealRoutes = require("./routes/fetchmealsRouter");
const videoRoutes = require("./routes/videoRoutes");
const groupRoutes = require("./routes/groupRoutes");

dotenv.config();
const app = express();
const server = http.createServer(app); // Create HTTP server for Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
});

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
app.use("/api/workouts", workoutRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/video", videoRoutes);
app.use("/api/group", groupRoutes);

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
