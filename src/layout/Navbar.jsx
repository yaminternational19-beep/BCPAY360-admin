import React, { useState, useEffect } from "react";
import { FaBars, FaBell, FaSearch, FaSignOutAlt, FaCommentDots } from "react-icons/fa";
import "../styles/Navbar.css";

const Navbar = ({ user, onToggleSidebar, onLogout }) => {
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const email = user.email || "";
  // User role display
  const roleLabel = user.role === "COMPANY_ADMIN" ? "Admin" : "HR Manager";
  const userName = email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1);

  useEffect(() => {
    const close = (e) => {
      if (!e.target.closest(".user-profile-trigger") && !e.target.closest(".profile-menu")) {
        setOpen(false);
      }
    };
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const handleLogoutAction = (e) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.removeItem("auth_user");
    onLogout();
  };

  return (
    <header className="navbar">
      <div className="nav-left">
        <button
          type="button"
          className="icon-btn"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleSidebar();
          }}
        >
          <FaBars />
        </button>

        <div className="breadcrumb">
          <span className="page-title">Dashboard</span>
        </div>
      </div>

      <div className="nav-right">
        <div className="nav-utility-icons">
          <button className="utility-btn">
            <FaCommentDots />
          </button>
          <button className="utility-btn has-badge">
            <FaBell />
          </button>
        </div>

        <div className="user-section">
          <div className="user-profile-trigger" onClick={() => setOpen(!open)}>
            <div className="user-details">
              <span className="user-name">{userName}</span>
              <span className="user-role">{roleLabel}</span>
            </div>
            <div className="avatar-small">
              <img src={`https://ui-avatars.com/api/?name=${userName}&background=10b981&color=fff`} alt="User" />
            </div>
          </div>

          {open && (
            <div className="profile-menu">
              <div className="profile-info">
                <strong>{user.email || "—"}</strong>
                <small>{user.company || "HR Management"}</small>
              </div>

              <button
                type="button"
                className="logout-btn"
                onClick={handleLogoutAction}
              >
                <FaSignOutAlt style={{ marginRight: '8px' }} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
