import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [newName, setNewName] = useState(user?.name || "");
  const [newPhone, setNewPhone] = useState(user?.phone || "");
  const [newEmail, setNewEmail] = useState(user?.email || "");
  const [newCalories, setNewCalories] = useState(user?.calories || "");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Unauthorized. Please log in.");
          setLoading(false);
          return;
        }

        const res = await axios.get("http://localhost:5001/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data);
        setNewName(res.data.name);
        setNewPhone(res.data.phone);
        setNewEmail(res.data.email);
        setNewCalories(res.data.calories);
      } catch (err) {
        setError("Failed to load profile. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newName);
    formData.append("phoneNumber", newPhone);
    formData.append("email", newEmail);
    formData.append("calories", newCalories);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized. Please log in.");
        return;
      }

      const res = await axios.put(
        "http://localhost:5001/api/user/profile",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data.user);
      setError(""); // Reset error on successful update
    } catch (err) {
      setError("Failed to update profile. Try again later.");
    }
  };

  return (
    <div className="profile-container">
      {loading ? (
        <div className="spinner"></div>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="profile-card">
          <img
            className="profile-pic"
            src={user.avatar || "/default-avatar.png"}
            alt="Profile"
          />
          <h2>{user.name}</h2>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Phone:</strong> {user.phone}
          </p>
          <p>
            <strong>Calories Burned:</strong> {user.calories}
          </p>
          <p>
            <strong>Joined:</strong>{" "}
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
          <button className="edit-btn" onClick={handleEditProfile}>
            Edit Profile
          </button>
          <button onClick={handleProfileUpdate}>Update Profile</button>

          {/* Update Profile Form */}
          <form onSubmit={handleProfileUpdate}>
            <input
              type="text"
              placeholder="Update Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Update Phone"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
            />
            <input
              type="email"
              placeholder="Update Email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <input
              type="number"
              placeholder="Update Calories"
              value={newCalories}
              onChange={(e) => setNewCalories(e.target.value)}
            />
            <button type="submit">Save Changes</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
