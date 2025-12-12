import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaUserFriends, FaUser, FaHandshake, FaHome } from "react-icons/fa";
import "../styles/Navbar.css";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className={`navbar ${open ? "open" : ""}`}>

      {/* LEFT LOGO */}
      <div className="nav-left">
        <img
          src="https://img.freepik.com/free-vector/business-user-shield_78370-7029.jpg"
          className="nav-logo"
          alt="logo"
        />
      </div>

      {/* CENTER — TWO ROW MENU */}
      <div className="nav-center">

        {/* FIRST ROW */}
        <div className="nav-row">
          <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <FaHome className="icon" />
            Dashboard
          </NavLink>

          <NavLink to="/admin/employees" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <FaUserFriends className="icon" />
            Employees
          </NavLink>

          <NavLink to="/admin/attendence" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <FaUser className="icon" />
            Attendance
          </NavLink>

          <NavLink to="/admin/leavemanagement" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <FaHandshake className="icon" />
            Leave
          </NavLink>

          <NavLink to="/admin/payroll" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <FaHandshake className="icon" />
            Payroll
          </NavLink>
        </div>

        {/* SECOND ROW */}
        <div className="nav-row">
          <NavLink to="/admin/asset" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <FaHandshake className="icon" />
            Assets
          </NavLink>

          <NavLink to="/admin/announce" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <FaHandshake className="icon" />
            Announce
          </NavLink>

          <NavLink to="/admin/recruit" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <FaHandshake className="icon" />
            Recriut
          </NavLink>

          <NavLink to="/admin/holidays" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <FaHandshake className="icon" />
            Holidays
          </NavLink>

          <NavLink to="/admin/settings" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <FaHandshake className="icon" />
            Settings
          </NavLink>
        </div>

      </div>

      {/* RIGHT BUTTONS */}
      <div className="nav-right">
        <button className="nav-btn login-btn">Login</button>
        <button className="nav-btn signup-btn">SignUp</button>

        <FaBars className="nav-toggle" onClick={() => setOpen(!open)} />
      </div>

    </nav>
  );
};

export default Navbar;
