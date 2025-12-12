import React, { useState } from "react";
import "../styles/SettingsModule.css";

export default function SettingsModule() {
  // ---------------------------
  // COMPANY DETAILS
  // ---------------------------
  const [company, setCompany] = useState({
    name: "Your Company",
    email: "contact@company.com",
    address: "123 Business Street",
    logo: "",
  });

  // ---------------------------
  // HR ROLES & PERMISSIONS
  // ---------------------------
  const modules = [
    "Employees",
    "Attendance",
    "Leave",
    "Payroll",
    "Assets",
    "Recruitment",
    "Announcements",
    "Settings",
  ];

  const [roles, setRoles] = useState([
    {
      id: 1,
      role: "HR Manager",
      permissions: [...modules],
    },
    {
      id: 2,
      role: "HR Executive",
      permissions: ["Employees", "Attendance", "Leave"],
    },
  ]);

  const [newRole, setNewRole] = useState({
    role: "",
    permissions: [],
  });

  const togglePermission = (module) => {
    setNewRole((prev) => {
      const exists = prev.permissions.includes(module);
      return {
        ...prev,
        permissions: exists
          ? prev.permissions.filter((m) => m !== module)
          : [...prev.permissions, module],
      };
    });
  };

  const saveRole = () => {
    if (!newRole.role) return alert("Enter role name");
    setRoles([...roles, { id: Date.now(), ...newRole }]);
    setNewRole({ role: "", permissions: [] });
  };

  // ---------------------------
  // API KEYS SECTION
  // ---------------------------
  const [apiKeys, setApiKeys] = useState({
    smsApi: "",
    emailApi: "",
    pushApi: "",
  });

  // ---------------------------
  // EMAIL / SMS SETTINGS
  // ---------------------------
  const [emailSms, setEmailSms] = useState({
    smtpHost: "",
    smtpUser: "",
    smtpPass: "",
    smsGateway: "",
  });

  return (
    <div className="settings-root">
      <h1 className="fade-in">Settings</h1>

      {/* =============================
          COMPANY SETTINGS
      ============================== */}
      <section className="card slide-up">
        <h2>Company Details</h2>

        <div className="company-grid">

          <div className="input-group">
            <label>Company Name</label>
            <input
              value={company.name}
              onChange={(e) =>
                setCompany({ ...company, name: e.target.value })
              }
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              value={company.email}
              onChange={(e) =>
                setCompany({ ...company, email: e.target.value })
              }
            />
          </div>

          <div className="input-group full">
            <label>Address</label>
            <textarea
              rows="2"
              value={company.address}
              onChange={(e) =>
                setCompany({ ...company, address: e.target.value })
              }
            ></textarea>
          </div>

          <div className="input-group full">
            <label>Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setCompany({
                  ...company,
                  logo: URL.createObjectURL(e.target.files[0]),
                })
              }
            />
          </div>

          {company.logo && (
            <div className="logo-preview fade-in">
              <img src={company.logo} alt="logo" />
            </div>
          )}
        </div>
      </section>

      {/* =============================
          ROLES & PERMISSIONS
      ============================== */}
      <section className="card slide-up">
        <h2>HR Roles & Permissions</h2>

        <div className="role-list">
          {roles.map((r) => (
            <div key={r.id} className="role-card">
              <h3>{r.role}</h3>
              <p className="perm-list">
                {r.permissions.join(", ")}
              </p>
            </div>
          ))}
        </div>

        {/* ADD ROLE */}
        <div className="new-role">
          <h3>Create New Role</h3>
          <input
            placeholder="Role Name"
            value={newRole.role}
            onChange={(e) =>
              setNewRole({ ...newRole, role: e.target.value })
            }
          />

          <div className="perm-grid">
            {modules.map((m) => (
              <label
                key={m}
                className={`perm-item ${
                  newRole.permissions.includes(m) ? "active" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={newRole.permissions.includes(m)}
                  onChange={() => togglePermission(m)}
                />
                {m}
              </label>
            ))}
          </div>

          <button className="btn-primary" onClick={saveRole}>
            Save Role
          </button>
        </div>
      </section>

      {/* =============================
          API KEYS SETTINGS
      ============================== */}
      <section className="card slide-up">
        <h2>API Keys</h2>

        <div className="settings-grid">
          <div className="input-group">
            <label>SMS API Key</label>
            <input
              value={apiKeys.smsApi}
              onChange={(e) =>
                setApiKeys({ ...apiKeys, smsApi: e.target.value })
              }
            />
          </div>

          <div className="input-group">
            <label>Email API Key</label>
            <input
              value={apiKeys.emailApi}
              onChange={(e) =>
                setApiKeys({ ...apiKeys, emailApi: e.target.value })
              }
            />
          </div>

          <div className="input-group full">
            <label>Push Notification API</label>
            <input
              value={apiKeys.pushApi}
              onChange={(e) =>
                setApiKeys({ ...apiKeys, pushApi: e.target.value })
              }
            />
          </div>
        </div>
      </section>

      {/* =============================
          EMAIL & SMS CONFIGURATION
      ============================== */}
      <section className="card slide-up">
        <h2>Email & SMS Settings</h2>

        <div className="settings-grid">

          <div className="input-group">
            <label>SMTP Host</label>
            <input
              value={emailSms.smtpHost}
              onChange={(e) =>
                setEmailSms({ ...emailSms, smtpHost: e.target.value })
              }
            />
          </div>

          <div className="input-group">
            <label>SMTP User</label>
            <input
              value={emailSms.smtpUser}
              onChange={(e) =>
                setEmailSms({ ...emailSms, smtpUser: e.target.value })
              }
            />
          </div>

          <div className="input-group">
            <label>SMTP Password</label>
            <input
              type="password"
              value={emailSms.smtpPass}
              onChange={(e) =>
                setEmailSms({ ...emailSms, smtpPass: e.target.value })
              }
            />
          </div>

          <div className="input-group full">
            <label>SMS Gateway URL</label>
            <input
              value={emailSms.smsGateway}
              onChange={(e) =>
                setEmailSms({ ...emailSms, smsGateway: e.target.value })
              }
            />
          </div>
        </div>
      </section>
    </div>
  );
}
