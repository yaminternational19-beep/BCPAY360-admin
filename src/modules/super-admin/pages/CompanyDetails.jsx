import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { superAdminApi } from "../../../api/superAdmin.api";
import { Badge, Button, Loader } from "../../module/components";
import StatCard from "../components/StatCard";
import { FaEdit, FaCheck, FaTimes, FaPowerOff, FaUserShield } from "react-icons/fa";
import "../styles/CompanyDetails.css";
import "../styles/superadmin.css";

export default function CompanyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

  const [editingName, setEditingName] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [summaryData, adminsData] = await Promise.all([
        superAdminApi.getCompanySummary(id),
        superAdminApi.getCompanyAdmins(id)
      ]);
      setSummary(summaryData);
      setAdmins(adminsData || []);
      setCompanyName(summaryData.company.name);
    } catch (error) {
      // silenced error
    } finally {
      setLoading(false);
    }
  };

  const saveCompanyName = async () => {
    setIsSaving(true);
    try {
      await superAdminApi.updateCompany(id, { name: companyName });
      setEditingName(false);
      await fetchData();
    } catch (error) {
      alert("Failed to update name: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleCompanyStatus = async () => {
    const nextStatus = summary.company.is_active ? 0 : 1;
    if (!window.confirm(nextStatus ? "Activate this company?" : "Deactivate this company? Admins & HR will be blocked.")) return;

    setDetailLoading(true);
    try {
      await superAdminApi.toggleCompanyStatus(id, nextStatus);
      await fetchData();
    } catch (error) {
      alert("Error toggling status: " + error.message);
    } finally {
      setDetailLoading(false);
    }
  };

  const toggleAdminStatus = async (adminId, isActive) => {
    setDetailLoading(true);
    try {
      await superAdminApi.toggleAdminStatus(adminId, !isActive);
      // Refresh admins list
      const updatedAdmins = await superAdminApi.getCompanyAdmins(id);
      setAdmins(updatedAdmins || []);
    } catch (error) {
      alert("Error toggling admin status: " + error.message);
    } finally {
      setDetailLoading(false);
    }
  };

  if (loading) return (
    <div className="super-admin-page" style={{ height: "400px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Loader />
    </div>
  );

  if (!summary) return <div className="sa-empty-state">Company not found.</div>;

  const { company } = summary;

  return (
    <div className="super-admin-page">
      {detailLoading && <Loader overlay />}

      <div className="sa-dashboard-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <p style={{ marginBottom: "8px" }}>Company Profile</p>
          {editingName ? (
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <input
                className="sa-input"
                style={{ margin: 0, fontSize: "24px", fontWeight: "800", width: "400px" }}
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
              />
              <Button variant="primary" size="small" onClick={saveCompanyName} isLoading={isSaving}><FaCheck /></Button>
              <Button variant="ghost" size="small" onClick={() => setEditingName(false)}><FaTimes /></Button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <h1 style={{ margin: 0 }}>{company.name}</h1>
              <Button variant="ghost" size="small" onClick={() => setEditingName(true)} style={{ color: "var(--muted)" }}><FaEdit /></Button>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <Badge variant={company.is_active ? "success" : "neutral"} style={{ padding: "6px 16px", borderRadius: "8px" }}>
            {company.is_active ? "FULLY ACTIVE" : "DEACTIVATED"}
          </Badge>
          <Button
            variant={company.is_active ? "danger" : "primary"}
            startIcon={<FaPowerOff />}
            onClick={toggleCompanyStatus}
          >
            {company.is_active ? "Deactivate" : "Activate"}
          </Button>
        </div>
      </div>

      <div className="sa-stat-grid">
        <StatCard label="Organization Admins" value={summary.adminCount || 0} />
        <StatCard label="Total Departments" value={summary.departmentCount || 0} />
        <StatCard label="Total Employees" value={summary.employeeCount || 0} />
      </div>

      <div className="sa-glass-card sa-table-container">
        <div style={{ padding: "20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontWeight: "700", display: "flex", alignItems: "center", gap: "10px" }}>
            <FaUserShield style={{ color: "var(--primary)" }} /> Access Control (Admins)
          </h3>
          <Button variant="primary" size="small" onClick={() => navigate("/super-admin/create-admin")}>Add New Admin</Button>
        </div>
        <table className="sa-table">
          <thead>
            <tr>
              <th>Administrator Email</th>
              <th>Account Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(admin => (
              <tr key={admin.id}>
                <td style={{ fontWeight: "600" }}>{admin.email}</td>
                <td>
                  <span className={`sa-badge sa-badge-${admin.is_active ? "success" : "danger"}`}>
                    {admin.is_active ? "Active" : "Disabled"}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => toggleAdminStatus(admin.id, admin.is_active)}
                    style={{ color: admin.is_active ? "var(--danger)" : "var(--success)" }}
                  >
                    {admin.is_active ? "Disable Access" : "Grant Access"}
                  </Button>
                </td>
              </tr>
            ))}
            {!admins.length && (
              <tr>
                <td colSpan="3" className="sa-empty-state">No administrators linked to this organization.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

