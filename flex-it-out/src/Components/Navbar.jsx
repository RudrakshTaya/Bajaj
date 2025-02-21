// import React, { useState, useContext } from "react";
// import { Link } from "react-router-dom";
// import { GiBiceps } from "react-icons/gi";
// import { AuthContext } from "../Context/AuthContext";
// import "./Navbar.css";

// const Navbar = () => {
//     const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//     const { isLoggedIn, signOut, username } = useContext(AuthContext);

    

//     const handleLogout = () => {
       
//         signOut();
//         setIsDropdownOpen(false);
//     };

//     const toggleDropdown = () => {
//         setIsDropdownOpen(!isDropdownOpen);
//     };

//     return (
//         <nav className="navbar">
//             <div className="navbar-brand">
//                 <Link to="/">
//                     <GiBiceps className="logo-icon" /> FLEX IT OUT
//                 </Link>
//             </div>
//             <div className="nav-links">
//                 <Link to="/workout">Workout</Link>
//                 <Link to="/leaderboard">Leaderboard</Link>

//                 {isLoggedIn ? (
//                     <>
//                         <span className="username" onClick={toggleDropdown}>
//                             {username || "User"}
//                         </span>
//                         {isDropdownOpen && (
//                             <div className="dropdown-menu">
//                                 <Link to="/profile">Account Information</Link>
//                                 <button onClick={handleLogout}>Logout</button>
//                             </div>
//                         )}
//                     </>
//                 ) : (
//                     <Link to="/Signin">Sign In</Link>
//                 )}
//             </div>
//         </nav>
//     );
// };

// export default Navbar;



import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { GiBiceps } from "react-icons/gi";
import { AuthContext } from "../Context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { isLoggedIn, signOut, username } = useContext(AuthContext);

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
                        <span className="username" onClick={toggleDropdown}>
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
