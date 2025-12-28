import React, { useEffect, useState } from "react";
import "../../../styles/AddHR.css";
import { getBranches, getDepartments } from "../../../api/master.api";

const API = import.meta.env.VITE_API_BASE_URL;

const normalizeEmpId = (value) => {
  if (!value) return "";
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  return `EMP${digits.padStart(3, "0")}`;
};

export default function HRList() {
  const user = JSON.parse(localStorage.getItem("auth_user"));
  const token = localStorage.getItem("token");

  if (user?.role !== "COMPANY_ADMIN") {
    return <p className="hint">Access denied</p>;
  }

  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
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
  const [loadingBranches, setLoadingBranches] = useState(false);

  useEffect(() => {
    const loadBranches = async () => {
      try {
        setLoadingBranches(true);
        const data = await getBranches();
        setBranches(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load branches:", err);
      } finally {
        setLoadingBranches(false);
      }
    };
    loadBranches();
  }, []);

  useEffect(() => {
    if (!selectedBranch) {
      setDepartments([]);
      return;
    }

    const loadDepartments = async () => {
      try {
        setLoadingDepts(true);
        const data = await getDepartments(selectedBranch);
        setDepartments(Array.isArray(data) ? data : []);
      } catch (err) {
        alert("Failed to load departments");
      } finally {
        setLoadingDepts(false);
      }
    };
    loadDepartments();
  }, [selectedBranch]);

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
          branch_id: Number(selectedBranch),
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

  return (
    <div className="add-hr-page">
      <form className="add-hr-form" onSubmit={submit}>
        <input value={user.company_name || user.company || "Company"} disabled />

        <select
          value={selectedBranch}
          onChange={(e) => {
            setSelectedBranch(e.target.value);
            setForm(p => ({ ...p, department: "" }));
          }}
          disabled={loadingBranches}
        >
          <option value="">
            {loadingBranches ? "Loading branches..." : "Select Branch"}
          </option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.branch_name}
            </option>
          ))}
        </select>

        <select
          value={form.department}
          onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))}
          disabled={loadingDepts || !selectedBranch}
        >
          <option value="">
            {!selectedBranch
              ? "Select Branch First"
              : loadingDepts
                ? "Loading departments..."
                : "Select Department"}
          </option>
          {departments.map((d) => (
            <option key={d.id} value={d.department_name}>
              {d.department_name}
            </option>
          ))}
        </select>
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
        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Temporary password (min 8 chars)"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
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

