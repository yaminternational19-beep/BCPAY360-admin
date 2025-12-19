import React, { useEffect, useState } from "react";
import "../styles/AddHR.css";

const API = import.meta.env.VITE_API_BASE_URL;

/* ===============================
   EMP ID NORMALIZER
=============================== */
const normalizeEmpId = (value) => {
  if (!value) return "";
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  return `EMP${digits.padStart(3, "0")}`;
};

export default function AddHR() {
  const user = JSON.parse(localStorage.getItem("auth_user"));
  const token = localStorage.getItem("token");

  // 🔐 HARD GUARD
  if (user?.role !== "COMPANY_ADMIN") {
    return <p className="hint">Access denied</p>;
  }

  /* ===============================
     STATE
  ================================ */
  const [departments, setDepartments] = useState([]);

  const [form, setForm] = useState({
    department: "",
    empIdRaw: "",
    password: "",
  });

  const [normalizedEmpId, setNormalizedEmpId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingDepts, setLoadingDepts] = useState(false);

  /* ===============================
     LOAD DEPARTMENTS (FIXED)
  ================================ */
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        setLoadingDepts(true);

        const res = await fetch(`${API}/api/departments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error();
        setDepartments(await res.json());
      } catch {
        alert("Failed to load departments");
      } finally {
        setLoadingDepts(false);
      }
    };

    loadDepartments();
  }, [token]);

  /* ===============================
     HANDLERS
  ================================ */
  const handleEmpIdChange = (val) => {
    setForm((p) => ({ ...p, empIdRaw: val }));
    setNormalizedEmpId(normalizeEmpId(val));
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.department || !normalizedEmpId || !form.password) {
      alert("All fields are required");
      return;
    }

    if (form.password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API}/api/hr`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          emp_id: normalizedEmpId,
          password: form.password,
          department: form.department,
          designation: "HR",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert("HR created successfully");

      setForm({ department: "", empIdRaw: "", password: "" });
      setNormalizedEmpId("");
    } catch (err) {
      alert(err.message || "Failed to create HR");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     RENDER
  ================================ */
  return (
    <div className="add-hr-page">
      <form className="add-hr-form" onSubmit={submit}>
        {/* Company */}
        <input value={user.company} disabled />

        {/* Department */}
        <select
          value={form.department}
          onChange={(e) =>
            setForm((p) => ({ ...p, department: e.target.value }))
          }
          disabled={loadingDepts}
        >
          <option value="">
            {loadingDepts ? "Loading departments..." : "Select Department"}
          </option>
          {departments.map((d) => (
            <option key={d.id} value={d.department_name}>
              {d.department_name}
            </option>
          ))}
        </select>

        {/* EMP ID */}
        <input
          placeholder="Employee ID (1, 34, emp9)"
          value={form.empIdRaw}
          onChange={(e) => handleEmpIdChange(e.target.value)}
        />

        {normalizedEmpId && (
          <div className="emp-preview">
            Will be saved as <strong>{normalizedEmpId}</strong>
          </div>
        )}

        {/* PASSWORD */}
        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Temporary password (min 8 chars)"
            value={form.password}
            onChange={(e) =>
              setForm((p) => ({ ...p, password: e.target.value }))
            }
          />
          <button
            type="button"
            className="toggle-btn"
            onClick={() => setShowPassword((p) => !p)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button disabled={loading || loadingDepts}>
          {loading ? "Creating HR..." : "Create HR"}
        </button>
      </form>
    </div>
  );
}
