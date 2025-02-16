// import { useState, useContext } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { FaBars, FaTimes } from "react-icons/fa";
// import { AuthContext } from "../context/AuthContext";
// import "./Navbar.css";

// const Navbar = () => {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const { isLoggedIn, signOut } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     signOut();
//     navigate("/signin");
//   };

//   return (
//     <nav className="navbar">
//       <div className="logo">
//         <Link to="/">FLEX-IT-OUT</Link>
//       </div>

//       <div className={`nav-links ${menuOpen ? "open" : ""}`}>
//         <Link to="/">Home</Link>
//          <Link to="/profile">Profile</Link>

//         {isLoggedIn ? (
//           <button onClick={handleLogout} className="logout-btn">Sign Out</button>
//         ) : (
//           <>
//             <Link to="/signin">Sign In</Link>
//             <Link to="/signup">Sign Up</Link>
//           </>
//         )}
//       </div>

//       <button className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
//         {menuOpen ? <FaTimes /> : <FaBars />}
//       </button>
//     </nav>
//   );
// };

// export default Navbar;


import React, { useState  , useContext} from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Track dropdown visibility
    const { isLoggedIn, signOut, username } = useContext(AuthContext);

    const handleLogout = () => {
        signOut();
        setIsDropdownOpen(false); // Close dropdown after logout
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">FLEX IT OUT</Link>
            </div>
            <div className="nav-links">
                <Link to="/workout">Workout</Link>
                <Link to="/leaderboard">Leaderboard</Link>

                

                {isLoggedIn ? (
                    <>
                        <span className="username" onClick={toggleDropdown}>
                            {username || 'Rudraksh'}
                        </span>
                        {isDropdownOpen && (
                            <div className="dropdown-menu">
                                <Link to="/profile">Account Information</Link>
                                
                               
                                
                                <button onClick={handleLogout}>Logout</button>
                            </div>
                        )}
                    </>
                ) : (
                    <Link to="/Signin">Sign In</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
