const mongoose = require("mongoose");

const WorkoutSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Unique user identifier
  exerciseId: { type: String, required: true }, // Exercise ID (e.g., "squat")
  exerciseName: { type: String, required: true }, // Exercise name (e.g., "Squats")
  reps: { type: Number, required: true }, // Number of reps completed
  score: { type: Number, required: true }, // Score earned
  date: { type: Date, default: Date.now }, // Timestamp
});

module.exports = mongoose.model("Workout", WorkoutSchema);