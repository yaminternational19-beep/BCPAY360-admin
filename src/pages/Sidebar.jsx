import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaChevronDown,
  FaChevronRight,
  FaDatabase,
  FaBuilding,
  FaIdBadge,
  FaFileInvoiceDollar,
  FaBoxOpen,
  FaUserTie,
  FaBullhorn,
  FaCalendarAlt,
  FaCog,
} from "react-icons/fa";
import "../styles/Sidebar.css";

const Sidebar = ({ collapsed = false }) => {
  const [empOpen, setEmpOpen] = useState(true);
  const [metaOpen, setMetaOpen] = useState(false);

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">HRIS Admin</div>

      <nav className="sidebar-menu">
        <NavLink to="/admin/dashboard" className="menu-item">
          <FaHome />
          {!collapsed && <span>Dashboard</span>}
        </NavLink>

        <div
          className="menu-item expandable"
          onClick={() => !collapsed && setEmpOpen(!empOpen)}
        >
          <div className="menu-left">
            <FaUsers />
            {!collapsed && <span>Employee Management</span>}
          </div>
          {!collapsed && (empOpen ? <FaChevronDown /> : <FaChevronRight />)}
        </div>

        {empOpen && !collapsed && (
          <div className="submenu">
            <NavLink to="/admin/employees" className="submenu-item">
              Employees
            </NavLink>
            <NavLink to="/admin/attendence" className="submenu-item">
              Attendance
            </NavLink>
            <NavLink to="/admin/payroll" className="submenu-item">
              Payroll
            </NavLink>
            <NavLink to="/admin/leavemanagement" className="submenu-item">
              Leaves
            </NavLink>
            

            <div
              className="submenu-item expandable"
              onClick={() => setMetaOpen(!metaOpen)}
            >
              <FaDatabase />
              Metadata
              {metaOpen ? <FaChevronDown /> : <FaChevronRight />}
            </div>

            {metaOpen && (
              <div className="sub-submenu">
                <NavLink to="/admin/departments" className="submenu-item">
                  <FaBuilding /> Departments
                </NavLink>
                <NavLink to="/admin/designations" className="submenu-item">
                  <FaIdBadge /> Designations
                </NavLink>
                <NavLink to="/admin/asset" className="submenu-item">
                  <FaBoxOpen className="submenu-icon" />
                  Assets
                </NavLink>

                <NavLink to="/admin/recruit" className="submenu-item">
                  <FaUserTie className="submenu-icon" />
                  Recruit
                </NavLink>

                <NavLink to="/admin/announce" className="submenu-item">
                  <FaBullhorn className="submenu-icon" />
                  Announcements
                </NavLink>

                <NavLink to="/admin/holidays" className="submenu-item">
                  <FaCalendarAlt className="submenu-icon" />
                  Holidays
                </NavLink>

                <NavLink to="/admin/settings" className="submenu-item">
                  <FaCog className="submenu-icon" />
                  Settings
                </NavLink>

                

              </div>
            )}
          </div>
        )}

        <NavLink to="/admin/accounts" className="menu-item">
          <FaFileInvoiceDollar />
          {!collapsed && <span>Accounts</span>}
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;

