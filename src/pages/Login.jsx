import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { API_BASE } from "../utils/apiBase";

export default function Login({ onLogin }) {
  const navigate = useNavigate();

  const [role, setRole] = useState(null);
  const [step, setStep] = useState("ROLE"); // ROLE | LOGIN | HR_LOGIN | OTP
  const [loading, setLoading] = useState(false);

  const [companies, setCompanies] = useState([]);
  const [tempLoginId, setTempLoginId] = useState(null);

  const [form, setForm] = useState({
    companyId: "",
    email: "",
    password: "",
    empId: "",
    otp: "",
  });

  /* =============================
     FETCH COMPANIES (COMPANY ADMIN)
  ============================= */
  useEffect(() => {
    if (role === "COMPANY_ADMIN" && step === "LOGIN") {
      fetch(`${API_BASE}/api/companies/public`)
        .then((r) => r.json())
        .then(setCompanies)
        .catch(() => alert("Failed to load companies"));
    }
  }, [role, step]);

  /* =============================
     ROLE SELECT
  ============================= */
  const selectRole = (r) => {
    if (r === "SUPER_ADMIN") {
      navigate("/super-admin", { replace: true });
      return;
    }

    setRole(r);

    if (r === "HR") {
      setStep("HR_LOGIN");
      return;
    }

    setStep("LOGIN");
  };

  /* =============================
     COMPANY ADMIN LOGIN
  ============================= */
  const submitAdminLogin = async (e) => {
    e.preventDefault();

    if (!form.companyId || !form.email || !form.password) {
      alert("All fields required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/company-admins/pre-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId: form.companyId,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setTempLoginId(data.tempLoginId);
      setStep("OTP");
    } catch (err) {
      alert(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  /* =============================
     HR LOGIN
  ============================= */
  const submitHRLogin = async (e) => {
    e.preventDefault();

    if (!form.empId || !form.password) {
      alert("Emp ID and Password required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/hr/pre-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empId: form.empId,
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

  /* =============================
     OTP SUBMIT
  ============================= */
  const submitOTP = async (e) => {
    e.preventDefault();

    if (!tempLoginId) {
      alert("Session expired");
      setStep(role === "HR" ? "HR_LOGIN" : "LOGIN");
      return;
    }

    try {
      setLoading(true);

      const url =
        role === "HR"
          ? `${API_BASE}/api/hr/verify-otp`
          : `${API_BASE}/api/company-admins/verify-otp`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tempLoginId,
          otp: form.otp,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      const user =
        role === "HR"
          ? {
              role: "HR",
              verified: true,
              empId: data.empId,
              department: data.department,
              companyId: data.companyId,
            }
          : {
              role: "COMPANY_ADMIN",
              verified: true,
              companyId: data.companyId || form.companyId,
            };

      // 🔐 STORE TOKEN (CRITICAL)
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      localStorage.setItem("auth_user", JSON.stringify(user));
      onLogin(user);

      // 🔥 CORRECT REDIRECT
      navigate(
        role === "HR" ? "/" : "/admin/dashboard",
        { replace: true }
      );
    } catch (err) {
      alert(err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  /* =============================
     UI
  ============================= */

  if (step === "ROLE") {
    return (
      <div className="login-page">
        <div className="login-card">
          <h2>Select Role</h2>
          <button onClick={() => selectRole("SUPER_ADMIN")}>
            Super Admin
          </button>
          <button onClick={() => selectRole("COMPANY_ADMIN")}>
            Company Admin
          </button>
          <button onClick={() => selectRole("HR")}>HR</button>
        </div>
      </div>
    );
  }

  if (step === "LOGIN") {
    return (
      <div className="login-page">
        <form className="login-card" onSubmit={submitAdminLogin}>
          <h2>Admin Login</h2>

          <select
            value={form.companyId}
            onChange={(e) =>
              setForm({ ...form, companyId: e.target.value })
            }
          >
            <option value="">Select Company</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button disabled={loading}>
            {loading ? "Checking..." : "Continue"}
          </button>
        </form>
      </div>
    );
  }

  if (step === "HR_LOGIN") {
    return (
      <div className="login-page">
        <form className="login-card" onSubmit={submitHRLogin}>
          <h2>HR Login</h2>

          <input
            placeholder="Emp ID"
            value={form.empId}
            onChange={(e) =>
              setForm({ ...form, empId: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button disabled={loading}>
            {loading ? "Checking..." : "Continue"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={submitOTP}>
        <h2>OTP Verification</h2>

        <input
          placeholder="Enter OTP"
          value={form.otp}
          onChange={(e) =>
            setForm({ ...form, otp: e.target.value })
          }
        />

        <button disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
}
