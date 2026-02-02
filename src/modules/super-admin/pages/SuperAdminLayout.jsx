import { Outlet, NavLink } from "react-router-dom";
import "../styles/theme.css";
import "../styles/SuperAdminLayout.css";
import "../styles/superadmin.css";

export default function SuperAdminLayout() {
  const logout = () => {
    localStorage.clear();
    window.location.replace("/admin/login");
  };

  return (
    <div className="sa-layout">
      <aside className="sa-sidebar">
        <h2 className="sa-gradient-text" style={{ padding: "0 20px", marginBottom: "30px" }}>Super Admin</h2>

        <NavLink to="/super-admin/dashboard" className={({ isActive }) => isActive ? "sa-active" : ""}>Dashboard</NavLink>
        <NavLink to="/super-admin/create-company" className={({ isActive }) => isActive ? "sa-active" : ""}>Create Company</NavLink>
        <NavLink to="/super-admin/create-admin" className={({ isActive }) => isActive ? "sa-active" : ""}>Create Admin</NavLink>

        <button onClick={logout} className="logout-btn sa-btn sa-btn-primary" style={{ margin: "20px auto", width: "80%" }}>Logout</button>
      </aside>

      <main className="sa-content">
        <Outlet />
      </main>
    </div>
  );
}
