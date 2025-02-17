import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    age: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state for form submission
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    // Simple client-side validation
    if (!formData.email || !formData.password || !formData.name || !formData.phone || !formData.age) {
      return "All fields are required.";
    }
    
    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(formData.email)) {
      return "Invalid email format.";
    }

    // Validate phone number format (adjust as necessary)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      return "Phone number should be 10 digits.";
    }

    // Validate age (ensure it's a number and within a reasonable range)
    if (formData.age < 18 || formData.age > 120) {
      return "Age should be between 18 and 120.";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    const errorMsg = validateForm();
    if (errorMsg) {
      setError(errorMsg);
      return;
    }
    
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, formData);
      alert("Signup Successful! Please log in.");
      navigate("/signin");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false); // Stop loading spinner after submission
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="name" 
          placeholder="Name" 
          onChange={handleChange} 
          value={formData.name}
          required 
        />
        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          onChange={handleChange} 
          value={formData.email}
          required 
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          onChange={handleChange} 
          value={formData.password}
          required 
        />
        <input 
          type="text" 
          name="phone" 
          placeholder="Phone Number" 
          onChange={handleChange} 
          value={formData.phone}
          required 
        />
        <input 
          type="number" 
          name="age" 
          placeholder="Age" 
          onChange={handleChange} 
          value={formData.age}
          required 
        />
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Sign Up"}
        </button>
      </form>
      <p>Already have an account? <a href="/signin">Sign In</a></p>
    </div>
  );
};

export default SignUp;
