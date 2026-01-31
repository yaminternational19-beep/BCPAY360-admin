import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import "../../../styles/HRPermissions.css";
import {
  getHRList,
  getHRPermissions,
  saveHRPermissions,
} from "../../../api/master.api";

/* =====================================================
   PERMISSION CONFIG (SINGLE SOURCE OF TRUTH)
===================================================== */
const PERMISSION_GROUPS = [
  {
  key: "CORE",
  label: "Core Access",
  children: [
    { key: "DASHBOARD", label: "Dashboard Access" },
  ],
},
 
  {
    key: "ORGANIZATION",
    label: "Organization",
    children: [
      { key: "DEPARTMENTS", label: "Departments" },
      { key: "EMPLOYEE_TYPES", label: "Employee Types" },
      { key: "SHIFTS", label: "Shifts" },
      { key: "BRANCHES", label: "Branches" },
      { key: "HR_MANAGEMENT", label: "Add HR" },
      { key: "EMPLOYEE_CODE", label: "Employee Code" },
      { key: "GOVERNMENT_FORMS", label: "Government Forms" },
    ],
  },
  {
    key: "HR_MODULE",
    label: "HR Module",
    children: [
      { key: "EMPLOYEE_MASTER", label: "Employees" },
      { key: "ATTENDANCE", label: "Attendance" },
      { key: "LEAVE_MASTER", label: "Leaves" },
      { key: "PAYROLL", label: "Payroll" },
      { key: "HOLIDAYS", label: "Holidays" },
    ],
  },
  {
    key: "FORMS",
    label: "Forms",
    children: [
      { key: "PF_FORMS", label: "Provident Fund (PF)" },
      { key: "ESIC_FORMS", label: "ESIC Forms" },
      { key: "FORM_16", label: "Income Tax (Form-16)" },
      { key: "BONUS_ACT", label: "Bonus Act Forms" },
      { key: "LABOUR_LAW", label: "Attendance / Labour Law" },
      { key: "FACTORIES_ACT", label: "Factories Act Forms" },
      { key: "GRATUITY_ACT", label: "Gratuity Act Forms" },
    ],
  },
  {
    key: "REPORTS",
    label: "Reports",
    children: [
      { key: "EMPLOYEE_REPORTS", label: "Employee Reports" },
      { key: "ATTENDANCE_REPORTS", label: "Attendance Reports" },
      { key: "LEAVE_REPORTS", label: "Leave Reports" },
      { key: "SALARY_REPORTS", label: "Salary Reports" },
    ],
  },
];

/* =====================================================
   HELPERS
===================================================== */
const buildInitialState = () => {
  const state = {};
  PERMISSION_GROUPS.forEach((g) =>
    g.children.forEach((c) => (state[c.key] = false))
  );
  return state;
};

export default function HRPermissions() {
  const { hrId } = useParams();
  const navigate = useNavigate();

  const [selectedHR, setSelectedHR] = useState(null);
  const [permissions, setPermissions] = useState(buildInitialState());
  const [loading, setLoading] = useState(false);

  /* =====================================================
     LOAD HR
  ===================================================== */
  useEffect(() => {
    const loadHR = async () => {
      const res = await getHRList();
      const list = Array.isArray(res?.data) ? res.data : [];
      const hr = list.find((h) => h.id === Number(hrId));

      if (!hr) {
        navigate("/admin/hr-management", { replace: true });
        return;
      }
      setSelectedHR(hr);
    };
    loadHR();
  }, [hrId, navigate]);

  /* =====================================================
     LOAD PERMISSIONS
  ===================================================== */
  useEffect(() => {
    if (!selectedHR) return;

    const loadPermissions = async () => {
      setLoading(true);
      try {
        const data = await getHRPermissions(selectedHR.id);
        if (!Array.isArray(data)) return;

        setPermissions((prev) => {
          const updated = { ...prev };
          data.forEach((p) => {
            if (updated.hasOwnProperty(p.module_key)) {
              updated[p.module_key] = !!p.allowed;
            }
          });
          return updated;
        });
      } finally {
        setLoading(false);
      }
    };

    loadPermissions();
  }, [selectedHR]);

  /* =====================================================
     TOGGLES
  ===================================================== */
  const toggleItem = (key) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleGroup = (group, value) => {
    setPermissions((prev) => {
      const updated = { ...prev };
      group.children.forEach((c) => {
        updated[c.key] = value;
      });
      return updated;
    });
  };

  const toggleAll = (value) => {
    setPermissions((prev) => {
      const updated = {};
      Object.keys(prev).forEach((k) => (updated[k] = value));
      return updated;
    });
  };

  /* =====================================================
     CHECK STATES
  ===================================================== */
  const isGroupChecked = (group) =>
    group.children.every((c) => permissions[c.key]);

  const isGroupIndeterminate = (group) =>
    group.children.some((c) => permissions[c.key]) &&
    !isGroupChecked(group);

  const isAllChecked = () =>
    Object.values(permissions).every(Boolean);

  /* =====================================================
     SAVE
  ===================================================== */
  const save = async () => {
    const payload = Object.entries(permissions).map(
      ([module_key, allowed]) => ({ module_key, allowed })
    );

    await saveHRPermissions(selectedHR.id, {
      branch_id: selectedHR.branch_id,
      department_id: selectedHR.department_id,
      permissions: payload,
    });

    alert("Permissions saved successfully");
  };

  /* =====================================================
     UI
  ===================================================== */
  return (
    <div className="hr-permissions-page">
      <h2>HR Permissions</h2>

      <div className="hr-context">
        <strong>HR:</strong> {selectedHR?.emp_id} |{" "}
        <strong>Branch:</strong> {selectedHR?.branch_name} |{" "}

      </div>

      <div className="select-all">
        <label>
          <input
            type="checkbox"
            checked={isAllChecked()}
            onChange={(e) => toggleAll(e.target.checked)}
          />
          Select All Permissions
        </label>
      </div>

      {PERMISSION_GROUPS.map((group) => (
        <div className="permission-group" key={group.key}>
          <label className="group-header">
            <input
              type="checkbox"
              checked={isGroupChecked(group)}
              ref={(el) => {
                if (el) el.indeterminate = isGroupIndeterminate(group);
              }}
              onChange={(e) =>
                toggleGroup(group, e.target.checked)
              }
            />
            {group.label}
          </label>

          <div className="permission-grid">
            {group.children.map((item) => (
              <label key={item.key} className="permission-item">
                <input
                  type="checkbox"
                  checked={permissions[item.key]}
                  onChange={() => toggleItem(item.key)}
                />
                {item.label}
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="actions">
        <button
          className="secondary"
          onClick={() => navigate("/admin/hr-management")}
        >
          <FaArrowLeft /> Back
        </button>

        <button className="primary" onClick={save}>
          <FaSave /> Save
        </button>
      </div>
    </div>
  );
}
