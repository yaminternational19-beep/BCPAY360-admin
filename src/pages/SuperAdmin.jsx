import React, { useEffect, useState } from "react";
import "../styles/SuperAdmin.css";
import { API_BASE } from "../utils/apiBase";

/* =============================
   AUTH HEADER
============================= */
const authHeader = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export default function SuperAdmin() {
  const [step, setStep] = useState("LOGIN");
  const [loading, setLoading] = useState(false);

  const [login, setLogin] = useState({
    email: "",
    password: "",
    otp: "",
  });

  const [companies, setCompanies] = useState([]);

  const [newCompany, setNewCompany] = useState({
    name: "",
    email: "",
  });

  const [newAdmin, setNewAdmin] = useState({
    companyId: "",
    email: "",
    password: "",
  });

  /* =============================
     SESSION RESTORE
  ============================= */
  useEffect(() => {
    if (localStorage.getItem("token")) {
      setStep("DASHBOARD");
    }
  }, []);

  /* =============================
     SUPER ADMIN LOGIN
  ============================= */
  const loginSubmit = async (e) => {
    e.preventDefault();

    if (!login.email || !login.password || !login.otp) {
      alert("All fields required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/super-admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(login),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      setStep("DASHBOARD");
    } catch {
      alert("Backend not reachable");
    } finally {
      setLoading(false);
    }
  };

  /* =============================
     LOAD COMPANIES
  ============================= */
  const loadCompanies = async () => {
    const res = await fetch(`${API_BASE}/api/companies`, {
      headers: authHeader(),
    });

    if (res.ok) {
      setCompanies(await res.json());
    } else {
      logout();
    }
  };

  useEffect(() => {
    if (step === "DASHBOARD") {
      loadCompanies();
    }
  }, [step]);

  /* =============================
     CREATE COMPANY
  ============================= */
  const createCompany = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_BASE}/api/companies`, {
      method: "POST",
      headers: authHeader(),
      body: JSON.stringify(newCompany),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message);

    setCompanies((p) => [...p, data.company]);
    setNewCompany({ name: "", email: "" });
  };

  /* =============================
     CREATE COMPANY ADMIN
  ============================= */
  const createAdmin = async (e) => {
  e.preventDefault();

  const res = await fetch(`${API_BASE}/api/company-admins`, {
    method: "POST",
    headers: {
      ...authHeader(),
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newAdmin),
  });

  const data = await res.json();
  if (!res.ok) return alert(data.message);

  alert("Company admin created");
  setNewAdmin({ company_id: "", email: "", password: "" });
};


  /* =============================
     LOGOUT
  ============================= */
  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.replace("/login");
  };


  /* =============================
     LOGIN UI
  ============================= */
  if (step === "LOGIN") {
    return (
      <div className="super-login">
        <form className="card" onSubmit={loginSubmit}>
          <h2>Super Admin Login</h2>

          <input
            placeholder="Email"
            value={login.email}
            onChange={(e) =>
              setLogin({ ...login, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={login.password}
            onChange={(e) =>
              setLogin({ ...login, password: e.target.value })
            }
          />

          <input
            placeholder="OTP"
            value={login.otp}
            onChange={(e) =>
              setLogin({ ...login, otp: e.target.value })
            }
          />

          <button type="submit">
            {loading ? "Checking..." : "Login"}
          </button>
        </form>
      </div>
    );
  }

  /* =============================
     DASHBOARD
  ============================= */
  return (
    <div className="super-dashboard">
      <div className="super-header">
        <h2>Super Admin Dashboard</h2>
        <button onClick={logout}>Logout</button>
      </div>

      <div className="panels">
        <div className="panel">
          <h3>Create Company</h3>
          <form onSubmit={createCompany}>
            <input
              placeholder="Company Name"
              value={newCompany.name}
              onChange={(e) =>
                setNewCompany({ ...newCompany, name: e.target.value })
              }
            />
            <input
              placeholder="Company Email"
              value={newCompany.email}
              onChange={(e) =>
                setNewCompany({ ...newCompany, email: e.target.value })
              }
            />
            <button>Create Company</button>
          </form>
        </div>

        <div className="panel">
          <h3>Create Company Admin</h3>
          <form onSubmit={createAdmin}>
            <select
              value={newAdmin.companyId}
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, companyId: e.target.value })
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
              placeholder="Admin Email"
              value={newAdmin.email}
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, email: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Admin Password"
              value={newAdmin.password}
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, password: e.target.value })
              }
            />

            <button>Create Admin</button>
          </form>
        </div>
      </div>
    </div>
  );
}
