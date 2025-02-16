import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaDumbbell } from "react-icons/fa"; // ✅ Import the dumbbell icon
import { AuthContext } from '../Context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { isLoggedIn, signOut, username } = useContext(AuthContext);

    const handleLogout = () => {
        signOut();
        setIsDropdownOpen(false);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">
                    <FaDumbbell className="logo-icon" /> FLEX IT OUT
                </Link>
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
