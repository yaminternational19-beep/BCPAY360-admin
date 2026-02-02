import { useEffect, useState } from "react";
import { superAdminApi } from "../../../api/superAdmin.api";
import StatCard from "../components/StatCard";
import CompanyCards from "./CompanyCards";
import { Loader } from "../../module/components";
import "../styles/SuperAdminDashboard.css";
import "../styles/superadmin.css";

export default function Dashboard() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await superAdminApi.getCompanies();
      setCompanies(data || []);
    } catch (error) {
      alert("Failed to fetch companies: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="super-admin-page" style={{ height: "400px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader />
      </div>
    );
  }

  return (
    <div className="super-admin-page dashboard">
      {/* TOP CONTEXT */}
      <div className="sa-dashboard-header">
        <h1>Super Admin Dashboard</h1>
        <p>Real-time overview of across all managed companies.</p>
      </div>

      {/* STATS */}
      <div className="sa-stat-grid">
        <StatCard label="Total Companies" value={companies.length} />
        <StatCard
          label="Active Companies"
          value={companies.filter(c => c.is_active).length}
        />
        <StatCard
          label="Inactive Companies"
          value={companies.filter(c => !c.is_active).length}
        />
      </div>

      {/* DATA */}
      <div className="dashboard-section sa-glass-card" style={{ padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ margin: 0, fontWeight: "700" }}>Manage Companies</h3>
        </div>
        <CompanyCards companies={companies} />
      </div>
    </div>
  );
}
