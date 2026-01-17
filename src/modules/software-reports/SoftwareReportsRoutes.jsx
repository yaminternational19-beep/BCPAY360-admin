import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Dashboard
const Dashboard = lazy(() => import("./dashboard/Dashboard.jsx"));

// PF Forms Table
const PFFormsTable = lazy(() =>
  import("./govt-docs/pf/PFFormsTable.jsx")
);

// ESI Forms Table
const ESIFormsTable = lazy(() =>
  import("./govt-docs/esi/ESIFormsTable.jsx")
);

// Factory Act Forms Table
const FactoryActFormsTable = lazy(() =>
  import("./govt-docs/factory-act/FactoryActFormsTable.jsx")
);

// Other Forms Table
const OtherFormsTable = lazy(() =>
  import("./govt-docs/other/OtherFormsTable.jsx")
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

const LoadingFallback = () => (
  <div className="sr-loading">Loading...</div>
);

const SoftwareReportsRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route index element={<Navigate to="" replace />} />

        {/* Dashboard */}
        <Route path="" element={<Dashboard />} />

        {/* PF Forms */}
        <Route path="govt-docs/pf/forms" element={<PFFormsTable />} />

        {/* ESI Forms */}
        <Route path="govt-docs/esi/forms" element={<ESIFormsTable />} />

        {/* Factory Act Forms */}
        <Route path="govt-docs/factory-act/forms" element={<FactoryActFormsTable />} />

        {/* Other Forms */}
        <Route path="govt-docs/other/forms" element={<OtherFormsTable />} />

        {/* Reports */}
        <Route path="reports/employee" element={<EmployeeReports />} />
        <Route path="reports/attendance" element={<AttendanceReports />} />
        <Route path="reports/leave" element={<LeaveReports />} />
        <Route path="reports/salary" element={<SalaryReports />} />
        <Route path="reports/statutory" element={<StatutoryReports />} />
        <Route path="reports/yearly" element={<YearlyReports />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="" replace />} />
      </Routes>
    </Suspense>
  );
};

export default SoftwareReportsRoutes;
