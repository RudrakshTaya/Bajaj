"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Pencil, Phone, Mail, Flame, Calendar } from "lucide-react";
import { Button, TextField, Card, CardContent, CardActions, CardHeader, Avatar, CircularProgress, Typography } from "@mui/material";
import './ProfilePage.css';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    streak: "",
  });
  const [avatar, setAvatar] = useState(null); // State to handle the profile image upload

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Unauthorized. Please log in.");
          setLoading(false);
          return;
        }

        const res = await fetch("https://flex-it-out-backend-1.onrender.com/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        console.log(data);
        setUser(data);
        setFormData({
          name: data.name,
          phone: data.phone,
          email: data.email,
          streak: data.calories,
        });
      } catch (err) {
        setError("Failed to load profile. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]); // Set the selected avatar file
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized. Please log in.");
        return;
      }

      // Prepare form data for profile update, including avatar if available
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("name", formData.name);
      formDataToSubmit.append("phone", formData.phone);
      formDataToSubmit.append("email", formData.email);
      formDataToSubmit.append("streak", formData.streak);

      if (avatar) {
        formDataToSubmit.append("avatar", avatar); // Append the file if it's selected
      }

      const res = await fetch("https://flex-it-out-backend-1.onrender.com/api/user/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSubmit,
      });
      const data = await res.json();

      if (data.message === "Profile updated successfully") {
        setUser(data.user);
        setIsEditing(false);
        setError("");
      } else {
        setError("Failed to update profile. Try again later.");
      }
    } catch (err) {
      setError("Failed to update profile. Try again later.");
    }
  };

  if (loading) return <div className="loader"><CircularProgress /></div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <Avatar sx={{ width: 96, height: 96, mx: "auto", mb: 2 }}>
            <img src={user.avatar || "/placeholder.svg?height=96&width=96"} alt={user.name} />
          </Avatar>
          <Typography variant="h5">{user.name}</Typography>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <TextField
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                label="Name"
                fullWidth
                variant="outlined"
              />
              <TextField
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                label="Phone"
                fullWidth
                variant="outlined"
              />
              <TextField
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                label="Email"
                fullWidth
                variant="outlined"
                type="email"
              />
              <TextField
                name="streak"
                value={formData.streak}
                onChange={handleInputChange}
                label="Calories Burned"
                fullWidth
                variant="outlined"
                type="number"
              />
              <input
                type="file"
                onChange={handleAvatarChange}
                accept="image/*"
                className="hidden"
                id="avatar-upload"
              />
              <label htmlFor="avatar-upload" className="btn btn-primary">
                Choose Avatar
              </label>
            </form>
          ) : (
            <div className="space-y-2">
              <Typography variant="body1" className="flex items-center" style={{ color: "black" }}>
  <Phone className="mr-2" /> {user.phone}
</Typography>
<Typography variant="body1" className="flex items-center" style={{ color: "black" }}>
  <Mail className="mr-2" /> {user.email}
</Typography>
<Typography variant="body1" className="flex items-center" style={{ color: "black" }}>
  <Flame className="mr-2" /> {user.calories} calories burned
</Typography>
<Typography variant="body1" className="flex items-center" style={{ color: "black" }}>
  <Calendar className="mr-2" /> Joined {new Date(user.createdAt).toLocaleDateString()}
</Typography>




            </div>
          )}
        </CardContent>
        <CardActions className="flex justify-end space-x-2">
          {isEditing ? (
            <>
              <Button variant="outlined" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleProfileUpdate} variant="contained">
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} fullWidth>
              <Pencil className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          )}
        </CardActions>
      </Card>
    </div>
  );
};

export default ProfilePage;
