import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Dashboard
const Dashboard = lazy(() => import("./dashboard/Dashboard.jsx"));

// Unified Government Forms
const GovernmentForms = lazy(() =>
  import("./pages/GovernmentForms.jsx")
);

// Reports
const EmployeeReports = lazy(() =>
  import("./reports/employee/EmployeeReports.jsx")
);
const AttendanceReports = lazy(() =>
  import("./reports/attendance/AttendanceReports.jsx")
);
const LeaveReports = lazy(() =>
  import("./reports/leave/LeaveReports.jsx")
);
const SalaryReports = lazy(() =>
  import("./reports/salary/SalaryReports.jsx")
);
const StatutoryReports = lazy(() =>
  import("./reports/statutory/StatutoryReports.jsx")
);
const YearlyReports = lazy(() =>
  import("./reports/yearly/YearlyReports.jsx")
);

// Statutory Forms Module
const FormsRoutes = lazy(() => import("../forms/FormsRouter"));

const LoadingFallback = () => (
  <div className="sr-loading">Loading...</div>
);

const SoftwareReportsRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Dashboard */}
        <Route index element={<Dashboard />} />

        {/* Unified Government Forms */}
        <Route path="government-forms" element={<GovernmentForms />} />

        {/* Reports */}
        <Route path="reports/employee" element={<EmployeeReports />} />
        <Route path="reports/attendance" element={<AttendanceReports />} />
        <Route path="reports/leave" element={<LeaveReports />} />
        <Route path="reports/salary" element={<SalaryReports />} />
        <Route path="reports/statutory" element={<StatutoryReports />} />
        <Route path="reports/yearly" element={<YearlyReports />} />

        {/* Reorganized Statutory Forms */}
        <Route path="forms/*" element={<FormsRoutes />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/softwarereports" replace />} />
      </Routes>
    </Suspense>
  );
};

export default SoftwareReportsRoutes;
