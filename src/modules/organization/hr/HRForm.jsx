import React, { useEffect, useState } from "react";
import "../../../styles/AddHR.css";
import {
  getBranches,
  getDepartments,
  createHR,
  updateHR,
} from "../../../api/master.api";

const normalizeEmpId = (value) => {
  if (!value) return "";
  const digits = value.replace(/\D/g, "");
  return digits ? `EMP${digits.padStart(3, "0")}` : "";
};

export default function HRForm({ initialData = null, onClose, onSuccess }) {
  const isEdit = Boolean(initialData);

  const [branches, setBranches] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [branchId, setBranchId] = useState(initialData?.branch_id || "");
  const [departmentId, setDepartmentId] = useState(
    initialData?.department_id || ""
  );

  const [empIdRaw, setEmpIdRaw] = useState("");
  const [empId, setEmpId] = useState(initialData?.emp_id || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  /* =========================
     LOAD BRANCHES
  ========================= */
  useEffect(() => {
    const load = async () => {
      const data = await getBranches();
      setBranches(Array.isArray(data) ? data : []);
    };
    load();
  }, []);

  /* =========================
     LOAD DEPARTMENTS
  ========================= */
  useEffect(() => {
    if (!branchId) {
      setDepartments([]);
      return;
    }

    const load = async () => {
      const data = await getDepartments(branchId);
      setDepartments(Array.isArray(data) ? data : []);
    };
    load();
  }, [branchId]);

  /* =========================
     EMP ID HANDLER
  ========================= */
  const handleEmpIdChange = (val) => {
    setEmpIdRaw(val);
    setEmpId(normalizeEmpId(val));
  };

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!branchId || !departmentId || !empId) {
      alert("Branch, Department and Employee ID are required");
      return;
    }

    if (!isEdit && password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        emp_id: empId,
        branch_id: Number(branchId),
        department_id: Number(departmentId),
      };

      if (!isEdit) payload.password = password;

      if (isEdit) {
        await updateHR(initialData.id, payload);
      } else {
        await createHR(payload);
      }

      onSuccess?.();
    } catch (err) {
      alert(err.message || "Failed to save HR");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-hr-form-wrapper">
      <form className="add-hr-form" onSubmit={handleSubmit}>
        <h3>{isEdit ? "Edit HR" : "Add HR"}</h3>

        {/* BRANCH */}
        <select
          value={branchId}
          onChange={(e) => {
            setBranchId(e.target.value);
            setDepartmentId("");
          }}
        >
          <option value="">Select Branch</option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.branch_name}
            </option>
          ))}
        </select>

        {/* DEPARTMENT */}
        <select
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
          disabled={!branchId}
        >
          <option value="">
            {branchId ? "Select Department" : "Select branch first"}
          </option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.department_name}
            </option>
          ))}
        </select>

        {/* EMP ID */}
        {!isEdit && (
          <>
            <input
              placeholder="Employee ID (1, 23, emp9)"
              value={empIdRaw}
              onChange={(e) => handleEmpIdChange(e.target.value)}
            />
            {empId && (
              <div className="emp-preview">
                Will be saved as <strong>{empId}</strong>
              </div>
            )}
          </>
        )}

        {/* PASSWORD */}
        {!isEdit && (
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Temporary password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="toggle-btn"
              onClick={() => setShowPassword((p) => !p)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        )}

        {/* ACTIONS */}
        <div className="form-actions">
          <button type="button" className="secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : isEdit ? "Update HR" : "Create HR"}
          </button>
        </div>
      </form>
    </div>
  );
}
