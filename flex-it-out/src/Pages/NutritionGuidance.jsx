import React, { useState, useEffect } from "react";
import CalorieCalculator from "../Components/CalorieCalculator";
import axios from "axios";
import "./NutritionGuidance.css"; // Import CSS for styling
import { useNavigate } from "react-router-dom";

const NutritionGuidance = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5001/api/meals/getmeals", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data);
        setMeals(response.data);
      } catch (error) {
        setError("Failed to fetch meals");
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  const showMeal = (meal) => {
    navigate(`/meal/${meal._id}`, { state: { meal } });
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
                <p className="meal-description">calories: {meal.calories}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NutritionGuidance;