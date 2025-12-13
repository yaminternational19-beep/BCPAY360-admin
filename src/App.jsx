import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import EmployeePanel from "./pages/EmployeePanel";
import Attendance from "./pages/Attendance";
import LeaveManagement from "./pages/LeaveManagement";
import PayrollManagement from "./pages/PayrollManagement";
import AssetManagement from "./pages/AssetManagement";
import AnnouncementModule from "./pages/AnnouncementModule";
import RecruitmentModule from "./pages/RecruitmentModule";
import HolidaysModule from "./pages/HolidaysModule";
import SettingsModule from "./pages/SettingsModule";

import Sidebar from "./pages/Sidebar";
import Navbar from "./pages/Navbar";
import "./styles/Layout.css";

const App = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <BrowserRouter>
      <Navbar onToggleSidebar={() => setCollapsed(!collapsed)} />
      <Sidebar collapsed={collapsed} />

      <main className={`app-content ${collapsed ? "collapsed" : ""}`}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/employees" element={<EmployeePanel />} />
          <Route path="/admin/attendence" element={<Attendance />} />
          <Route path="/admin/leavemanagement" element={<LeaveManagement />} />
          <Route path="/admin/payroll" element={<PayrollManagement />} />
          <Route path="/admin/asset" element={<AssetManagement />} />
          <Route path="/admin/announce" element={<AnnouncementModule />} />
          <Route path="/admin/recruit" element={<RecruitmentModule />} />
          <Route path="/admin/holidays" element={<HolidaysModule />} />
          <Route path="/admin/settings" element={<SettingsModule />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
