import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaSearch, FaUserPlus } from "react-icons/fa";
import { AuthContext } from "../Context/AuthContext";
import "./MultiplayerChallenges.css";

const API_URL =
  import.meta.env.VITE_API_URL_PRODUCTION && import.meta.env.VITE_API_URL_TESTING
    ? (import.meta.env.MODE === "production"
      ? import.meta.env.VITE_API_URL_PRODUCTION
      : import.meta.env.VITE_API_URL_TESTING)
    : "http://localhost:5001";

const MultiplayerChallenges = () => {
  const { userId } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (searchTerm.length > 2) {
      fetchUsers();
    }
  }, [searchTerm]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/users/search`, {
        params: { query: searchTerm },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleInvite = async (inviteeId) => {
    try {
      await axios.post(`${API_URL}/api/challenges/invite`, {
        inviterId: userId,
        inviteeId,
      });
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
        <button><FaSearch /></button>
      </div>

      <div className="user-list">
        {users.map((user) => (
          <div key={user._id} className="user-card">
            <span>{user.username}</span>
            <button onClick={() => handleInvite(user._id)}>
              <FaUserPlus /> Invite
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiplayerChallenges;