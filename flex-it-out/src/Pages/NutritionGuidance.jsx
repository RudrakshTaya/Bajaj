// import React, { useState, useEffect, useContext } from "react";
// import CalorieCalculator from "../Components/CalorieCalculator";
// import axios from "axios";
// import "./NutritionGuidance.css"; // Import CSS for styling
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../Context/AuthContext";
// import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material"; // Import Material-UI Dialog components
// const API_URL =
//   import.meta.env.VITE_API_URL_PRODUCTION && import.meta.env.VITE_API_URL_TESTING
//     ? (import.meta.env.MODE === "production"
//       ? import.meta.env.VITE_API_URL_PRODUCTION
//       : import.meta.env.VITE_API_URL_TESTING)
//     : "http://localhost:5001";

// const NutritionGuidance = () => {
//   const [meals, setMeals] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [openDialog, setOpenDialog] = useState(false);
//   const navigate = useNavigate();
//   const { userId, membership } = useContext(AuthContext);

//   console.log(membership);

//   useEffect(() => {
//     if (membership !== "premium") {
//       setOpenDialog(true);
//       return;
//     }

//     const fetchMeals = async () => {
//       try {
//         const token = localStorage.getItem("token");

//         const response = await axios.get(`${API_URL}/api/meals/getmeals`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setMeals(response.data);
//       } catch (error) {
//         setError("Failed to fetch meals");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMeals();
//   }, [navigate, userId, membership]);

//   const showMeal = (meal) => {
//     navigate(`/meal/${meal._id}`, { state: { meal } });
//   };

//   const handleDialogClose = () => {
//     setOpenDialog(false);
//     navigate("/pricing");
//   };

//   return (
//     <div className="nutrition-container">
//       <CalorieCalculator />

//       <div className="meals-section">
//         <h2 className="section-title">Healthy Meal Plans 🍽️</h2>

//         {loading ? (
//           <p className="loading">Loading meals...</p>
//         ) : error ? (
//           <p className="error">{error}</p>
//         ) : (
//           <div className="meal-grid">
//             {meals.map((meal) => (
//               <div key={meal._id} className="meal-card" onClick={() => showMeal(meal)}>
//                 <img src={meal.imageUrl} alt={meal.name} className="meal-image" />
//                 <h3 className="meal-title">{meal.name}</h3>
//                 <p className="meal-description">Calories: {meal.calories}</p>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
//         <DialogTitle>Upgrade to Premium</DialogTitle>
//         <DialogContent>
//           <p>
//             You need a premium membership to access the healthy meal plans. 
//             Please switch to a premium plan to unlock this feature.
//           </p>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleDialogClose} color="primary">
//             Go to Pricing
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default NutritionGuidance;
// import React, { useState, useEffect, useContext } from "react";
// import CalorieCalculator from "../Components/CalorieCalculator";
// import axios from "axios";
// import "./NutritionGuidance.css"; // Import CSS for styling
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../Context/AuthContext";
// import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from "@mui/material"; // Import Material-UI Dialog components
// const API_URL =
//   import.meta.env.VITE_API_URL_PRODUCTION && import.meta.env.VITE_API_URL_TESTING
//     ? (import.meta.env.MODE === "production"
//       ? import.meta.env.VITE_API_URL_PRODUCTION
//       : import.meta.env.VITE_API_URL_TESTING)
//     : "http://localhost:5001";

// const NutritionGuidance = () => {
//   const [meals, setMeals] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [consumedCalories, setConsumedCalories] = useState(0);
//   const [suggestedCalories, setSuggestedCalories] = useState(2000); // Default value, can be updated from calculator
//   const [exerciseSuggestion, setExerciseSuggestion] = useState("");
//   const navigate = useNavigate();
//   const { userId, membership } = useContext(AuthContext);

//   console.log(membership);

//   useEffect(() => {
//     if (membership !== "premium") {
//       setOpenDialog(true);
//       return;
//     }

//     const fetchMeals = async () => {
//       try {
//         const token = localStorage.getItem("token");

//         const response = await axios.get(`${API_URL}/api/meals/getmeals`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setMeals(response.data);
//       } catch (error) {
//         setError("Failed to fetch meals");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMeals();
//   }, [navigate, userId, membership]);

//   const showMeal = (meal) => {
//     navigate(`/meal/${meal._id}`, { state: { meal } });
//   };

//   const handleDialogClose = () => {
//     setOpenDialog(false);
//     navigate("/pricing");
//   };

//   const handleCalorieInput = (event) => {
//     setConsumedCalories(event.target.value);
//   };

//   const handleAddCalories = () => {
//     const consumed = parseInt(consumedCalories, 10);
//     if (consumed > suggestedCalories) {
//       setExerciseSuggestion("You have exceeded your calorie limit! Try 30 minutes of cardio, jogging, or HIIT exercises.");
//     } else {
//       setExerciseSuggestion("Great job! You're within your daily limit.");
//     }
//   };

//   return (
//     <div className="nutrition-container">
//       <CalorieCalculator setSuggestedCalories={setSuggestedCalories} />

//       <div className="calorie-input-section">
//         <h3>Track Your Calories</h3>
//         <TextField
//           type="number"
//           label="Enter Calories Consumed"
//           variant="outlined"
//           value={consumedCalories}
//           onChange={handleCalorieInput}
//           fullWidth
//         />
//         <Button variant="contained" color="primary" onClick={handleAddCalories}>
//           Add Calories
//         </Button>
//         {exerciseSuggestion && <p className="exercise-suggestion">{exerciseSuggestion}</p>}
//       </div>

//       <div className="meals-section">
//         <h2 className="section-title">Healthy Meal Plans 🍽️</h2>

//         {loading ? (
//           <p className="loading">Loading meals...</p>
//         ) : error ? (
//           <p className="error">{error}</p>
//         ) : (
//           <div className="meal-grid">
//             {meals.map((meal) => (
//               <div key={meal._id} className="meal-card" onClick={() => showMeal(meal)}>
//                 <img src={meal.imageUrl} alt={meal.name} className="meal-image" />
//                 <h3 className="meal-title">{meal.name}</h3>
//                 <p className="meal-description">Calories: {meal.calories}</p>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
//         <DialogTitle>Upgrade to Premium</DialogTitle>
//         <DialogContent>
//           <p>
//             You need a premium membership to access the healthy meal plans. 
//             Please switch to a premium plan to unlock this feature.
//           </p>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleDialogClose} color="primary">
//             Go to Pricing
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default NutritionGuidance;
import React, { useState, useEffect, useContext } from "react";
import CalorieCalculator from "../Components/CalorieCalculator";
import axios from "axios";
import "./NutritionGuidance.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from "@mui/material";

const API_URL =
  import.meta.env.VITE_API_URL_PRODUCTION && import.meta.env.VITE_API_URL_TESTING
    ? (import.meta.env.MODE === "production"
      ? import.meta.env.VITE_API_URL_PRODUCTION
      : import.meta.env.VITE_API_URL_TESTING)
    : "http://localhost:5001";

const NutritionGuidance = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  const { userId, membership } = useContext(AuthContext);

  const [caloriesConsumed, setCaloriesConsumed] = useState(0);
  const [caloriesLimit, setCaloriesLimit] = useState(2000);
  const [excessCalories, setExcessCalories] = useState(0);
  const [exerciseSuggestion, setExerciseSuggestion] = useState("");

  useEffect(() => {
    if (membership !== "premium") {
      setOpenDialog(true);
      return;
    }

    const fetchMeals = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_URL}/api/meals/getmeals`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMeals(response.data);
      } catch (error) {
        setError("Failed to fetch meals");
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, [navigate, userId, membership]);

  const showMeal = (meal) => {
    navigate(`/meal/${meal._id}`, { state: { meal } });
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    navigate("/pricing");
  };

  // Function to handle calorie input change
  const handleCalorieInput = (e) => {
    setCaloriesConsumed(e.target.value);
  };

  // Function to check calorie limit and suggest exercises
  const checkCalories = () => {
    const excess = caloriesConsumed - caloriesLimit;
    setExcessCalories(excess);

    if (excess > 0) {
      let suggestion = "";
      if (excess <= 200) {
        suggestion = "Do 15 Squats and 20 Push-ups.";
      } else if (excess <= 500) {
        suggestion = "Perform 30 High Knees and 20 Jump Ropes.";
      } else {
        suggestion = "Try 50 Squats and 40 High Knees for an intense burn.";
      }
      setExerciseSuggestion(suggestion);
    } else {
      setExerciseSuggestion("Great job! You're under your calorie limit.");
    }
  };

  return (
    <div className="nutrition-container">
      <CalorieCalculator />

      <div className="calorie-input-section">
        <TextField
          label="Enter Calories Consumed"
          type="number"
          variant="outlined"
          value={caloriesConsumed}
          onChange={handleCalorieInput}
        />
        <Button variant="contained" color="primary" onClick={checkCalories}>
          Check Calories & Get Exercise
        </Button>
      </div>

      {exerciseSuggestion && (
        <div className="exercise-suggestion">
          {excessCalories > 0 ? (
            <>
              <h3>You exceeded by {excessCalories} calories! ⚠️</h3>
              <p>{exerciseSuggestion}</p>
            </>
          ) : (
            <h3>{exerciseSuggestion} ✅</h3>
          )}
        </div>
      )}

      <div className="meals-section">
        <h2 className="section-title">Healthy Meal Plans 🍽️</h2>

        {loading ? (
          <p className="loading">Loading meals...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <div className="meal-grid">
            {meals.map((meal) => (
              <div key={meal._id} className="meal-card" onClick={() => showMeal(meal)}>
                <img src={meal.imageUrl} alt={meal.name} className="meal-image" />
                <h3 className="meal-title">{meal.name}</h3>
                <p className="meal-description">Calories: {meal.calories}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Upgrade to Premium</DialogTitle>
        <DialogContent>
          <p>
            You need a premium membership to access the healthy meal plans. 
            Please switch to a premium plan to unlock this feature.
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Go to Pricing
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NutritionGuidance;
