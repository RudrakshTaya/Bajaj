import React from "react";
import { motion } from "framer-motion";
import "./TrackProgressPage.css"; // Ensure this CSS file handles styling

const trainers = [
  {
    id: 1,
    name: "John Doe",
    expertise: "Strength Training",
    photo: "john_doe.jpg", // Replace with actual image path
    exercises: ["Squats", "Deadlifts", "Bench Press"],
    plans: ["Beginner Strength Plan", "Intermediate Powerlifting Plan"],
  },
  {
    id: 2,
    name: "Jane Smith",
    expertise: "Yoga & Flexibility",
    photo: "jane_smith.jpg", // Replace with actual image path
    exercises: ["Sun Salutation", "Tree Pose", "Downward Dog"],
    plans: ["Beginner Yoga Plan", "Advanced Flexibility Plan"],
  },
  {
    id: 3,
    name: "Mike Johnson",
    expertise: "HIIT & Cardio",
    photo: "mike_johnson.jpg",
    exercises: ["Jump Rope", "Burpees", "Mountain Climbers"],
    plans: ["Fat Burn HIIT", "Endurance Training"],
  },
  {
    id: 4,
    name: "Emily Davis",
    expertise: "Pilates & Core Strength",
    photo: "emily_davis.jpg",
    exercises: ["Plank Variations", "Leg Raises", "Russian Twists"],
    plans: ["Core Strength Plan", "Pilates for Beginners"],
  },
  {
    id: 5,
    name: "Alex Carter",
    expertise: "Martial Arts & Kickboxing",
    photo: "alex_carter.jpg",
    exercises: ["Roundhouse Kick", "Jab-Cross Combo", "Muay Thai Clinch"],
    plans: ["Kickboxing Fundamentals", "Advanced Martial Arts"],
  },
  {
    id: 6,
    name: "Sophia Lee",
    expertise: "Bodybuilding & Hypertrophy",
    photo: "sophia_lee.jpg",
    exercises: ["Bicep Curls", "Leg Press", "Lat Pulldown"],
    plans: ["Muscle Gain Plan", "Bodybuilding Pro Program"],
  },
];

const TrackProgressPage = () => {
  return (
    <div className="trainer-progress-container">
      <motion.h1 
        initial={{ y: -20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ duration: 0.5 }}
      >
        Meet Our Expert Trainers
      </motion.h1>

      <div className="trainer-list">
        {trainers.map((trainer) => (
          <motion.div 
            key={trainer.id} 
            className="trainer-card" 
            whileHover={{ scale: 1.05 }}
          >
            <img src={trainer.photo} alt={trainer.name} className="trainer-photo" />
            <h2>{trainer.name}</h2>
            <p>{trainer.expertise}</p>
            <h3>Exercises:</h3>
            <ul>
              {trainer.exercises.map((exercise, index) => (
                <li key={index}>{exercise}</li>
              ))}
            </ul>
            <h3>Plans:</h3>
            <ul>
              {trainer.plans.map((plan, index) => (
                <li key={index}>{plan}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TrackProgressPage;
