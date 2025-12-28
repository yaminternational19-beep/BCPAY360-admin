import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_BASE } from "../../../utils/apiBase";
import StatCard from "../components/StatCard";
import "../styles/CompanyDetails.css";

export default function CompanyDetails() {
  const { id } = useParams();

  const [summary, setSummary] = useState(null);
  const [admins, setAdmins] = useState([]);

  const [editingName, setEditingName] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);

  const tokenHeader = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  };

  /* =========================
     LOAD COMPANY SUMMARY
  ========================== */
  const loadSummary = () => {
    fetch(`${API_BASE}/api/super-admin/companies/${id}/summary`, {
      headers: tokenHeader,
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to load summary");
        return res.json();
      })
      .then(data => {
        setSummary(data);
        setCompanyName(data.company.name);
      })
      .catch(console.error);
  };

  /* =========================
     LOAD COMPANY ADMINS
  ========================== */
  const loadAdmins = () => {
    fetch(`${API_BASE}/api/super-admin/companies/${id}/admins`, {
      headers: tokenHeader,
    })
      .then(res => res.json())
      .then(setAdmins)
      .catch(console.error);
  };

  useEffect(() => {
    loadSummary();
    loadAdmins();
  }, [id]);

  /* =========================
     UPDATE COMPANY NAME
  ========================== */
  const saveCompanyName = async () => {
    setLoading(true);
    await fetch(`${API_BASE}/api/super-admin/companies/${id}`, {
      method: "PUT",
      headers: tokenHeader,
      body: JSON.stringify({ name: companyName }),
    });
    setEditingName(false);
    setLoading(false);
    loadSummary();
  };

  /* =========================
     ACTIVATE / DEACTIVATE COMPANY
  ========================== */
  const toggleCompanyStatus = async () => {
    const nextStatus = summary.company.is_active ? 0 : 1;

    if (
      !window.confirm(
        nextStatus
          ? "Activate this company?"
          : "Deactivate this company? Admins & HR will be blocked."
      )
    )
      return;

    await fetch(`${API_BASE}/api/super-admin/companies/${id}/status`, {
      method: "PATCH",
      headers: tokenHeader,
      body: JSON.stringify({ is_active: nextStatus }),
    });

    loadSummary();
  };

  /* =========================
     DEACTIVATE / ACTIVATE ADMIN
  ========================== */
  const toggleAdminStatus = async (adminId, isActive) => {
    await fetch(`${API_BASE}/api/super-admin/company-admins/${adminId}/status`, {
      method: "PATCH",
      headers: tokenHeader,
      body: JSON.stringify({ is_active: isActive ? 0 : 1 }),
    });
    loadAdmins();
  };

  if (!summary) return <p>Loading company details...</p>;

  const { company } = summary;

  return (

    <div className="super-admin-content">
      <div className="company-details">
      {/* ================= COMPANY HEADER ================= */}
      <div className="company-header">
        {editingName ? (
          <>
            <input
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
            />
            <button onClick={saveCompanyName} disabled={loading}>
              Save
            </button>
            <button onClick={() => setEditingName(false)}>Cancel</button>
          </>
        ) : (
          <>
            <h2>{company.name}</h2>
            <button onClick={() => setEditingName(true)}>Edit</button>
          </>
        )}

        <span
          className={`status-badge ${
            company.is_active ? "active" : "inactive"
          }`}
        >
          {company.is_active ? "Active" : "Inactive"}
        </span>

        <button
          className={company.is_active ? "danger" : "success"}
          onClick={toggleCompanyStatus}
        >
          {company.is_active ? "Deactivate Company" : "Activate Company"}
        </button>
      </div>

      {/* ================= STATS ================= */}
      <div className="stat-grid">
        <StatCard label="Admins" value={summary.adminCount} />
        <StatCard label="Departments" value={summary.departmentCount} />
        <StatCard label="Employees" value={summary.employeeCount} />
      </div>

      {/* ================= ADMINS LIST ================= */}
      <h3>Company Admins</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {admins.map(admin => (
            <tr key={admin.id}>
              <td>{admin.email}</td>
              <td>
                {admin.is_active ? (
                  <span className="active">Active</span>
                ) : (
                  <span className="inactive">Inactive</span>
                )}
              </td>
              <td>
                <button
                  onClick={() =>
                    toggleAdminStatus(admin.id, admin.is_active)
                  }
                >
                  {admin.is_active ? "Deactivate" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
          {!admins.length && (
            <tr>
              <td colSpan="3">No admins found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </div>

    
  );
}

