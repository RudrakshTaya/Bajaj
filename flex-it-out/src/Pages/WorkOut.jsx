import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./WorkoutPage.css";

const WorkoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [exercises, setExercises] = useState([
    { id: "squat", name: "Squats", completed: false, reps: 0, score: 0 },
    { id: "pushup", name: "Push-ups", completed: false, reps: 0, score: 0 },
    { id: "highKnee", name: "High Knees", completed: false, reps: 0, score: 0 },
  ]);

  const [leaderboard, setLeaderboard] = useState([
    { name: "Alice", score: 150 },
    { name: "Bob", score: 120 },
    { name: "Charlie", score: 100 },
  ]);

  const [challenges, setChallenges] = useState([
    { name: "10 Squats", completed: false },
    { name: "5 Push-ups", completed: false },
    { name: "20 High Knees", completed: false },
  ]);

  const [workoutHistory, setWorkoutHistory] = useState([]); // State to store workout history

  // When returning from the PoseDetection page, update the corresponding exercise
  useEffect(() => {
    if (location.state && location.state.exerciseId) {
      const { exerciseId, reps, score } = location.state;
      setExercises((prevExercises) =>
        prevExercises.map((exercise) =>
          exercise.id === exerciseId
            ? { ...exercise, completed: true, reps, score }
            : exercise
        )
      );
      // Clear the location state so that reloading doesn't re-trigger the update
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, location.pathname, navigate]);

  // Fetch workout history from the backend
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/workouts/user123"); // Replace with actual user ID
        const data = await response.json();
        setWorkoutHistory(data); // Update workout history state
        console.log("Workouts fetched:", data);
      } catch (error) {
        console.error("Error fetching workouts:", error);
      }
    };

    fetchWorkouts();
  }, []);

  // Save completed workout to the backend
  const handleCompleteWorkout = async () => {
    const workoutData = exercises.map((exercise) => ({
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      reps: exercise.reps,
      score: exercise.score, // Use the score provided by the PoseDetection page
    }));

    const totalScore = workoutData.reduce((sum, exercise) => sum + exercise.score, 0);

    try {
      const response = await fetch("http://localhost:5001/api/workouts/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "user123", // Replace with actual user ID
          exercises: workoutData,
          totalScore,
        }),
      });

      if (response.ok) {
        console.log("Workout saved successfully!");
        alert("Workout completed and saved!");
      } else {
        console.error("Failed to save workout");
      }
    } catch (error) {
      console.error("Error saving workout:", error);
    }

    // Reset exercises state after saving
    setExercises((prevExercises) =>
      prevExercises.map((exercise) => ({
        ...exercise,
        completed: false,
        reps: 0,
        score: 0,
      }))
    );
  };

  return (
    <div className="workout-container">
      <header className="workout-header">
        <h1>Workout Overview 🏋️</h1>
      </header>

      <div className="exercises-list">
        <h2>Exercises</h2>
        {exercises.map((exercise) => (
          <div key={exercise.id} className="exercise">
            <span>{exercise.name}</span>
            {exercise.completed ? (
              <span>
                ✅ {exercise.reps} reps (Score: {exercise.score})
              </span>
            ) : (
              <Link to={`/pose-detection/${exercise.id}`}>
                <button className="start-button">Start</button>
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className="leaderboard">
        <h2>🏆 Leaderboard</h2>
        {leaderboard.map((entry, index) => (
          <div key={index} className="leaderboard-entry">
            <span>{entry.name}</span>
            <span>{entry.score} pts</span>
          </div>
        ))}
      </div>

      <div className="challenges">
        <h2>🎯 Challenges</h2>
        {challenges.map((challenge, index) => (
          <div key={index} className="challenge">
            <span>{challenge.name}</span>
            {challenge.completed ? (
              <span>✅ Completed</span>
            ) : (
              <button
                className="challenge-button"
                onClick={() => {
                  const newChallenges = [...challenges];
                  newChallenges[index].completed = true;
                  setChallenges(newChallenges);
                }}
              >
                Complete
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="workout-history">
        <h2>📅 Workout History</h2>
        {workoutHistory.length > 0 ? (
          workoutHistory.map((workout, index) => (
            <div key={index} className="workout-entry">
              <h3>{new Date(workout.date).toLocaleDateString()}</h3>
              <p>Total Score: {workout.totalScore} pts</p>
              <ul>
                {workout.exercises.map((exercise, i) => (
                  <li key={i}>
                    {exercise.exerciseName}: {exercise.reps} reps ({exercise.score} pts)
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p>No workout history found.</p>
        )}
      </div>

      <button className="complete-workout-button" onClick={handleCompleteWorkout}>
        Complete Workout
      </button>
    </div>
  );
};

export default WorkoutPage;
