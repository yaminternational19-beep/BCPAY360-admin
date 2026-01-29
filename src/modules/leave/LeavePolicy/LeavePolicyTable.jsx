import React, { useState } from "react";
import "../../../styles/LeaveManagement.css";
import useLeaveMaster from "../hooks/useLeaveMaster";
import LeavePolicyForm from "./LeavePolicyForm";

export default function LeavePolicyTable({ filters }) {
  const {
    leaveTypes,
    loading,
    addLeaveType,
    editLeaveType,
    removeLeaveType,
    toggleStatus
  } = useLeaveMaster();

  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  /* ================= SAVE ================= */
  const handleSave = async (payload) => {
    if (editData) {
      await editLeaveType(editData.id, payload);
    } else {
      await addLeaveType(payload);
    }
    setShowForm(false);
    setEditData(null);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this leave type? This cannot be undone.")) return;
    await removeLeaveType(id);
  };

  // Local Filtering
  const filteredPolicies = leaveTypes.filter(l => {
    const matchesSearch = !filters.search ||
      l.leave_name.toLowerCase().includes(filters.search.toLowerCase()) ||
      l.leave_code.toLowerCase().includes(filters.search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div style={{ position: 'relative' }}>
      {loading && (
        <div className="loading-overlay">
          Loading leave policies...
        </div>
      )}

      {/* ===== TABLE ===== */}
      <table className="clean-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Quota</th>
            <th>Paid</th>
            <th>Carry Forward</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredPolicies.length === 0 && (
            <tr>
              <td colSpan="7" className="muted" style={{ padding: '40px' }}>
                No leave types matched your criteria
              </td>
            </tr>
          )}

          {filteredPolicies.map((l) => (
            <tr key={l.id}>
              <td>{l.leave_code}</td>
              <td>{l.leave_name}</td>
              <td>{l.annual_quota}</td>
              <td>{l.is_paid ? "Yes" : "No"}</td>
              <td>
                {l.allow_carry_forward
                  ? `Yes (${l.max_carry_forward})`
                  : "No"}
              </td>
              <td>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={l.is_active === 1}
                    onChange={() =>
                      toggleStatus(l.id, l.is_active ? 0 : 1)
                    }
                  />
                  <span className="slider" />
                </label>
              </td>
              <td className="actions">
                <button
                  className="btn-edit"
                  onClick={() => {
                    setEditData(l);
                    setShowForm(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn-danger table-action"
                  onClick={() => handleDelete(l.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ===== MODAL ===== */}
      {showForm && (
        <LeavePolicyForm
          initialData={editData}
          onClose={() => {
            setShowForm(false);
            setEditData(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
