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

  const companiesLoading = companies.length === 0;

  const [showPassword, setShowPassword] = useState(false);
  const [otpResendCooldown, setOtpResendCooldown] = useState(0);
  const [userEmail, setUserEmail] = useState("");

  const [form, setForm] = useState({
    companyId: "",
    email: "",
    password: "",
    emp_id: "",
    otp: "",
  });

  // Helper to reset form cleanly
  const resetFormState = () => {
    setForm({
      companyId: "",
      email: "",
      password: "",
      emp_id: "",
      otp: "",
    });
    setShowPassword(false);
    setTempLoginId(null);
    setOtpResendCooldown(0);
    setUserEmail("");
  };

  // OTP Resend Cooldown Timer
  useEffect(() => {
    if (otpResendCooldown <= 0) return;
    const timer = setInterval(() => {
      setOtpResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [otpResendCooldown]);

  /* =============================
     FETCH COMPANIES (COMPANY ADMIN)
  ============================= */
  useEffect(() => {
  let ignore = false;

  const loadCompanies = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/companies/public`);
      const data = await res.json();
      if (!ignore) setCompanies(data);
    } catch (e) {
      console.error("Company load failed");
    }
  };

  loadCompanies();

  return () => { ignore = true };
}, []);


  /* =============================
     ROLE SELECT
  ============================= */
  const selectRole = (r) => {
    if (r === "SUPER_ADMIN") {
      navigate("/super-admin/login", { replace: true });
      return;
    }

    setRole(r);
    resetFormState();

    if (r === "HR") {
      navigate("/hr/login", { replace: true });
      return;
    }

    setStep("LOGIN");
  };

  /* =============================
     BACK TO ROLE SELECTION
  ============================= */
  const handleBackToRole = () => {
    setRole(null);
    setStep("ROLE");
    resetFormState();
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
        company_id: Number(form.companyId),
        email: form.email,
        password: form.password,
      }),

    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    setTempLoginId(data.tempLoginId);
    setUserEmail(form.email);
    setOtpResendCooldown(45);
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

    if (!form.emp_id || !form.password) {
      alert("Emp ID and Password required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/hr/pre-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emp_id: form.emp_id,
          password: form.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setTempLoginId(data.tempLoginId);
      setUserEmail(data.email || "your registered email");
      setOtpResendCooldown(45);
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
                  emp_id: data.emp_id,
                  department: data.department,
                  company_id: data.company_id,
                }
              : {
                  role: "COMPANY_ADMIN",
                  verified: true,
                  company_id: data.company_id,
                };

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      localStorage.setItem("auth_user", JSON.stringify(user));
      onLogin(user);

      navigate(
        role === "HR" ? "/" : "/dashboard",
        { replace: true }
      );
    } catch (err) {
      alert(err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  /* =============================
     OTP RESEND
  ============================= */
  const handleResendOTP = async (e) => {
    e.preventDefault();

    if (!tempLoginId || otpResendCooldown > 0) {
      return;
    }
    console.log("Resend clicked", { tempLoginId, role });


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
          action: "RESEND",
          tempLoginId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      if (data.tempLoginId) {
        setTempLoginId(data.tempLoginId);
      }

      setForm({ ...form, otp: "" });
      setOtpResendCooldown(45);
    } catch (err) {
      alert(err.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  /* =============================
     UI - ROLE SELECTION
  ============================= */

  if (step === "ROLE") {
    return (
      <div className="login-page">
        <div className="login-card">
          <h2>Select Role</h2>
          <button 
            type="button"
            className="primary-btn"
            onClick={() => selectRole("SUPER_ADMIN")}
          >
            Super Admin
          </button>
          <button 
            type="button"
            className="primary-btn"
            onClick={() => selectRole("COMPANY_ADMIN")}
          >
            Company Admin
          </button>
          <button 
            type="button"
            className="primary-btn"
            onClick={() => selectRole("HR")}
          >
            HR
          </button>
        </div>
      </div>
    );
  }

  /* =============================
     UI - COMPANY ADMIN LOGIN
  ============================= */
  if (step === "LOGIN") {
    const isAdminFormValid = form.companyId && form.email && form.password;

    return (
      <div className="login-page">
        <form className="login-card" onSubmit={submitAdminLogin}>
          <button
            type="button"
            className="change-role-btn"
            onClick={handleBackToRole}
          >
            <span className="arrow">←</span>
            Change Role
          </button>

          <h2>Admin Login</h2>

          <select
            disabled={companiesLoading}
            value={form.companyId}
            onChange={(e) =>
              setForm({ ...form, companyId: e.target.value })
            }
          >
            <option value="">
              {companiesLoading ? "Loading companies..." : "Select Company"}
            </option>

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

          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>

          <button 
            type="submit"
            disabled={loading || !isAdminFormValid}
            className="primary-btn"
          >
            {loading ? "Checking..." : "Continue"}
          </button>
        </form>
      </div>
    );
  }

  /* =============================
     UI - HR LOGIN
  ============================= */
  if (step === "HR_LOGIN") {
    const isHRFormValid = form.emp_id && form.password;

    return (
      <div className="login-page">
        <form className="login-card" onSubmit={submitHRLogin}>
          <button
            type="button"
            className="change-role-btn"
            onClick={handleBackToRole}
          >
            <span className="arrow">←</span>
            Change Role
          </button>

          <h2>HR Login</h2>

          <input
            placeholder="Emp ID"
            value={form.emp_id}
            onChange={(e) =>
              setForm({ ...form, emp_id: e.target.value })
            }
          />

          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>

          <button 
            type="submit"
            disabled={loading || !isHRFormValid}
            className="primary-btn"
          >
            {loading ? "Checking..." : "Continue"}
          </button>
        </form>
      </div>
    );
  }

  /* =============================
     UI - OTP VERIFICATION
  ============================= */
  if (step === "OTP") {
    const isOTPFormValid = form.otp.length >= 4;
    const canResend = otpResendCooldown === 0 && !loading;

    return (
      <div className="login-page">
        <form className="login-card otp-card" onSubmit={submitOTP}>
          <h2>OTP Verification</h2>

          <p className="otp-helper">
            OTP sent to <strong>{userEmail}</strong>
          </p>

          <input
            placeholder="Enter OTP"
            maxLength="6"
            value={form.otp}
            onChange={(e) =>
              setForm({ ...form, otp: e.target.value })
            }
          />

          <div className="otp-buttons">
            <button 
              type="submit"
              disabled={loading || !isOTPFormValid}
              className="primary-btn"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button 
              type="button"
              onClick={handleResendOTP}
              disabled={loading || !canResend}
              className="secondary-btn"
            >
              {otpResendCooldown > 0
                ? `Resend OTP (${otpResendCooldown}s)`
                : "Resend OTP"}
            </button>
          </div>
        </form>
      </div>
    );
  }
}
