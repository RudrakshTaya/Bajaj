import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./EditProfile.css";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profileImage: null,
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in header
          },
        });

        setFormData({ name: res.data.name, email: res.data.email });
        setPreviewImage(res.data.avatar);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    if (token) fetchProfile();
    else navigate("/signin"); // Redirect if no token
  }, [token, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profileImage: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const formDataToSend = new FormData(); 
        formDataToSend.append("name", formData.name);
        formDataToSend.append("email", formData.email);
        if (formData.profileImage) {
            formDataToSend.append("profileImage", formData.profileImage);
        }

      await axios.put("http://localhost:5001/api/user/profile", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Profile updated successfully!");
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Profile update failed");
    }
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="profile-image-container">
          {previewImage && <img src={previewImage} alt="Profile" className="profile-image" />}
          <input type="file" name="profileImage" accept="image/*" onChange={handleFileChange} />
        </div>
        <input type="text" name="name" value={formData.name} placeholder="Name" onChange={handleChange} required />
        <input type="email" name="email" value={formData.email} placeholder="Email" onChange={handleChange} required />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditProfile;
