import { useState } from "react";
import { API_BASE } from "../../../utils/apiBase";
import "../../../styles/Forms.css";

export default function CreateCompany() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);

  const submit = async e => {
    e.preventDefault();
    if (!form.name || !form.email) return alert("All fields required");

    setLoading(true);

    const res = await fetch(`${API_BASE}/api/companies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (res.ok) {
      alert("Company created");
      setForm({ name: "", email: "" });
    } else {
      alert("Failed to create company");
    }
  };

   return (
    <form className="card fade-in" onSubmit={submit}>
      <h3 className="form-title">Create Company</h3>

      <input
        className="form-input"
        placeholder="Company Name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
      />

      <input
        className="form-input"
        placeholder="Company Email"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
      />

      <button className="form-button" disabled={loading}>
        {loading ? "Creating..." : "Create Company"}
      </button>
    </form>
  );  
}

