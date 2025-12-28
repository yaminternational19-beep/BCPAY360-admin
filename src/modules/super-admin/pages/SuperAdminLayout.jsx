import { Outlet, NavLink } from "react-router-dom";
import "../styles/theme.css";
import "../styles/SuperAdminLayout.css";


export default function SuperAdminLayout() {
  const logout = () => {
    localStorage.clear();
    window.location.replace("/login");
  };

  return (
    <div className="sa-layout">
      <aside className="sa-sidebar">
        <h2>Super Admin</h2>

        <NavLink to="/super-admin/dashboard">Dashboard</NavLink>
        <NavLink to="/super-admin/create-company">Create Company</NavLink>
        <NavLink to="/super-admin/create-admin">Create Admin</NavLink>

        <button onClick={logout} className="logout-btn">Logout</button>
      </aside>

      <main className="sa-content">
        <Outlet />
      </main>
    </div>
  );
}

