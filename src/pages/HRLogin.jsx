import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { API_BASE } from "../utils/apiBase";

/* ===============================
   EMP ID NORMALIZER
=============================== */
const normalize_emp_id = (value) => {
  if (!value) return "";
  if (/^EMP\d{3}$/i.test(value)) return value.toUpperCase();

  const digits = value.replace(/\D/g, "");
  if (!digits) return "";

  return `EMP${digits.padStart(3, "0")}`;
};

export default function HRLogin({ on_login }) {
  const navigate = useNavigate();

  const [step, set_step] = useState("LOGIN");
  const [loading, set_loading] = useState(false);
  const [temp_login_id, set_temp_login_id] = useState(null);

  const [companies, set_companies] = useState([]);
  const [normalized_emp_id, set_normalized_emp_id] = useState("");

  const [form, set_form] = useState({
    company_id: "",
    emp_id_raw: "",
    password: "",
    otp: "",
  });

  /* ===============================
     LOAD COMPANIES (OPTIONAL)
  ================================ */
  useEffect(() => {
    fetch(`${API_BASE}/api/companies/public`)
      .then((r) => r.json())
      .then(set_companies)
      .catch(() => alert("Failed to load companies"));
  }, []);

  /* ===============================
     HR PRE LOGIN
  ================================ */
  const submit_hr_login = async (e) => {
    e.preventDefault();

    if (!form.company_id || !normalized_emp_id || !form.password) {
      alert("All fields required");
      return;
    }

    try {
      set_loading(true);

      const res = await fetch(`${API_BASE}/api/hr/pre-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emp_id: normalized_emp_id,
          password: form.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      set_temp_login_id(data.tempLoginId);
      set_step("OTP");
    } catch (err) {
      alert(err.message || "Login failed");
    } finally {
      set_loading(false);
    }
  };

  /* ===============================
     OTP VERIFY
  ================================ */
  const submit_otp = async (e) => {
    e.preventDefault();

    if (!temp_login_id) {
      alert("Session expired");
      set_step("LOGIN");
      return;
    }

    try {
      set_loading(true);

      const res = await fetch(`${API_BASE}/api/hr/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tempLoginId: temp_login_id,
          otp: form.otp,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      const auth_user = {
        role: "HR",
        verified: true,
        emp_id: data.emp_id,
        company_id: data.company_id,
        branch_id: data.branch_id,
        department_id: data.department_id,
      };

      localStorage.setItem("token", data.token);
      localStorage.setItem("auth_user", JSON.stringify(auth_user));

     
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      alert(err.message || "OTP verification failed");
    } finally {
      set_loading(false);
    }
  };

  /* ===============================
     UI
  ================================ */
  if (step === "LOGIN") {
    return (
      <div className="login-page">
        <form className="login-card" onSubmit={submit_hr_login}>
          <h2>HR Login</h2>

          {/* Company */}
          <select
            value={form.company_id}
            onChange={(e) =>
              set_form((prev) => ({
                ...prev,
                company_id: e.target.value,
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

          {/* EMP ID */}
          <input
            placeholder="Employee ID (6, emp6, EMP006)"
            value={form.emp_id_raw}
            onChange={(e) => {
              const raw = e.target.value;
              set_form((prev) => ({ ...prev, emp_id_raw: raw }));
              set_normalized_emp_id(normalize_emp_id(raw));
            }}
          />

          {normalized_emp_id && (
            <div className="emp-preview">
              Will be converted as <strong>{normalized_emp_id}</strong>
            </div>
          )}

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              set_form((prev) => ({ ...prev, password: e.target.value }))
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
      <form className="login-card" onSubmit={submit_otp}>
        <h2>OTP Verification</h2>

        <input
          placeholder="Enter OTP"
          value={form.otp}
          onChange={(e) =>
            set_form((prev) => ({ ...prev, otp: e.target.value }))
          }
        />

        <button disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
}
