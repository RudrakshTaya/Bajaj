import { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaUserPlus, FaDumbbell } from "react-icons/fa";
import "./MultiplayerChallenges.css";

const API_URL =
  import.meta.env.VITE_API_URL_PRODUCTION && import.meta.env.VITE_API_URL_TESTING
    ? (import.meta.env.MODE === "production"
      ? import.meta.env.VITE_API_URL_PRODUCTION
      : import.meta.env.VITE_API_URL_TESTING)
    : "http://localhost:5001";

const MultiplayerChallenges = () => {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const exercises = [
    { id: "squat", name: "Squats" },
    { id: "pushup", name: "Push-ups"},
    { id: "highKnee", name: "High Knees"},
    { id: "lunges", name: "Lunges"},
  ];

  const fetchUsers = async () => {
    if (searchTerm.length < 3) return;

    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/users/search`, {
        params: { query: searchTerm },
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchUsers();
  };

  const handleInvite = async (inviteeId, exerciseId) => {
    try {
      await axios.post(
        `${API_URL}/api/users/invite`,
        { inviterId: userId, inviteeId, exerciseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Invitation sent!");
    } catch (error) {
      console.error("Error sending invite:", error);
    }
  };

  return (
    <div className="multiplayer-container">
      <h2>Multiplayer Challenges</h2>
  
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}><FaSearch /></button>
      </div>
  
      {loading && <p>Loading users...</p>}
      {users.length === 0 && !loading && searchTerm.length >= 3 && <p>No users found.</p>}
  
      {users.length > 0 && (
        <div className="exercise-list">
          {exercises.map((exercise) => (
            <div key={exercise.id} className="exercise-card">
              <h3>{exercise.name}</h3>
              <p>Target: {exercise.target} reps</p>
              <div className="user-list">
                {users.map((user) => (
                  <div key={user._id} className="user-card">
                    <img
                      src={user.avatar || "/default-avatar.png"}
                      alt="Profile"
                      className="user-avatar"
                    />
                    <span className="username">{user.name}</span>
                    <button onClick={() => handleInvite(user._id, exercise.id)}>
                      <FaUserPlus /> Invite
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );  
};

export default MultiplayerChallenges;
