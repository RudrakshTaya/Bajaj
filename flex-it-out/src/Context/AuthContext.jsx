import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");

    console.log("AuthContext Loaded - Token:", token);
    console.log("AuthContext Loaded - Username:", storedUsername);

    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  const signIn = (token, user) => {
    console.log("SignIn Function Called - Token:", token);
    console.log("SignIn Function Called - User:", user);

    if (user && user.username) {  // Ensure username exists in response
      localStorage.setItem("token", token);
      localStorage.setItem("username", user.username); // Store username
      setIsLoggedIn(true);
      setUsername(user.username);
    } else {
      console.error("Error: Username is missing in the login response.");
    }
  };

  const signOut = () => {
    console.log("User Logged Out");
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    setIsLoggedIn(false);
    setUsername("");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, signIn, signOut, username }}>
      {children}
    </AuthContext.Provider>
  );
};
