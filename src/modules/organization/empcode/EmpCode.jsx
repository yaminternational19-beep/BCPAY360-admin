import React, { useEffect, useState } from "react";
import "./EmpCode.css";
import { getBranches, generateEmployeeCode } from "../../../api/master.api.js";

const EmpCode = () => {
  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState("");
  const [employeeCode, setEmployeeCode] = useState("");
  const [preview, setPreview] = useState("");
  const [exists, setExists] = useState(false);
  const [loading, setLoading] = useState(false);

  /* =========================================
     Fetch branches (dynamic, no static data)
     ========================================= */
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const data = await getBranches();
        setBranches(data || []);
      } catch (err) {
        alert("Failed to fetch branches: " + err.message);
      }
    };
    fetchBranches();
  }, []);

  /* =========================================
     When branch changes → fetch emp code config
     SAME API (no new endpoints)
     ========================================= */
  useEffect(() => {
    if (!branchId) {
      setEmployeeCode("");
      setPreview("");
      setExists(false);
      return;
    }

    const fetchEmpCode = async () => {
      try {
        const res = await generateEmployeeCode({
          branch_id: branchId,
        });

        if (res?.exists) {
          setEmployeeCode(res.employee_code);
          setExists(true);
        } else {
          setEmployeeCode("");
          setExists(false);
        }
      } catch (err) {
        alert("Failed to fetch employee code: " + err.message);
        setEmployeeCode("");
        setExists(false);
      }
    };

    fetchEmpCode();
  }, [branchId]);

  /* =========================================
     Preview next employee code (frontend only)
     ========================================= */
  useEffect(() => {
    if (!employeeCode) {
      setPreview("");
      return;
    }

    const match = employeeCode.match(/(\d+)$/);
    if (!match) {
      setPreview("Invalid code format");
      return;
    }

    const number = match[1];
    const prefix = employeeCode.slice(0, -number.length);

    const next =
      prefix + String(parseInt(number, 10) + 1).padStart(number.length, "0");

    setPreview(next);
  }, [employeeCode]);

  /* =========================================
     Save (Create / Update using SAME API)
     ========================================= */
  const handleSave = async () => {
    if (!branchId || !employeeCode) {
      alert("Branch and employee code are required");
      return;
    }

    try {
      setLoading(true);

      await generateEmployeeCode({
        branch_id: branchId,
        employee_code: employeeCode,
      });

      alert(`Employee code ${exists ? "updated" : "created"} successfully`);
      setExists(true);
    } catch (err) {
      alert(err?.message || "Failed to save employee code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="empcode-container">
      <div className="empcode-card">

        {/* Header */}
        <div className="empcode-header">
          <div className="empcode-title">Employee Code Setup</div>
          <div className="empcode-subtitle">Configure employee code format for each branch</div>
        </div>

        {/* Form Body */}
        <div className="empcode-body">

          {/* Branch Selection */}
          <div className="form-group">
            <label>
              Select Branch <span className="required">*</span>
            </label>
            <select
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
            >
              <option value="">-- Select Branch --</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.branch_name}
                </option>
              ))}
            </select>
            {!branchId && (
              <div className="helper-text">Choose a branch to configure its employee code format</div>
            )}
          </div>

          {/* Employee Code Input */}
          <div className="form-group">
            <label>
              Employee Code <span className="required">*</span>
              {exists && <span className="status-indicator exists">Existing</span>}
              {!exists && branchId && <span className="status-indicator new">New</span>}
            </label>
            <input
              placeholder="e.g. ABC2025001"
              value={employeeCode}
              onChange={(e) => setEmployeeCode(e.target.value.toUpperCase())}
              disabled={!branchId}
            />
            <div className="helper-text">
              Use a format like: BranchCode + Year + Sequential Number
            </div>
          </div>

          {/* Preview Next Code */}
          {preview && !preview.includes("Invalid") && (
            <div className="preview-box">
              <div className="preview-label">Next Employee Code Preview</div>
              <div className="preview-code">{preview}</div>
            </div>
          )}

          {/* Info Box */}
          {branchId && (
            <div className="info-box">
              <strong>Note:</strong> This code format will be used as the base for all new employees in this branch.
              The system will auto-increment the number for each new employee.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="empcode-footer">
          <button className="btn" onClick={handleSave} disabled={loading || !branchId || !employeeCode}>
            {loading ? "Saving..." : exists ? "Update Code Format" : "Create Code Format"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default EmpCode;
