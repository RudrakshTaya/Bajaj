import React, { useState, useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { GiBiceps } from "react-icons/gi";
import { FaBell } from "react-icons/fa";
import { AuthContext } from "../Context/AuthContext";
import axios from "axios";
import "./Navbar.css";

const API_URL =
  import.meta.env.VITE_API_URL_PRODUCTION && import.meta.env.VITE_API_URL_TESTING
    ? (import.meta.env.MODE === "production"
      ? import.meta.env.VITE_API_URL_PRODUCTION
      : import.meta.env.VITE_API_URL_TESTING)
    : "http://localhost:5001";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [invites, setInvites] = useState([]);
  const { isLoggedIn, signOut, username } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);

  const toggleNotifications = async () => {
    if (!notificationsOpen) {
      try {
        const response = await axios.get(`${API_URL}/api/challenges/invites`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInvites(response.data);
      } catch (error) {
        console.error("Error fetching invites:", error);
      }
    }
    setNotificationsOpen(!notificationsOpen);
  };

  const handleLogout = () => {
    signOut();
    setIsDropdownOpen(false);
    setMenuOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleAcceptInvite = async (inviteId) => {
    try {
      await axios.post(
        `${API_URL}/api/challenges/accept`,
        { inviteId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInvites(invites.filter((invite) => invite._id !== inviteId));
    } catch (error) {
      console.error("Error accepting invite:", error);
    }
  };

  const handleRejectInvite = async (inviteId) => {
    try {
      await axios.post(
        `${API_URL}/api/challenges/reject`,
        { inviteId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInvites(invites.filter((invite) => invite._id !== inviteId));
    } catch (error) {
      console.error("Error rejecting invite:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <GiBiceps className="logo-icon" /> FLEX IT OUT
        </Link>
      </div>

      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        <Link to="/workout" onClick={() => setMenuOpen(false)}>Workout</Link>
        <Link to="/leaderboard" onClick={() => setMenuOpen(false)}>Leaderboard</Link>

        {isLoggedIn ? (
          <>
            {/* Notification Bell */}
            <div className="notifications" onClick={toggleNotifications} ref={notificationsRef}>
              <FaBell className="notification-icon" />
              {invites.length > 0 && <span className="notification-badge">{invites.length}</span>}
              {notificationsOpen && (
                <div className="notifications-dropdown">
                  <h4>Invites</h4>
                  {invites.length > 0 ? (
                    invites.map((invite) => (
                      <div key={invite._id} className="invite-item">
                        <span>{invite.senderName} invited you</span>
                        <button className="accept-btn" onClick={() => handleAcceptInvite(invite._id)}>Accept</button>
                        <button className="reject-btn" onClick={() => handleRejectInvite(invite._id)}>Reject</button>
                      </div>
                    ))
                  ) : (
                    <p>No new invites</p>
                  )}
                </div>
              )}
            </div>

            {/* Username Dropdown */}
            <span className="username" onClick={toggleDropdown} ref={dropdownRef}>
              {username || "User"}
            </span>
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/profile" onClick={() => setMenuOpen(false)}>Account Information</Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </>
        ) : (
          <Link to="/Signin" onClick={() => setMenuOpen(false)}>Sign In</Link>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className={`menu-toggle ${menuOpen ? "active" : ""}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
};

export default Navbar;
