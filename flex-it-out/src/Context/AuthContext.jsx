import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [membership, setMembership] = useState("");  // State to store membership

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    const storedUserId = localStorage.getItem("userId");
    const storedMembership = localStorage.getItem("membership");  // Retrieve membership info from localStorage

    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
      setUserId(storedUserId);
      setMembership(storedMembership);  // Set membership info from localStorage
    }
  }, []);

  const signIn = (token, user) => {
    if (user && user.name) {
      localStorage.setItem("token", token);
      localStorage.setItem("username", user.name); // Store username
      localStorage.setItem("userId", user.id);
      localStorage.setItem("membership", user.membership.plan);  // Store membership info

      setIsLoggedIn(true);
      setUsername(user.name);
      setUserId(user.id);
      setMembership(user.membership.plan);  // Set membership info
    } else {
      console.error("Error: Username is missing in the login response.");
    }
  };

  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("membership");  // Remove membership info from localStorage

    setIsLoggedIn(false);
    setUsername("");
    setUserId("");
    setMembership("");  // Clear membership info from state
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, signIn, signOut, username, userId, membership }}>
      {children}
    </AuthContext.Provider>
  );
};
