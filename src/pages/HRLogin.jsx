import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { API_BASE } from "../utils/apiBase";

/* ===============================
   EMP ID NORMALIZER
=============================== */
const normalizeEmpId = (value) => {
  if (!value) return "";
  if (/^EMP\d{3}$/i.test(value)) return value.toUpperCase();

  const digits = value.replace(/\D/g, "");
  if (!digits) return "";

  return `EMP${digits.padStart(3, "0")}`;
};

export default function HRLogin({ onLogin }) {
  const navigate = useNavigate();

  const [step, setStep] = useState("LOGIN"); // LOGIN | OTP
  const [loading, setLoading] = useState(false);
  const [tempLoginId, setTempLoginId] = useState(null);

  const [companies, setCompanies] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [normalizedEmpId, setNormalizedEmpId] = useState("");

  const [form, setForm] = useState({
    companyId: "",
    department: "",
    empIdRaw: "",
    password: "",
    otp: "",
  });

  /* ===============================
     LOAD COMPANIES
  ================================ */
  useEffect(() => {
    fetch(`${API_BASE}/api/companies/public`)
      .then((r) => r.json())
      .then(setCompanies)
      .catch(() => alert("Failed to load companies"));
  }, []);

  /* ===============================
     LOAD DEPARTMENTS (BY COMPANY)
  ================================ */
  useEffect(() => {
    if (!form.companyId) {
      setDepartments([]);
      return;
    }

    fetch(`${API_BASE}/api/departments/public?companyId=${form.companyId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    })
      .then((r) => r.json())
      .then(setDepartments)
      .catch(() => alert("Failed to load departments"));
  }, [form.companyId]);

  /* ===============================
     HR PRE-LOGIN
  ================================ */
  const submitHRLogin = async (e) => {
    e.preventDefault();

    if (
      !form.companyId ||
      !form.department ||
      !normalizedEmpId ||
      !form.password
    ) {
      alert("All fields required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/hr/pre-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId: form.companyId,
          department: form.department,
          empId: normalizedEmpId,
          password: form.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setTempLoginId(data.tempLoginId);
      setStep("OTP");
    } catch (err) {
      alert(err.message || "HR login failed");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     HR OTP VERIFY
  ================================ */
  const submitOTP = async (e) => {
    e.preventDefault();

    if (!tempLoginId) {
      alert("Session expired");
      setStep("LOGIN");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/hr/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tempLoginId,
          otp: form.otp,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      const user = {
        role: "HR",
        verified: true,
        empId: data.empId,
        department: data.department,
        companyId: data.companyId,
      };

      localStorage.setItem("token", data.token);
      localStorage.setItem("auth_user", JSON.stringify(user));
      onLogin(user);

      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      alert(err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     UI
  ================================ */
  if (step === "LOGIN") {
    return (
      <div className="login-page">
        <form className="login-card" onSubmit={submitHRLogin}>
          <h2>HR Login</h2>

          {/* Company */}
          <select
            value={form.companyId}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                companyId: e.target.value,
                department: "",
              }))
            }
          >
            <option value="">Select Company</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Department */}
          <select
            value={form.department}
            onChange={(e) =>
              setForm((p) => ({ ...p, department: e.target.value }))
            }
            disabled={!form.companyId}
          >
            <option value="">
              {form.companyId
                ? "Select Department"
                : "Select company first"}
            </option>
            {departments.map((d) => (
              <option key={d.id} value={d.department_name}>
                {d.department_name}
              </option>
            ))}
          </select>

          {/* EMP ID */}
          <input
            placeholder="Employee ID (6, emp6, EMP006)"
            value={form.empIdRaw}
            onChange={(e) => {
              const raw = e.target.value;
              setForm((p) => ({ ...p, empIdRaw: raw }));
              setNormalizedEmpId(normalizeEmpId(raw));
            }}
          />

          {normalizedEmpId && (
            <div className="emp-preview">
              Will be converted as <strong>{normalizedEmpId}</strong>
            </div>
          )}

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm((p) => ({ ...p, password: e.target.value }))
            }
          />

          <button disabled={loading}>
            {loading ? "Checking..." : "Continue"}
          </button>
        </form>
      </div>
    );
  }

  /* OTP */
  return (
    <div className="login-page">
      <form className="login-card" onSubmit={submitOTP}>
        <h2>OTP Verification</h2>

        <input
          placeholder="Enter OTP"
          value={form.otp}
          onChange={(e) =>
            setForm((p) => ({ ...p, otp: e.target.value }))
          }
        />

        <button disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
}
