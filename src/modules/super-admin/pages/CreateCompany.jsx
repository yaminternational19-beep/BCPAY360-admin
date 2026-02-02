import { useState } from "react";
import { superAdminApi } from "../../../api/superAdmin.api";
import { Loader } from "../../module/components";
import "../../../styles/Forms.css";
import "../styles/superadmin.css";

export default function CreateCompany() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const submit = async e => {
    e.preventDefault();
    if (!form.name || !form.email) {
      return setMessage({ type: "error", text: "Please fill in all fields" });
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await superAdminApi.createCompany(form);
      setMessage({ type: "success", text: "Company created successfully!" });
      setForm({ name: "", email: "" });
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Failed to create company" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="super-admin-page">
      <div className="sa-dashboard-header">
        <h1>Create New Company</h1>
        <p>Onboard a new organization to the HRIS platform</p>
      </div>

      <form className="sa-glass-card sa-form-container" onSubmit={submit}>
        <h3 style={{ marginBottom: "24px", fontWeight: "700" }}>Company Information</h3>

        {message.text && (
          <div className={`sa-badge sa-badge-${message.type === 'success' ? 'success' : 'danger'}`} style={{ width: "100%", padding: "12px", marginBottom: "20px", borderRadius: "8px" }}>
            {message.text}
          </div>
        )}

        <div className="sa-form-group">
          <label className="section-label">Organization Name</label>
          <input
            className="sa-input"
            placeholder="e.g. Acme Corporation"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="sa-form-group">
          <label className="section-label">Primary Contact Email</label>
          <input
            className="sa-input"
            type="email"
            placeholder="contact@company.com"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <button className="sa-btn sa-btn-primary" style={{ width: "100%", marginTop: "12px" }} disabled={loading}>
          {loading ? <Loader size="small" /> : "Create Company"}
        </button>
      </form>
    </div>
  );
}

