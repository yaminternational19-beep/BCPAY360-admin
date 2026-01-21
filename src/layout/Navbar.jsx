import React, { useEffect, useState } from "react";
import { FaBars, FaChevronDown } from "react-icons/fa";
import "../styles/Navbar.css";

const Navbar = ({ user, onToggleSidebar, onLogout }) => {
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const email = user.email || "";
  const initials = email ? email.slice(0, 2).toUpperCase() : "U";
  const companyName = user.company || "Company Portal";
  const unitName = user.unit || user.branch || "";
  const displayTitle = unitName ? `${companyName} – ${unitName} ` : companyName;

  useEffect(() => {
    const close = (e) => {
      if (!e.target.closest(".profile") && !e.target.closest(".profile-menu")) {
        setOpen(false);
      }
    };
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

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

        <span className="nav-title">{displayTitle} Admin</span>
      </div>

      <div className="nav-right">
        <button
          type="button"
          className="profile"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen(!open);
          }}
        >
          <div className="avatar">{initials}</div>
          <span className="email">{user.email || ""}</span>
          <FaChevronDown />
        </button>

        {open && (
          <div className="profile-menu">
            <div className="profile-info">
              <strong>{user.email || "—"}</strong>
              <small>{companyName}</small>
            </div>

            <button
              type="button"
              className="logout-btn"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                localStorage.removeItem("auth_user");
                onLogout();
              }}
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
