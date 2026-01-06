import React, { useState, useMemo } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";

import Login from "./pages/Login";
import RoleGate from "./pages/RoleGate";
import CodeVerify from "./pages/CodeVerify";
import SuperAdmin from "./pages/SuperAdmin";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import LeaveManagement from "./pages/LeaveManagement";
import PayrollManagement from "./pages/PayrollManagement";
import AssetManagement from "./pages/AssetManagement";
import AnnouncementModule from "./pages/AnnouncementModule";
import RecruitmentModule from "./pages/RecruitmentModule";
import HolidaysModule from "./pages/HolidaysModule";
import SettingsModule from "./pages/SettingsModule";
import Companies from "./pages/Companies";
import Accounts from "./pages/Accounts";
import Softwarereports from "./pages/Softwarereports";
import HRLogin from "./pages/HRLogin";

// New module imports
import SuperAdminRoutes from "./modules/super-admin";
import { BranchList, DepartmentDesignation, EmployeeTypeList, ShiftList, HRList, HRPermissions } from "./modules/organization";
import EmployeeList from "./modules/employee/pages/EmployeeList";
import EmployeeProfile from "./modules/employee/pages/EmployeeProfile";
import Sidebar from "./layout/Sidebar";
import Navbar from "./layout/Navbar";
import "./styles/Layout.css";
import PermissionProtectedRoute from "./components/PermissionProtectedRoute";


const RoleProtectedRoute = ({ children, allowedRoles, user }) => {
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const AdminLayout = ({ user, setUser }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  if (!user || !user.verified || !user.role) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = user.role === "COMPANY_ADMIN";
  const isHR = user.role === "HR";

  // const adminOnlyRoutes = [
  //   "/admin/departments",
  //   "/admin/employee-types",
  //   "/admin/shifts",
  //   "/admin/branches",
  //   "/admin/hr-management",
  //   "/admin/accounting",
  //   "/admin/softwarereports",
  //   "/admin/companies",
  //   "/admin/asset",
  //   "/admin/announce",
  //   "/admin/holidays",
  //   "/admin/settings",
  // ];

  // const currentPath = location.pathname;
  // if (!isAdmin && adminOnlyRoutes.some((route) => currentPath.startsWith(route))) {
  //   return <Navigate to="/admin/dashboard" replace />;
  // }

  const logout = () => {
    localStorage.removeItem("auth_user");
    setUser(null);
  };

  return (
    <div className="app-root">
      <Sidebar collapsed={collapsed} user={user} />

      <div className={`main ${collapsed ? "collapsed" : ""}`}>
        <Navbar
          user={user}
          onToggleSidebar={() => setCollapsed((prev) => !prev)}
          onLogout={logout}
        />

        <main className="app-content">
          <Routes>
            <Route path="dashboard" element={<Dashboard user={user} />} />
            <Route
              path="employees"
              element={
                <PermissionProtectedRoute
                  user={user}
                  permissions={JSON.parse(localStorage.getItem("hr_permissions") || "[]")}
                  moduleKey="EMPLOYEE_MASTER"
                >
                  <EmployeeList />
                </PermissionProtectedRoute>
              }
            />

            <Route
              path="attendance"
              element={
                <PermissionProtectedRoute
                  user={user}
                  permissions={JSON.parse(localStorage.getItem("hr_permissions") || "[]")}
                  moduleKey="ATTENDANCE"
                >
                  <Attendance />
                </PermissionProtectedRoute>
              }
            />

            <Route
              path="leavemanagement"
              element={
                <PermissionProtectedRoute
                  user={user}
                  permissions={JSON.parse(localStorage.getItem("hr_permissions") || "[]")}
                  moduleKey="LEAVE_MASTER"
                >
                  <LeaveManagement />
                </PermissionProtectedRoute>
              }
            />

            <Route
              path="payroll"
              element={
                <PermissionProtectedRoute
                  user={user}
                  permissions={JSON.parse(localStorage.getItem("hr_permissions") || "[]")}
                  moduleKey="PAYROLL"
                >
                  <PayrollManagement />
                </PermissionProtectedRoute>
              }
            />


            <Route
              path="recruit"
              element={
                <PermissionProtectedRoute
                  user={user}
                  permissions={JSON.parse(localStorage.getItem("hr_permissions") || "[]")}
                  moduleKey="RECRUITMENT"
                >
                  <RecruitmentModule />
                </PermissionProtectedRoute>
              }
            />

            <Route
              path="departments"
              element={
                <RoleProtectedRoute allowedRoles={["COMPANY_ADMIN"]} user={user}>
                  <DepartmentDesignation user={user} />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="employee-types"
              element={
                <RoleProtectedRoute allowedRoles={["COMPANY_ADMIN"]} user={user}>
                  <EmployeeTypeList user={user} />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="shifts"
              element={
                <RoleProtectedRoute allowedRoles={["COMPANY_ADMIN"]} user={user}>
                  <ShiftList user={user} />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="branches"
              element={
                <RoleProtectedRoute allowedRoles={["COMPANY_ADMIN"]} user={user}>
                  <BranchList user={user} />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="hr/:hrId/permissions"
              element={
                <RoleProtectedRoute allowedRoles={["COMPANY_ADMIN"]} user={user}>
                  <HRPermissions user={user} />
                </RoleProtectedRoute>
              }
            />


            <Route
              path="companies"
              element={
                <RoleProtectedRoute allowedRoles={["COMPANY_ADMIN"]} user={user}>
                  <Companies user={user} />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="asset"
              element={
                <PermissionProtectedRoute
                  user={user}
                  permissions={JSON.parse(localStorage.getItem("hr_permissions") || "[]")}
                  moduleKey="ASSET"
                  adminOverride
                >
                  <AssetManagement />
                </PermissionProtectedRoute>
              }
            />

            <Route
              path="announce"
              element={
                <PermissionProtectedRoute
                  user={user}
                  permissions={JSON.parse(localStorage.getItem("hr_permissions") || "[]")}
                  moduleKey="ANNOUNCE"
                  adminOverride
                >
                  <AnnouncementModule />
                </PermissionProtectedRoute>
              }
            />

            <Route
              path="holidays"
              element={
                <PermissionProtectedRoute
                  user={user}
                  permissions={JSON.parse(localStorage.getItem("hr_permissions") || "[]")}
                  moduleKey="HOLIDAYS"
                  adminOverride
                >
                  <HolidaysModule />
                </PermissionProtectedRoute>
              }
            />

            <Route
              path="settings"
              element={
                <RoleProtectedRoute allowedRoles={["COMPANY_ADMIN"]} user={user}>
                  <SettingsModule />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="accounting"
              element={
                <RoleProtectedRoute allowedRoles={["COMPANY_ADMIN"]} user={user}>
                  <Accounts />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="softwarereports"
              element={
                <RoleProtectedRoute allowedRoles={["COMPANY_ADMIN"]} user={user}>
                  <Softwarereports />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="hr-management"
              element={
                <RoleProtectedRoute allowedRoles={["COMPANY_ADMIN"]} user={user}>
                  <HRList />
                </RoleProtectedRoute>
              }
            />
            <Route path="employees/:id" element={<EmployeeProfile />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  const initialUser = useMemo(() => {
    const saved = localStorage.getItem("auth_user");
    return saved ? JSON.parse(saved) : null;
  }, []);

  const [user, setUser] = useState(initialUser);
  const handle_login = (user) => {
    setUser(user);
  };

  return (
    <ToastProvider>
      <BrowserRouter basename="/admin">
        <Routes>
          <Route path="/login" element={<Login onLogin={setUser} />} />
          <Route path="/super-admin/login" element={<SuperAdmin />} />
          <Route path="/super-admin/*" element={<SuperAdminRoutes />} />
          <Route path="/role" element={<RoleGate />} />
          <Route path="/verify" element={<CodeVerify onVerify={setUser} />} />
          <Route
            path="/*"
            element={<AdminLayout user={user} setUser={setUser} />}
          />

          <Route
            path="/hr/login"
            element={<HRLogin on_login={handle_login} />}
          />


          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
