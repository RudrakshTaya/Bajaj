import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

const SignIn = () => {
  const [formData, setFormData] = useState({ emailOrPhone: "", password: "" });
  const [error, setError] = useState("");
  const { signIn } = useContext(AuthContext); // Use AuthContext to manage authentication state
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Determine whether emailOrPhone is an email or phone number
      const isPhone = /^[0-9]{10}$/.test(formData.emailOrPhone); // Check if it's a 10-digit phone number

      const loginData = {
        emailOrPhone: formData.emailOrPhone,
        password: formData.password,
        isPhone,
      };

      // Send login request to backend
      const res = await axios.post("https://flex-it-out-backend.vercel.app/api/auth/login", loginData);

      const { token, user } = res.data;

      if (token && user) {
        console.log(user);

        // Sign in the user using the AuthContext function
        signIn(token, user);

        // Store user details in localStorage (one-time action)
        localStorage.setItem("token", token);
        localStorage.setItem("userId", user.id);
        localStorage.setItem("username", user.name); 
        localStorage.setItem("membership", user.membership.plan); // Store membership info

        navigate("/"); // Redirect to home/dashboard
      } else {
        setError("Invalid response from server");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign In</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="emailOrPhone"
          placeholder="Email or Phone Number"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit">Sign In</button>
      </form>
      <p>Don't have an account? <a href="/signup">Sign Up</a></p>
    </div>
  );
};

export default SignIn;
