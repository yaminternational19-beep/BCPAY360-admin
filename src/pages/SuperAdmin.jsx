import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SuperAdmin.css";
import { API_BASE } from "../utils/apiBase";

export default function SuperAdmin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [login, setLogin] = useState({
    email: "",
    password: "",
    otp: "",
  });

  const handleBack = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const sendOtp = async () => {
    if (!login.email || !login.password) {
      alert("Email and password required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/super-admin/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: login.email,
          password: login.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setOtpSent(true);
    } catch (err) {
      alert(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const submitLogin = async (e) => {
    e.preventDefault();

    if (!login.email || !login.otp) {
      alert("Email and OTP required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/super-admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: login.email,
          otp: login.otp,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem("token", data.token);
      navigate("/super-admin/dashboard", { replace: true });
    } catch (err) {
      alert(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

 return (
  <div className="sa-root">
    <div className="sa-bg-orb orb-1"></div>
    <div className="sa-bg-orb orb-2"></div>

    <form className="sa-card" onSubmit={submitLogin}>
      <button type="button" className="sa-back" onClick={handleBack}>
        ← Back
      </button>

      <div className="sa-header">
        <h1>Super Admin</h1>
        <p>Secure system access</p>
      </div>

      <div className="sa-field">
        <input
          placeholder="Email address"
          value={login.email}
          onChange={(e) => setLogin({ ...login, email: e.target.value })}
        />
      </div>

      <div className="sa-field password-field">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={login.password}
          onChange={(e) =>
            setLogin({ ...login, password: e.target.value })
          }
          disabled={otpSent}
        />
        <span
          className="eye-toggle"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "🙈" : "👁️"}
        </span>
      </div>

      {otpSent && (
        <div className="sa-field otp-animate">
          <input
            placeholder="Enter OTP"
            value={login.otp}
            onChange={(e) => setLogin({ ...login, otp: e.target.value })}
          />
        </div>
      )}

      {!otpSent ? (
        <button
          type="button"
          className="sa-btn primary"
          onClick={sendOtp}
          disabled={loading}
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      ) : (
        <>
          <button
            type="submit"
            className="sa-btn primary"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Login"}
          </button>

          <button
            type="button"
            className="sa-btn ghost"
            onClick={sendOtp}
          >
            Resend OTP
          </button>
        </>
      )}
    </form>
  </div>
);

}
