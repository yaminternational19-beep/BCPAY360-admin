import { useEffect, useState } from "react";
import { API_BASE } from "../../../utils/apiBase";
import "../../../styles/Forms.css";

export default function CreateCompanyAdmin() {
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState({
    company_id: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👈 NEW

  useEffect(() => {
    fetch(`${API_BASE}/api/companies`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(res => res.json())
      .then(setCompanies);
  }, []);

  const submit = async e => {
    e.preventDefault();
    if (!form.company_id || !form.email || !form.password)
      return alert("All fields required");

    setLoading(true);

    const res = await fetch(`${API_BASE}/api/company-admins`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (res.ok) {
      alert("Admin created");
      setForm({ company_id: "", email: "", password: "" });
      setShowPassword(false);
    } else {
      alert("Failed to create admin");
    }
  };

 return (
    <form className="card fade-in" onSubmit={submit}>
      <h3 className="form-title">Create Company Admin</h3>

      <select
        className="form-input"
        value={form.company_id}
        onChange={e => setForm({ ...form, company_id: e.target.value })}
      >
        <option value="">Select Company</option>
        {companies.map(c => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <input
        className="form-input"
        placeholder="Admin Email"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
      />

      {/* 🔐 PASSWORD WITH EYE TOGGLE (unchanged) */}
      <div className="password-field">
        <input
          className="form-input"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        <button
          type="button"
          className="eye-toggle"
          onClick={() => setShowPassword(p => !p)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? "🙈" : "👁️"}
        </button>
      </div>

      <button className="form-button" disabled={loading}>
        {loading ? "Creating..." : "Create Admin"}
      </button>
    </form>
  );
}
