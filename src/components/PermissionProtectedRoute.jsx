import { Navigate } from "react-router-dom";
import { hasPermission } from "../utils/permissions.js";

export default function PermissionProtectedRoute({
  user,
  permissions,
  moduleKey,
  action = "view",
  children,
}) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Company Admin: full access
  if (user.role === "COMPANY_ADMIN") {
    return children;
  }

  // HR without permission
  if (user.role === "HR") {
    const allowed = hasPermission(permissions, moduleKey, action);
    if (!allowed) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return children;
  }

  // Fallback
  return <Navigate to="/login" replace />;
}
