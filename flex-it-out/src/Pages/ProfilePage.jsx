import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
        console.log(res.data);
        
        
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

  return (
    <div className="profile-container">
      {loading ? (
        <div className="spinner"></div>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="profile-card">
          <img className="profile-pic" src={user.avatar || "/default-avatar.png"} alt="Profile" />
          <h2>{user.name}</h2>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
          <button className="edit-btn" onClick={handleEditProfile}>Edit Profile</button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
