import { useState } from "react";
import "../../../styles/HRPermissions.css";

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

const buildDefaultPermissions = () =>
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
  const [permissions, setPermissions] = useState(buildDefaultPermissions());

  const toggle = (index, key) => {
    setPermissions((prev) =>
      prev.map((p, i) =>
        i === index ? { ...p, [key]: !p[key] } : p
      )
    );
  };

  const toggleRowView = (index) => {
    setPermissions((prev) =>
      prev.map((p, i) =>
        i === index
          ? {
              ...p,
              can_view: true,
              can_create: true,
              can_edit: true,
              can_delete: false,
            }
          : p
      )
    );
  };

  const savePermissions = () => {
    const payload = permissions.map(
      ({ label, ...rest }) => rest
    );

    console.log("HR Permissions Payload:", payload);

    alert("Permissions saved (frontend ready)");
  };

  return (
    <div className="hr-permissions-page">
      <h2>HR Permissions</h2>
      <p className="hint">
        Configure module-level access for this HR. Company Admin always has full access.
      </p>

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
                <td className="module-name">{perm.label}</td>

                {["can_view", "can_create", "can_edit", "can_delete", "can_approve"].map(
                  (key) => (
                    <td key={key}>
                      <input
                        type="checkbox"
                        checked={perm[key]}
                        onChange={() => toggle(idx, key)}
                      />
                    </td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="actions">
        <button className="primary" onClick={savePermissions}>
          Save Permissions
        </button>
      </div>
    </div>
  );
}

