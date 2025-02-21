import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Pencil, Phone, Mail, Flame, Calendar, Trophy, Dumbbell } from "lucide-react";
import { Button, TextField, Card, CardContent, CardActions, CardHeader, Avatar, CircularProgress, Typography, MenuItem, Select } from "@mui/material";
import "./ProfilePage.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    age: "",
    gender: "other",
    height: "",
    weight: "",
    fitnessGoals: "general_fitness",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        if (!token) {
          setError("Unauthorized. Please log in.");
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_URL}/api/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load profile");

        setProfile(data);
        setFormData({
          name: data.name || "",
          bio: data.bio || "",
          age: data.age !== null ? data.age : "",
          gender: data.gender || "other",
          height: data.height !== null ? data.height : "",
          weight: data.weight !== null ? data.weight : "",
          fitnessGoals: data.fitnessGoals || "general_fitness",
        });
      } catch (err) {
        setError(err.message);
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
    setAvatar(e.target.files[0]);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized. Please log in.");
        return;
      }

      const formDataToSubmit = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSubmit.append(key, value === "" ? null : value);
      });

      if (avatar) {
        formDataToSubmit.append("avatar", avatar);
      }

      const res = await fetch(`${API_URL}/api/user/profile`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSubmit,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update profile");

      setProfile(data.profile);
      setIsEditing(false);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="loader"><CircularProgress /></div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <Avatar sx={{ width: 96, height: 96, mx: "auto", mb: 2 }}>
            <img src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
          </Avatar>
          <Typography variant="h5">Name: {profile.name || "N/A"}</Typography>
          <Typography variant="body2" color="textSecondary">Bio: {profile.bio || "N/A"}</Typography>
        </CardHeader>

        <CardContent>
          {isEditing ? (
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <TextField name="name" value={formData.name} onChange={handleInputChange} label="Name" fullWidth />
              <TextField name="bio" value={formData.bio} onChange={handleInputChange} label="Bio" fullWidth multiline rows={3} />
              <TextField name="age" value={formData.age} onChange={handleInputChange} label="Age" fullWidth type="number" />
              <Select name="gender" value={formData.gender} onChange={handleInputChange} fullWidth>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
              <TextField name="height" value={formData.height} onChange={handleInputChange} label="Height (cm)" fullWidth type="number" />
              <TextField name="weight" value={formData.weight} onChange={handleInputChange} label="Weight (kg)" fullWidth type="number" />
              <Select name="fitnessGoals" value={formData.fitnessGoals} onChange={handleInputChange} fullWidth>
                <MenuItem value="weight_loss">Weight Loss</MenuItem>
                <MenuItem value="muscle_gain">Muscle Gain</MenuItem>
                <MenuItem value="endurance">Endurance</MenuItem>
                <MenuItem value="flexibility">Flexibility</MenuItem>
                <MenuItem value="general_fitness">General Fitness</MenuItem>
              </Select>
              <input type="file" onChange={handleAvatarChange} accept="image/*" className="hidden" id="avatar-upload" />
              <label htmlFor="avatar-upload" className="btn btn-primary">Choose Avatar</label>
            </form>
          ) : (
            <div className="space-y-2">
              <Typography variant="body1"><Phone /> Phone: {profile.user.phone || "N/A"}</Typography>
              <Typography variant="body1"><Mail /> Email: {profile.user.email || "N/A"}</Typography>
              <Typography variant="body1"><Dumbbell /> Workouts Completed: {profile.workoutsCompleted || 0}</Typography>
              <Typography variant="body1"><Flame /> Streak: {profile.streak || 0} days</Typography>
              <Typography variant="body1"><Trophy /> Score: {profile.score || 0}</Typography>
              <Typography variant="body1"><Calendar /> Joined: {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "N/A"}</Typography>

              {/* Achievements Section */}
              <Typography variant="h6"><Trophy /> Achievements:</Typography>
              {profile.achievements && profile.achievements.length > 0 ? (
                profile.achievements.map((ach, idx) => (
                  <Typography key={idx} variant="body2">🏆 {ach.title} - {ach.date ? new Date(ach.date).toLocaleDateString() : "N/A"}</Typography>
                ))
              ) : (
                <Typography variant="body2">No achievements yet</Typography>
              )}
            </div>
          )}
        </CardContent>

        <CardActions className="flex justify-end space-x-2">
          {isEditing ? (
            <>
              <Button onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button onClick={handleProfileUpdate} variant="contained">Save</Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} fullWidth><Pencil /> Edit Profile</Button>
          )}
        </CardActions>
      </Card>
    </div>
  );
};

export default ProfilePage;
