import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");


  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    const storedUserId = localStorage.getItem("userId");
    

    

    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername)
      setUserId(storedUserId);
    }
  }, []);

  const signIn = (token, user) => {
    

    if (user && user.name) {  // Ensure username exists in response
      localStorage.setItem("token", token);
      localStorage.setItem("username", user.name); // Store username
      localStorage.setItem("userId",user.id);
      setIsLoggedIn(true);
      setUsername(user.name);
      setUserId(user.id);
    } else {
      console.error("Error: Username is missing in the login response.");
    }
  };

  const signOut = () => {
    
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    setIsLoggedIn(false);
    setUsername("");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, signIn, signOut, username ,userId}}>
      {children}
    </AuthContext.Provider>
  );
};
