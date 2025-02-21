import React, { useState, useEffect } from "react";
import axios from "axios";
import "./NutritionGuidance.css";
import { TextField, Select, MenuItem, Button } from "@mui/material";

const API_URL = "http://localhost://5001"; // Replace with your actual API URL

const NutritionGuidance = () => {
  const [apiMeals, setApiMeals] = useState([]); // Suggested meals from API
  const [userMeals, setUserMeals] = useState([]); // User-logged meals
  const [mealName, setMealName] = useState("");
  const [caloriesConsumed, setCaloriesConsumed] = useState("");
  const [mealTime, setMealTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch meals from API (Suggested Meals)
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_URL}/api/meals/getmeals`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setApiMeals(response.data); // Store fetched meals
      } catch (error) {
        setError("Failed to fetch meals");
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []); // Removed unnecessary dependencies

  // Handle input changes
  const handleMealNameChange = (e) => setMealName(e.target.value);
  const handleCalorieInput = (e) => setCaloriesConsumed(e.target.value);
  const handleMealTimeChange = (e) => setMealTime(e.target.value);

  // Add user meal to tracking
  const addMeal = () => {
    if (!mealName || !caloriesConsumed || !mealTime) {
      alert("Please enter meal name, calories, and select a meal time.");
      return;
    }

    const newMeal = {
      name: mealName,
      calories: parseInt(caloriesConsumed),
      mealTime: mealTime,
    };

    setUserMeals([...userMeals, newMeal]); // Add meal to tracking
    setMealName(""); // Clear inputs
    setCaloriesConsumed("");
    setMealTime("");
  };

  // Calculate total calories for user-logged meals
  const totalCalories = userMeals.reduce((sum, meal) => sum + meal.calories, 0);

  return (
    <div className="nutrition-container">
      <h2>🍽️ Nutrition Tracker</h2>

      {/* 📌 Suggested Meals (API Data) */}
      <div className="api-meals-section">
        <h3>Suggested Meals</h3>
        {loading ? (
          <p>Loading meal suggestions...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <table className="meal-table">
            <thead>
              <tr>
                <th>Meal</th>
                <th>Calories</th>
              </tr>
            </thead>
            <tbody>
              {apiMeals.map((meal, index) => (
                <tr key={index}>
                  <td>{meal.name}</td>
                  <td>{meal.calories} kcal</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 📌 User-Logged Meals */}
      <div className="meal-input-section">
        <h3>Track Your Meals</h3>
        <TextField label="Meal Name" variant="outlined" value={mealName} onChange={handleMealNameChange} />
        <TextField label="Enter Calories" type="number" variant="outlined" value={caloriesConsumed} onChange={handleCalorieInput} />

        <Select value={mealTime} onChange={handleMealTimeChange} displayEmpty variant="outlined">
          <MenuItem value="" disabled>Select Meal Time</MenuItem>
          <MenuItem value="Breakfast">Breakfast</MenuItem>
          <MenuItem value="Lunch">Lunch</MenuItem>
          <MenuItem value="Dinner">Dinner</MenuItem>
          <MenuItem value="Snack">Snack</MenuItem>
        </Select>

        <Button variant="contained" color="primary" onClick={addMeal}>
          Add Meal
        </Button>
      </div>

      {/* 📌 User-Logged Meals Table */}
      <div className="user-meals-section">
        <h3>Your Meals</h3>
        {userMeals.length === 0 ? (
          <p>No meals added yet.</p>
        ) : (
          <table className="meal-table">
            <thead>
              <tr>
                <th>Meal</th>
                <th>Calories</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {userMeals.map((meal, index) => (
                <tr key={index}>
                  <td>{meal.name}</td>
                  <td>{meal.calories} kcal</td>
                  <td>{meal.mealTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 📌 Total Calories */}
      <h3>Total Calories Consumed: {totalCalories} kcal</h3>
    </div>
  );
};

export default NutritionGuidance;
