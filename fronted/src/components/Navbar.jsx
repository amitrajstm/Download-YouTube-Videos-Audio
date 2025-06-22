// // src/components/Navbar.jsx
// import React from "react";
// import { Link } from "react-router-dom";

// export default function Navbar() {
//   return (
//     <nav className="navbar">
//       <div className="nav-logo">Y</div>
//       <ul className="nav-links">
//         <li>
//           <Link to="/">Home</Link>
//         </li>
//         <li>
//           <Link to="/result">Results</Link>
//         </li>
//       </ul>
//     </nav>
//   );
// }
// src/components/Navbar.jsx

// import React, { useState } from "react";
// import SearchBar from "./SearchBar";
// import {
//   FaAirbnb,
//   FaSearch,
//   FaUserCircle,
//   FaUser,
//   FaSignOutAlt,
//   FaSignInAlt,
// } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import "./Navbar.css";

// export default function Navbar() {
//   const navigate = useNavigate();
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/result?url=${encodeURIComponent(searchQuery.trim())}`);
//     }
//   };

//   return (
//     <nav className="custom-navbar">
//       <div className="navbar-left" onClick={() => navigate("/")}>
//         <FaAirbnb className="logo-icon" />
//         <span className="brand">Home </span>
//       </div>
//       <form className="navbar-search" onSubmit={handleSearchSubmit}>
//         <input
//           className="search-inp"
//           type="text"
//           placeholder="Search keywords or paste video link here"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />

//         <button className="clear-btn" onClick={handleClear}>
//           <FaTimes />
//         </button>

//         <button className="paste-btn" onClick={handlePaste}>
//           <FaPaste />
//         </button>
//         <button className="search-btn" type="submit">
//           Search
//         </button>
//       </form>
//       {/* <SearchBar></SearchBar> */}
//       <div className="navbar-right">
//         <div
//           className="user-icon-wrapper"
//           onClick={() => setDropdownOpen((prev) => !prev)}
//         >
//           <FaUserCircle className="user-icon" />
//         </div>
//         {dropdownOpen && (
//           <div className="dropdown-menu">
//             <div className="dropdown-header">
//               <FaUser /> Amit Raj
//             </div>
//             <div className="dropdown-item" onClick={() => navigate("#")}>
//               <FaUser /> Profile
//             </div>
//             <div className="dropdown-item" onClick={() => navigate("/#")}>
//               <FaSignOutAlt /> Logout
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// }
import React, { useState } from "react";
import {
  FaAirbnb,
  FaUserCircle,
  FaUser,
  FaSignOutAlt,
  FaPaste,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/result?url=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleClear = () => setSearchQuery("");

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!searchQuery.trim()) setSearchQuery(text);
    } catch {
      alert("Failed to read clipboard content");
    }
  };

  const handleInputFocus = async () => {
    if (!searchQuery.trim()) {
      try {
        const text = await navigator.clipboard.readText();
        setSearchQuery(text);
      } catch (err) {
        console.error("Clipboard read failed", err);
      }
    }
  };

  return (
    <nav className="custom-navbar">
      <div className="navbar-left" onClick={() => navigate("/")}>
        <FaAirbnb className="logo-icon" />  
        <span className="brand">Home</span>
      </div>
      <form className="navbar-search" onSubmit={handleSearchSubmit}>
        <input
          className="search-inp"
          type="text"
          placeholder="Search keywords or paste video link here"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={handleInputFocus}
        />
        {searchQuery ? (
          <button type="button" className="clear-btn" onClick={handleClear}>
            <FaTimes />
          </button>
        ) : (
          <button type="button" className="paste-btn" onClick={handlePaste}>
            <FaPaste />
          </button>
        )}
        <button className="search-btn" type="submit">
          Search
        </button>
      </form>
      <div className="navbar-right">
        <div
          className="user-icon-wrapper"
          onClick={() => setDropdownOpen((prev) => !prev)}
        >
          <FaUserCircle className="user-icon" />
        </div>
        {dropdownOpen && (
          <div className="dropdown-menu">
            <div className="dropdown-header">
              <FaUser /> Amit Raj
            </div>
            <div className="dropdown-item" onClick={() => navigate("#")}>
              Profile
            </div>
            <div className="dropdown-item" onClick={() => navigate("/#")}>
              Logout
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
