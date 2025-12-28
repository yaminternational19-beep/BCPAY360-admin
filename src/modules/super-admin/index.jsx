import { Routes, Route, Navigate } from "react-router-dom";
import SuperAdminLayout from "./pages/SuperAdminLayout";
import Dashboard from "./pages/Dashboard";
import CreateCompany from "./pages/CreateCompany";
import CreateCompanyAdmin from "./pages/CreateCompanyAdmin";
import CompanyDetails from "./pages/CompanyDetails";

export default function SuperAdminRoutes() {
  // 🔐 Super Admin guard
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/super-admin/login" replace />;
  }


  return (
    <Routes>
      <Route element={<SuperAdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="create-company" element={<CreateCompany />} />
        <Route path="create-admin" element={<CreateCompanyAdmin />} />
        <Route path="company/:id" element={<CompanyDetails />} />

        {/* DEFAULT */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
}

