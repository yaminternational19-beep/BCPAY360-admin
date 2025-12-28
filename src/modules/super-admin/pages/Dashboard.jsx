import { useEffect, useState } from "react";
import { API_BASE } from "../../../utils/apiBase";
import StatCard from "../components/StatCard";
import CompanyCards from "./CompanyCards";
import "../styles/SuperAdminDashboard.css";

export default function Dashboard() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/companies`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setCompanies(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <>
      <div className="stat-grid">
        <StatCard label="Total Companies" value={companies.length} />
        <StatCard label="Active Companies" value={companies.filter(c => c.is_active).length} />
      </div>

      <CompanyCards companies={companies} />
    </>
  );
}

