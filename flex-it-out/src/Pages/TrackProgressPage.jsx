import React from "react";
import { motion } from "framer-motion";
import "./TrackProgressPage.css"; // Make sure you create this CSS file

const TrackProgressPage = () => {
  return (
    <div className="track-progress-container">
      <motion.h1 
        initial={{ y: -20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ duration: 0.5 }}
      >
        Track Your Progress
      </motion.h1>
      
      <p>Monitor your fitness journey and celebrate your achievements!</p>

      {/* Placeholder for future progress tracking data */}
      <div className="progress-section">
        <motion.div className="progress-card" whileHover={{ scale: 1.05 }}>
          <h2>Workout History</h2>
          <p>View your completed workouts.</p>
        </motion.div>
        
        <motion.div className="progress-card" whileHover={{ scale: 1.05 }}>
          <h2>Calories Burned</h2>
          <p>See how many calories you've burned.</p>
        </motion.div>
        
        <motion.div className="progress-card" whileHover={{ scale: 1.05 }}>
          <h2>Achievements</h2>
          <p>Unlock and track your fitness milestones.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default TrackProgressPage;
