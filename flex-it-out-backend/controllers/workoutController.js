const Workout = require("../models/workout");

// Save a completed workout
exports.saveWorkout = async (req, res) => {
  const { userId, exerciseId, exerciseName, reps, score } = req.body;

  try {
    const newWorkout = new Workout({
      userId,
      exerciseId,
      exerciseName,
      reps,
      score,
    });

    await newWorkout.save();
    res.status(201).json({ message: "Workout saved successfully!", workout: newWorkout });
  } catch (error) {
    res.status(500).json({ message: "Error saving workout", error });
  }
};

// Get all workouts for a user
exports.getWorkouts = async (req, res) => {
  const { userId } = req.params;

  try {
    const workouts = await Workout.find({ userId });
    res.status(200).json(workouts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching workouts", error });
  }
};