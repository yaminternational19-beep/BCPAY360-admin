import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import "../styles/Navbar.css";

const Navbar = ({ onToggleSidebar }) => {
  return (
    <header className="navbar">
      <div className="nav-left">
        <button className="icon-btn" onClick={onToggleSidebar}>
          <FaBars />
        </button>
        <span className="nav-title">HRIS Admin Panel</span>
      </div>

      <div className="nav-right">
        <button className="nav-btn login-btn">Login</button>
        <button className="nav-btn signup-btn">Sign Up</button>
      </div>
    </header>
  );
};

export default Navbar;
