"use client"
import axios from 'axios';

import { useState, useEffect,useContext } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { FaDumbbell, FaTrophy, FaChartLine, FaHistory, FaFire, FaMedal } from "react-icons/fa"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import confetti from "canvas-confetti"
import "./WorkoutPage.css"
import { AuthContext } from "../Context/AuthContext" // Assuming you have an AuthContext
const WorkoutPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { userId } = useContext(AuthContext); 

   // Get the authenticated user from context
 console.log("user",userId)
  const [exercises, setExercises] = useState([
    { id: "squat", name: "Squats", completed: false, reps: 0, score: 0, target: 20 },
    { id: "pushup", name: "Push-ups", completed: false, reps: 0, score: 0, target: 15 },
    { id: "highKnee", name: "High Knees", completed: false, reps: 0, score: 0, target: 30 },
    { id: "lunges", name: "Lunges", completed: false, reps: 0, score: 0, target: 20 }, 
  ])

  const [leaderboard, setLeaderboard] = useState([
    { name: "Alice", score: 150, avatar: "https://i.pravatar.cc/100?img=1" },
    { name: "Bob", score: 120, avatar: "https://i.pravatar.cc/100?img=2" },
    { name: "Charlie", score: 100, avatar: "https://i.pravatar.cc/100?img=3" },
  ])

  const [challenges, setChallenges] = useState([
    { name: "10 Squats", completed: false, icon: "🏋️" },
    { name: "5 Push-ups", completed: false, icon: "💪" },
    { name: "20 High Knees", completed: false, icon: "🏃" },
  ])

  const [workoutHistory, setWorkoutHistory] = useState([])
  const [activeTab, setActiveTab] = useState("exercises")
  const [streak, setStreak] = useState(5)
  const [totalScore, setTotalScore] = useState(0)

  useEffect(() => {
    if (location.state && location.state.exerciseId) {
      const { exerciseId, reps, score } = location.state
      setExercises((prevExercises) =>
        prevExercises.map((exercise) =>
          exercise.id === exerciseId ? { ...exercise, completed: true, reps, score } : exercise,
        ),
      )
      navigate(location.pathname, { replace: true })
    }
  }, [location.state, location.pathname, navigate])

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/workouts/${userId}`);

        const data = await response.json()
        setWorkoutHistory(data)
      } catch (error) {
        console.error("Error fetching workouts:", error)
      }
    }

    fetchWorkouts()
  }, [])

  useEffect(() => {
    const newTotalScore = exercises.reduce((sum, exercise) => sum + exercise.score, 0)
    setTotalScore(newTotalScore)
  }, [exercises])

  const handleCompleteWorkout = async () => {
    const workoutData = exercises.map((exercise) => ({
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      reps: exercise.reps,
      score: exercise.score,
    }));

    try {
      const response = await fetch("http://localhost:5001/api/workouts/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          exercises: workoutData,
          totalScore,
        }),
      });

      if (response.ok) {
        // Post the score to the leaderboard
        try {
          await axios.post("http://localhost:5001/api/leaderboard", {
            userId,
            score: totalScore,
          });
          alert("Score added to leaderboard!");
        } catch (error) {
          console.error("Error posting score", error);
        }

        // Display confetti and alert the user
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });

        alert("Workout completed and saved! Great job!");
        
        // Reset exercises and update streak
        setExercises((prevExercises) =>
          prevExercises.map((exercise) => ({
            ...exercise,
            completed: false,
            reps: 0,
            score: 0,
          }))
        );
        setStreak(streak + 1);
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
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="exercises-list"
          >
            <h2>
              <FaDumbbell /> Exercises
            </h2>
            {exercises.map((exercise) => (
              <div key={exercise.id} className="exercise-card">
                <div className="exercise-info">
                  <h3>{exercise.name}</h3>
                  <p>Target: {exercise.target} reps</p>
                </div>
                {exercise.completed ? (
                  <div className="exercise-result">
                    <CircularProgressbar
                      value={(exercise.reps / exercise.target) * 100}
                      text={`${exercise.reps}/${exercise.target}`}
                      styles={buildStyles({
                        textSize: "22px",
                        pathTransitionDuration: 0.5,
                        pathColor: `rgba(62, 152, 199, ${exercise.reps / exercise.target})`,
                        textColor: "#2c3e50",
                        trailColor: "#d6d6d6",
                      })}
                    />
                    <span className="exercise-score">Score: {exercise.score}</span>
                  </div>
                ) : (
                  <Link to={`/pose-detection/${exercise.id}`}>
                    <button className="start-button">Start</button>
                  </Link>
                )}
              </div>
            ))}
            <button className="complete-workout-button" onClick={handleCompleteWorkout}>
              Complete Workout
            </button>
          </motion.div>
        )
      case "leaderboard":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="leaderboard"
          >
            <h2>
              <FaTrophy /> Leaderboard
            </h2>
            {leaderboard.map((entry, index) => (
              <div key={index} className="leaderboard-entry">
                <div className="leaderboard-user">
                  <img src={entry.avatar || "/placeholder.svg"} alt={entry.name} className="avatar" />
                  <span>{entry.name}</span>
                </div>
                <span className="leaderboard-score">{entry.score} pts</span>
              </div>
            ))}
          </motion.div>
        )
      case "challenges":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="challenges"
          >
            <h2>
              <FaChartLine /> Challenges
            </h2>
            {challenges.map((challenge, index) => (
              <div key={index} className="challenge-card">
                <div className="challenge-info">
                  <span className="challenge-icon">{challenge.icon}</span>
                  <span>{challenge.name}</span>
                </div>
                {challenge.completed ? (
                  <span className="completed">✅ Completed</span>
                ) : (
                  <button
                    className="challenge-button"
                    onClick={() => {
                      const newChallenges = [...challenges]
                      newChallenges[index].completed = true
                      setChallenges(newChallenges)
                    }}
                  >
                    Complete
                  </button>
                )}
              </div>
            ))}
          </motion.div>
        )
      case "history":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="workout-history"
          >
            <h2>
              <FaHistory /> Workout History
            </h2>
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
        )
      default:
        return null
    }
  }

  return (
    <div className="workout-container">
      <header className="workout-header">
        <h1>FitTrack Pro 🏋️</h1>
        <div className="user-stats">
          <div className="streak">
            <FaFire className="streak-icon" />
            <span>{streak} day streak</span>
          </div>
          <div className="total-score">
            <FaMedal className="score-icon" />
            <span>{totalScore} points</span>
          </div>
        </div>
      </header>

      <nav className="workout-nav">
        <button className={activeTab === "exercises" ? "active" : ""} onClick={() => setActiveTab("exercises")}>
          <FaDumbbell /> Exercises
        </button>
        <button className={activeTab === "leaderboard" ? "active" : ""} onClick={() => setActiveTab("leaderboard")}>
          <FaTrophy /> Leaderboard
        </button>
        <button className={activeTab === "challenges" ? "active" : ""} onClick={() => setActiveTab("challenges")}>
          <FaChartLine /> Challenges
        </button>
        <button className={activeTab === "history" ? "active" : ""} onClick={() => setActiveTab("history")}>
          <FaHistory /> History
        </button>
      </nav>

      <main className="workout-content">
        <AnimatePresence mode="wait">{renderTabContent()}</AnimatePresence>
      </main>
    </div>
  )
}

export default WorkoutPage

