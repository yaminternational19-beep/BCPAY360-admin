import React, { useEffect, useState } from "react";
import "../../../styles/HRPermissions.css";
import {
  getHRList,
  getHRPermissions,
  saveHRPermissions,
} from "../../../api/master.api";

/* ============================
   MODULE DEFINITIONS
============================ */
const MODULES = [
  { key: "EMPLOYEE_MASTER", label: "Employees" },
  { key: "EMPLOYEE_DOCUMENTS", label: "Employee Documents" },
  { key: "DEPARTMENT", label: "Departments" },
  { key: "DESIGNATION", label: "Designations" },
  { key: "BRANCH", label: "Branches" },
  { key: "SHIFT", label: "Shifts" },
  { key: "EMPLOYEE_TYPE", label: "Employee Types" },
  { key: "ATTENDANCE", label: "Attendance" },
  { key: "ATTENDANCE_REPORTS", label: "Attendance Reports" },
  { key: "LEAVE_MASTER", label: "Leave Master" },
  { key: "LEAVE_APPROVAL", label: "Leave Approval" },
  { key: "PAYROLL", label: "Payroll" },
  { key: "PAYSLIP", label: "Payslips" },
  { key: "BONUS", label: "Bonus" },
  { key: "FNF", label: "Full & Final" },
  { key: "PF", label: "PF" },
  { key: "ESI", label: "ESI" },
  { key: "REPORTS", label: "Reports" },
];

const buildEmptyPermissions = () =>
  MODULES.map((m) => ({
    module_key: m.key,
    label: m.label,
    can_view: false,
    can_create: false,
    can_edit: false,
    can_delete: false,
    can_approve: false,
  }));

export default function HRPermissions() {
  const [hrList, setHrList] = useState([]);
  const [selectedHR, setSelectedHR] = useState(null);
  const [permissions, setPermissions] = useState(buildEmptyPermissions());
  const [loading, setLoading] = useState(false);

  /* ============================
     LOAD HR LIST
  ============================ */
  useEffect(() => {
    const loadHRs = async () => {
      const data = await getHRList();
      setHrList(Array.isArray(data) ? data : []);
    };
    loadHRs();
  }, []);

  /* ============================
     LOAD HR PERMISSIONS
  ============================ */
  useEffect(() => {
    if (!selectedHR) return;

    const loadPermissions = async () => {
      setLoading(true);
      try {
        const data = await getHRPermissions(selectedHR.id);

        if (!Array.isArray(data)) {
          setPermissions(buildEmptyPermissions());
          return;
        }

        setPermissions((prev) =>
          prev.map((p) => {
            const existing = data.find(
              (x) => x.module_key === p.module_key
            );
            return existing ? { ...p, ...existing } : p;
          })
        );
      } finally {
        setLoading(false);
      }
    };

    loadPermissions();
  }, [selectedHR]);

  /* ============================
     TOGGLE PERMISSION
  ============================ */
  const toggle = (index, key) => {
    setPermissions((prev) =>
      prev.map((p, i) =>
        i === index ? { ...p, [key]: !p[key] } : p
      )
    );
  };

  /* ============================
     SAVE
  ============================ */
  const save = async () => {
    if (!selectedHR) {
      alert("Select an HR first");
      return;
    }

    const payload = {
      hr_id: selectedHR.id,
      branch_id: selectedHR.branch_id,
      department_id: selectedHR.department_id,
      permissions: permissions.map(({ label, ...rest }) => rest),
    };

    await saveHRPermissions(selectedHR.id, payload);
    alert("Permissions saved");
  };

  return (
    <div className="hr-permissions-page">
      <h2>HR Permissions</h2>
      <p className="hint">
        Select an HR to configure module-level permissions.
      </p>

      {/* HR SELECTOR */}
      <div className="hr-selector">
        <select
          value={selectedHR?.id || ""}
          onChange={(e) => {
            const hr = hrList.find(
              (h) => h.id === Number(e.target.value)
            );
            setSelectedHR(hr || null);
            setPermissions(buildEmptyPermissions());
          }}
        >
          <option value="">— Select HR —</option>
          {hrList.map((hr) => (
            <option key={hr.id} value={hr.id}>
              {hr.emp_id}
            </option>
          ))}
        </select>
      </div>

      {/* CONTEXT */}
      {selectedHR && (
        <div className="hr-context">
          <strong>Branch:</strong> {selectedHR.branch_name || "—"} &nbsp; | &nbsp;
          <strong>Department:</strong>{" "}
          {selectedHR.department_name || "—"}
        </div>
      )}

      {/* PERMISSIONS TABLE */}
      <div className="table-wrapper">
        <table className="permission-table">
          <thead>
            <tr>
              <th>Module</th>
              <th>View</th>
              <th>Create</th>
              <th>Edit</th>
              <th>Delete</th>
              <th>Approve</th>
            </tr>
          </thead>
          <tbody>
            {permissions.map((perm, idx) => (
              <tr key={perm.module_key}>
                <td>{perm.label}</td>
                {[
                  "can_view",
                  "can_create",
                  "can_edit",
                  "can_delete",
                  "can_approve",
                ].map((key) => (
                  <td key={key}>
                    <input
                      type="checkbox"
                      checked={perm[key]}
                      disabled={!selectedHR || loading}
                      onChange={() => toggle(idx, key)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ACTIONS */}
      <div className="actions">
        <button className="primary" onClick={save} disabled={loading}>
          {loading ? "Saving..." : "Save Permissions"}
        </button>
      </div>
    </div>
  );
}
