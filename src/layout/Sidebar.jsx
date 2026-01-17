import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { hasPermission } from "../utils/permissions.js";
import {
  FaHome,
  FaUsers,
  FaChevronDown,
  FaChevronRight,
  FaBuilding,
  FaIdCard,
  FaClock,
  FaUmbrellaBeach,
  FaMoneyBillWave,
  FaUserTie,
  FaFileInvoiceDollar,
  FaChartLine,
  FaUserTag,
  FaBusinessTime,
} from "react-icons/fa";
import "../styles/Sidebar.css";

const VALID_ROUTES = [
  "dashboard",
  "employees",
  "attendance",
  "leavemanagement",
  "payroll",
  "asset",
  "announce",
  "recruit",
  "holidays",
  "settings",
  "companies",
  "departments",
  "employee-types",
  "shifts",
  "branches",
  "employee",
  "accounting",
  "softwarereports",
  "hr-management",
  "organization",
];

const Sidebar = ({ collapsed = false, mobileOpen = false, onCloseMobile, user: userProp }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(userProp || null);

  useEffect(() => {
    if (userProp) {
      setUser(userProp);
    } else {
      const authUser = localStorage.getItem("auth_user");
      if (authUser) {
        try {
          setUser(JSON.parse(authUser));
        } catch (e) {
          setUser(null);
        }
      }
    }
  }, [userProp]);

  const isAdmin = user?.role === "COMPANY_ADMIN";
  const isHR = user?.role === "HR";

  const [orgOpen, setOrgOpen] = useState(false);
  const [hrOpen, setHrOpen] = useState(true);
  const [accountOpen, setAccountOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
  const [govtDocsOpen, setGovtDocsOpen] = useState(false);
  const [pfOpen, setPfOpen] = useState(false);
  const [esiOpen, setEsiOpen] = useState(false);
  const [factoryOpen, setFactoryOpen] = useState(false);
  const [otherGovtOpen, setOtherGovtOpen] = useState(false);
  const [reportsSubOpen, setReportsSubOpen] = useState(false);

  const isValidRoute = (path) => {
    const clean = path.replace(/^\/admin\//, "").split("/")[0];
    return VALID_ROUTES.includes(clean);
  };

  const go = (path) => {
    const cleanPath = path.replace(/^\/admin\//, "");
    const targetRoute = isValidRoute(cleanPath)
      ? `/${cleanPath}`
      : "/dashboard";

    navigate(targetRoute);
    onCloseMobile?.();
  };


  const safeToggle = (setter, value) => {
    if (collapsed) return;
    setter(value);
  };

  const hrPermissions =
    user?.role === "HR"
      ? JSON.parse(localStorage.getItem("hr_permissions") || "[]")
      : [];

  const canAccess = (moduleKey, action = "view") => {
    if (user?.role === "COMPANY_ADMIN") return true;
    if (user?.role !== "HR") return false;

    return hasPermission(hrPermissions, moduleKey, action);
  };  



  return (
    <aside
      className={`sidebar ${collapsed ? "collapsed" : ""} ${
        mobileOpen ? "mobile-open" : ""
      }`}
    >
      <nav className="sidebar-menu">
        <button
          type="button"
          className="menu-item"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            go("dashboard");
          }}
        >
          <FaHome />
          {!collapsed && <span>Dashboard</span>}
        </button>

        {isAdmin && (
          <>
            <button
              type="button"
              className="menu-item expandable"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                safeToggle(setOrgOpen, !orgOpen);
              }}
            >
              <div className="menu-left">
                <FaBuilding />
                {!collapsed && <span>Organization</span>}
              </div>
              {!collapsed && (orgOpen ? <FaChevronDown /> : <FaChevronRight />)}
            </button>

            {orgOpen && !collapsed && (
              <div className="submenu">
                <button
                  type="button"
                  className="submenu-item"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    go("departments");
                  }}
                >
                  <FaBuilding /> Departments
                </button>
                <button
                  type="button"
                  className="submenu-item"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    go("employee-types");
                  }}
                >
                  <FaUserTag /> Employee Types
                </button>
                <button
                  type="button"
                  className="submenu-item"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    go("shifts");
                  }}
                >
                  <FaBusinessTime /> Shifts
                </button>
                <button
                  type="button"
                  className="submenu-item"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    go("branches");
                  }}
                >
                  <FaBuilding /> Branches
                </button>
                <button
                  type="button"
                  className="submenu-item"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    go("hr-management");
                  }}
                >
                  <FaIdCard /> Add HR
                </button>
                <button
                  type="button"
                  className="submenu-item"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    go("organization/emp-code");
                  }}
                >
                  <FaIdCard /> Employee Code
                </button>
                {/* HR Permissions route requires hrId parameter - access via HR management page */}
              </div>
            )}
          </>
        )}

        {(isAdmin || isHR) && (
          <>
            <button
              type="button"
              className="menu-item expandable"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                safeToggle(setHrOpen, !hrOpen);
              }}
            >
              <div className="menu-left">
                <FaUsers />
                {!collapsed && <span>HR Module</span>}
              </div>
              {!collapsed && (hrOpen ? <FaChevronDown /> : <FaChevronRight />)}
            </button>

            {hrOpen && !collapsed && (
              <div className="submenu">
                {canAccess("EMPLOYEE_MASTER") && (
                    <button
                      type="button"
                      className="submenu-item"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        go("employees");
                      }}
                    >
                      <FaUsers /> Employees
                    </button>
                  )}


                {canAccess("ATTENDANCE") && (
                  <button
                    type="button"
                    className="submenu-item"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      go("attendance");
                    }}
                  >
                    <FaClock /> Attendance
                  </button>
                )}

                {canAccess("LEAVE_MASTER") && (
                  <button
                    type="button"
                    className="submenu-item"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      go("leavemanagement");
                    }}
                  >
                    <FaUmbrellaBeach /> Leaves
                  </button>
                )}

                {canAccess("PAYROLL") && (
                  <button
                    type="button"
                    className="submenu-item"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      go("payroll");
                    }}
                  >
                    <FaMoneyBillWave /> Payroll
                  </button>
                )}

                {canAccess("RECRUITMENT") && (
                  <button
                    type="button"
                    className="submenu-item"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      go("recruit");
                    }}
                  >
                    <FaUserTie /> Recruitment
                  </button>
                )}


              </div>
            )}
          </>
        )}

        {isAdmin && (
          <>
            <button
              type="button"
              className="menu-item expandable"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                safeToggle(setAccountOpen, !accountOpen);
              }}
            >
              <div className="menu-left">
                <FaFileInvoiceDollar />
                {!collapsed && <span>Accounts</span>}
              </div>
              {!collapsed &&
                (accountOpen ? <FaChevronDown /> : <FaChevronRight />)}
            </button>

            {accountOpen && !collapsed && (
              <div className="submenu">
                <button
                  type="button"
                  className="submenu-item"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    go("accounting");
                  }}
                >
                  <FaFileInvoiceDollar /> Accounting
                </button>
              </div>
            )}

            <button
              type="button"
              className="menu-item expandable"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                safeToggle(setReportsOpen, !reportsOpen);
              }}
            >
              <div className="menu-left">
                <FaChartLine />
                {!collapsed && <span>Software Reports</span>}
              </div>
              {!collapsed &&
                (reportsOpen ? <FaChevronDown /> : <FaChevronRight />)}
            </button>

            {reportsOpen && !collapsed && (
              <div className="submenu">
                {/* Dashboard */}
                <button
                  type="button"
                  className="submenu-item"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    go("softwarereports");
                  }}
                >
                  📊 Dashboard
                </button>

                {/* Govt Docs */}
                <div className="submenu-section">
                  <button
                    type="button"
                    className="submenu-header"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      safeToggle(setGovtDocsOpen, !govtDocsOpen);
                    }}
                  >
                    <span>📄 Government Forms</span>
                    {!collapsed &&
                      (govtDocsOpen ? <FaChevronDown /> : <FaChevronRight />)}
                  </button>

                  {govtDocsOpen && (
                    <div className="submenu-nested">
                      {/* PF */}
                      <button
                        type="button"
                        className="submenu-header-nested"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          safeToggle(setPfOpen, !pfOpen);
                        }}
                      >
                        <span>PF Forms</span>
                        {pfOpen ? <FaChevronDown /> : <FaChevronRight />}
                      </button>
                      {pfOpen && (
                        <div className="submenu-nested-items">
                          <button
                            type="button"
                            className="submenu-item-nested"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              go("softwarereports/govt-docs/pf/forms");
                            }}
                          >
                            All Forms
                          </button>
                        </div>
                      )}

                      {/* ESI */}
                      <button
                        type="button"
                        className="submenu-header-nested"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          safeToggle(setEsiOpen, !esiOpen);
                        }}
                      >
                        <span>ESI Forms</span>
                        {esiOpen ? <FaChevronDown /> : <FaChevronRight />}
                      </button>
                      {esiOpen && (
                        <div className="submenu-nested-items">
                          <button
                            type="button"
                            className="submenu-item-nested"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              go("softwarereports/govt-docs/esi/forms");
                            }}
                          >
                            All Forms
                          </button>
                        </div>
                      )}

                      {/* Factory Act */}
                      <button
                        type="button"
                        className="submenu-header-nested"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          safeToggle(setFactoryOpen, !factoryOpen);
                        }}
                      >
                        <span>Factory Act</span>
                        {factoryOpen ? <FaChevronDown /> : <FaChevronRight />}
                      </button>
                      {factoryOpen && (
                        <div className="submenu-nested-items">
                          <button
                            type="button"
                            className="submenu-item-nested"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              go("softwarereports/govt-docs/factory-act/forms");
                            }}
                          >
                            All Forms
                          </button>
                        </div>
                      )}

                      {/* Other Forms */}
                      <button
                        type="button"
                        className="submenu-header-nested"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          safeToggle(setOtherGovtOpen, !otherGovtOpen);
                        }}
                      >
                        <span>Other Forms</span>
                        {otherGovtOpen ? <FaChevronDown /> : <FaChevronRight />}
                      </button>
                      {otherGovtOpen && (
                        <div className="submenu-nested-items">
                          <button
                            type="button"
                            className="submenu-item-nested"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              go("softwarereports/govt-docs/other/forms");
                            }}
                          >
                            All Forms
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Reports */}
                <div className="submenu-section">
                  <button
                    type="button"
                    className="submenu-header"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      safeToggle(setReportsSubOpen, !reportsSubOpen);
                    }}
                  >
                    <span>📊 Reports</span>
                    {!collapsed &&
                      (reportsSubOpen ? <FaChevronDown /> : <FaChevronRight />)}
                  </button>

                  {reportsSubOpen && (
                    <div className="submenu-nested">
                      <button
                        type="button"
                        className="submenu-item-nested"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          go("softwarereports/reports/employee");
                        }}
                      >
                        Employee Reports
                      </button>
                      <button
                        type="button"
                        className="submenu-item-nested"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          go("softwarereports/reports/attendance");
                        }}
                      >
                        Attendance Reports
                      </button>
                      <button
                        type="button"
                        className="submenu-item-nested"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          go("softwarereports/reports/leave");
                        }}
                      >
                        Leave Reports
                      </button>
                      <button
                        type="button"
                        className="submenu-item-nested"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          go("softwarereports/reports/salary");
                        }}
                      >
                        Salary Reports
                      </button>
                      <button
                        type="button"
                        className="submenu-item-nested"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          go("softwarereports/reports/statutory");
                        }}
                      >
                        Statutory Reports
                      </button>
                      <button
                        type="button"
                        className="submenu-item-nested"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          go("softwarereports/reports/yearly");
                        }}
                      >
                        Yearly Reports
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
