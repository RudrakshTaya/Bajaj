import React, { useState, useEffect, useContext } from "react";
import CalorieCalculator from "../Components/CalorieCalculator";
import axios from "axios";
import "./NutritionGuidance.css"; // Import CSS for styling
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material"; // Import Material-UI Dialog components

const NutritionGuidance = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  const { userId, membership } = useContext(AuthContext);

  console.log(membership);

  useEffect(() => {
    if (membership !== "premium") {
      setOpenDialog(true);
      return;
    }

    const fetchMeals = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get("https://flex-it-out-backend-1.onrender.com/api/meals/getmeals", {
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

  return (
    <div className="nutrition-container">
      <CalorieCalculator />

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
