import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "./CommunityPage.css"

const CommunityPage = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupName, setGroupName] = useState("");
  const token = localStorage.getItem("token");

  // Fetch Groups from API
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/group/fetchgroups", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data)
        setGroups(response.data)
      } catch (err) {
        setError("Failed to load groups.");
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, [token]);

  // Create Group Function
  const createGroup = async () => {
    if (!groupName.trim()) return; // Prevent empty input

    try {
      const response = await axios.post(
        "http://localhost:5001/api/group/creategroup",
        {
          name: groupName,
          members: [],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setGroups([...groups, response.data]);
      setGroupName(""); // Clear input after creation
    } catch (err) {
      alert("Failed to create group.");
    }
  };

  return (
    <div className="community-container">
      <h1 className="community-title">Explore Groups</h1>
      <p className="community-description">Join communities that interest you!</p>

      <div className="create-group-container">
        <input
          type="text"
          placeholder="Enter group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="group-input"
        />
        <button className="create-group-button" onClick={createGroup}>
          + Create Group
        </button>
      </div>

      {loading ? (
        <p className="loading-message">Loading groups...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="group-list">
          {groups.map((group) => (
            <div key={group._id} className="group-card" onClick={() => navigate(`/group/${group._id}`)}>
              <h2 className="group-name">{group.name}</h2>
              <p className="group-members">{group.members.length} members</p>
            </div>
          ))}
        </div>
      )}

      <button className="vc-button" onClick={() => navigate("/video-chat")}>
        Join Video Chat
      </button>
    </div>
  )
}

export default CommunityPage