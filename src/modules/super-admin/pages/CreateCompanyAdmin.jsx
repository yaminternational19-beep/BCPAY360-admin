import { useEffect, useState } from "react";
import { superAdminApi } from "../../../api/superAdmin.api";
import { Loader } from "../../module/components";
import "../../../styles/Forms.css";
import "../styles/superadmin.css";

export default function CreateCompanyAdmin() {
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState({
    company_id: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetchingCompanies, setFetchingCompanies] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setFetchingCompanies(true);
    try {
      const data = await superAdminApi.getCompanies();
      setCompanies(data || []);
    } catch (error) {
      alert("Failed to fetch companies: " + error.message);
    } finally {
      setFetchingCompanies(false);
    }
  };

  const submit = async e => {
    e.preventDefault();
    if (!form.company_id || !form.email || !form.password) {
      return setMessage({ type: "error", text: "Please fill in all fields" });
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await superAdminApi.createCompanyAdmin(form);
      setMessage({ type: "success", text: "Company Admin created successfully!" });
      setForm({ company_id: "", email: "", password: "" });
      setShowPassword(false);
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Failed to create admin" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="super-admin-page">
      <div className="sa-dashboard-header">
        <h1>Create Company Admin</h1>
        <p>Assign a master administrator to a specific organization</p>
      </div>

      <form className="sa-glass-card sa-form-container" onSubmit={submit}>
        <h3 style={{ marginBottom: "24px", fontWeight: "700" }}>Admin Credentials</h3>

        {message.text && (
          <div className={`sa-badge sa-badge-${message.type === 'success' ? 'success' : 'danger'}`} style={{ width: "100%", padding: "12px", marginBottom: "20px", borderRadius: "8px" }}>
            {message.text}
          </div>
        )}

        <div className="sa-form-group">
          <label className="section-label">Target Organization</label>
          <select
            className="sa-input"
            value={form.company_id}
            onChange={e => setForm({ ...form, company_id: e.target.value })}
            disabled={fetchingCompanies}
          >
            <option value="">{fetchingCompanies ? "Loading companies..." : "Select Company"}</option>
            {companies.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="sa-form-group">
          <label className="section-label">Administrator Email</label>
          <input
            className="sa-input"
            type="email"
            placeholder="admin@company.com"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="sa-form-group" style={{ position: "relative" }}>
          <label className="section-label">Secure Password</label>
          <input
            className="sa-input"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
          <button
            type="button"
            style={{ position: "absolute", right: "12px", top: "34px", background: "none", border: "none", cursor: "pointer", fontSize: "18px" }}
            onClick={() => setShowPassword(p => !p)}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        <button className="sa-btn sa-btn-primary" style={{ width: "100%", marginTop: "12px" }} disabled={loading}>
          {loading ? <Loader size="small" /> : "Link Admin to Company"}
        </button>
      </form>
    </div>
  );
}
