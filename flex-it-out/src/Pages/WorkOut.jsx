import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { FaDumbbell, FaTrophy, FaChartLine, FaHistory } from "react-icons/fa";
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

  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("exercises");

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
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, location.pathname, navigate]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/workouts/user123");
        const data = await response.json();
        setWorkoutHistory(data);
      } catch (error) {
        console.error("Error fetching workouts:", error);
      }
    };

    fetchWorkouts();
  }, []);

  const handleCompleteWorkout = async () => {
    const workoutData = exercises.map((exercise) => ({
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      reps: exercise.reps,
      score: exercise.score,
    }));

    const totalScore = workoutData.reduce((sum, exercise) => sum + exercise.score, 0);

    try {
      const response = await fetch("http://localhost:5001/api/workouts/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "user123",
          exercises: workoutData,
          totalScore,
        }),
      });

      if (response.ok) {
        alert("Workout completed and saved!");
        setExercises((prevExercises) =>
          prevExercises.map((exercise) => ({
            ...exercise,
            completed: false,
            reps: 0,
            score: 0,
          }))
        );
      } else {
        console.error("Failed to save workout");
      }
    } catch (error) {
      console.error("Error saving workout:", error);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "exercises":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="exercises-list"
          >
            <h2><FaDumbbell /> Exercises</h2>
            {exercises.map((exercise) => (
              <div key={exercise.id} className="exercise-card">
                <h3>{exercise.name}</h3>
                {exercise.completed ? (
                  <div className="exercise-result">
                    <span>✅ {exercise.reps} reps</span>
                    <span>Score: {exercise.score}</span>
                  </div>
                ) : (
                  <Link to={`/pose-detection/${exercise.id}`}>
                    <button className="start-button">Start</button>
                  </Link>
                )}
              </div>
            ))}
          </motion.div>
        );
      case "leaderboard":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="leaderboard"
          >
            <h2><FaTrophy /> Leaderboard</h2>
            {leaderboard.map((entry, index) => (
              <div key={index} className="leaderboard-entry">
                <span>{entry.name}</span>
                <span>{entry.score} pts</span>
              </div>
            ))}
          </motion.div>
        );
      case "challenges":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="challenges"
          >
            <h2><FaChartLine /> Challenges</h2>
            {challenges.map((challenge, index) => (
              <div key={index} className="challenge-card">
                <span>{challenge.name}</span>
                {challenge.completed ? (
                  <span className="completed">✅ Completed</span>
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
          </motion.div>
        );
      case "history":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="workout-history"
          >
            <h2><FaHistory /> Workout History</h2>
            {workoutHistory.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={workoutHistory}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="totalScore" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
                {workoutHistory.map((workout, index) => (
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
                ))}
              </>
            ) : (
              <p>No workout history found.</p>
            )}
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="workout-container">
      <header className="workout-header">
        <h1>FitTrack Pro 🏋️</h1>
      </header>

      <nav className="workout-nav">
        <button
          className={activeTab === "exercises" ? "active" : ""}
          onClick={() => setActiveTab("exercises")}
        >
          <FaDumbbell /> Exercises
        </button>
        <button
          className={activeTab === "leaderboard" ? "active" : ""}
          onClick={() => setActiveTab("leaderboard")}
        >
          <FaTrophy /> Leaderboard
        </button>
        <button
          className={activeTab === "challenges" ? "active" : ""}
          onClick={() => setActiveTab("challenges")}
        >
          <FaChartLine /> Challenges
        </button>
        <button
          className={activeTab === "history" ? "active" : ""}
          onClick={() => setActiveTab("history")}
        >
          <FaHistory /> History
        </button>
      </nav>

      <main className="workout-content">
        {renderTabContent()}
      </main>

      <button className="complete-workout-button" onClick={handleCompleteWorkout}>
        Complete Workout
      </button>
    </div>
  );
};

export default WorkoutPage;
