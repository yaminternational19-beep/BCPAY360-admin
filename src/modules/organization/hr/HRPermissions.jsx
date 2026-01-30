import React, { useEffect, useState } from "react";
import "../../../styles/HRPermissions.css";
import {
  getHRList,
  getHRPermissions,
  saveHRPermissions,
} from "../../../api/master.api";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";

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
  const { hrId } = useParams();
  const navigate = useNavigate();

  const [hrList, setHrList] = useState([]);
  const [selectedHR, setSelectedHR] = useState(null);
  const [permissions, setPermissions] = useState(buildEmptyPermissions());
  const [loading, setLoading] = useState(false);

  /* ============================
     SAFETY GUARD
  ============================ */
 

  /* ============================
     LOAD HR LIST
  ============================ */
  useEffect(() => {
  const loadHRs = async () => {
    const res = await getHRList();
    const list = Array.isArray(res?.data) ? res.data : [];
    setHrList(list);

    const hr = list.find((h) => h.id === Number(hrId));
    if (!hr) {
      navigate("/admin/hr-management", { replace: true });
      return;
    }
    setSelectedHR(hr);
  };

  loadHRs();
}, [hrId, navigate]);



  /* ============================
     LOAD HR PERMISSIONS
  ============================ */
  useEffect(() => {
    if (!selectedHR) return;

    const loadPermissions = async () => {
      setLoading(true);
      try {
        const data = await getHRPermissions(selectedHR.id);

        if (!Array.isArray(data) || data.length === 0) {
          // default permissions
          setPermissions((prev) =>
            prev.map((p) =>
              ["EMPLOYEE_MASTER", "ATTENDANCE", "LEAVE_MASTER"].includes(
                p.module_key
              )
                ? { ...p, can_view: true }
                : p
            )
          );
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
      prev.map((p, i) => {
        if (i !== index) return p;

        // If VIEW is turned OFF → turn everything OFF
        if (key === "can_view" && p.can_view) {
          return {
            ...p,
            can_view: false,
            can_create: false,
            can_edit: false,
            can_delete: false,
            can_approve: false,
          };
        }

        // If any action is enabled → VIEW must be ON
        if (key !== "can_view" && !p.can_view) {
          return {
            ...p,
            can_view: true,
            [key]: true,
          };
        }

        return { ...p, [key]: !p[key] };
      })
    );
  };


  /* ============================
     SAVE PERMISSIONS
  ============================ */
  const save = async () => {
    if (!selectedHR) return;

    await saveHRPermissions(selectedHR.id, {
      branch_id: selectedHR.branch_id,
      department_id: selectedHR.department_id,
      permissions: permissions.map(({ label, ...rest }) => rest),
    });

    alert("Permissions saved successfully");
  };

  return (
    <div className="hr-permissions-page">
      <h2>HR Permissions</h2>

      <div className="hr-context">
        <strong>HR:</strong> {selectedHR?.emp_id} &nbsp; | &nbsp;
        <strong>Branch:</strong> {selectedHR?.branch_name} &nbsp; | &nbsp;
        <strong>Department:</strong> {selectedHR?.department_name}
      </div>

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
                      disabled={
                        !selectedHR ||
                        loading ||
                        (key !== "can_view" && !perm.can_view)
                      }
                      onChange={() => toggle(idx, key)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="actions">
        <button
          className="secondary"
          onClick={() => navigate("/admin/hr-management")}
          disabled={loading}
        >
          <FaArrowLeft /> Back
        </button>

        <button
          className="primary"
          onClick={save}
          disabled={loading}
        >
          <FaSave /> {loading ? "Saving..." : "Save Permissions"}
        </button>
      </div>

    </div>
  );
}
