import React, { useState } from "react";
import "../../../styles/LeaveManagement.css";
import useLeaveMaster from "../hooks/useLeaveMaster";
import LeavePolicyForm from "./LeavePolicyForm";

export default function LeavePolicyTable() {
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

  return (
    <section className="card">
      {/* ===== HEADER WITH ADD BUTTON ===== */}
      <div className="card-header">
        <h2>Leave Policy (Master)</h2>
        <button
          className="btn-add-leave"
          onClick={() => {
            setEditData(null);
            setShowForm(true);
          }}
        >
          + Add Leave
        </button>

      </div>

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
          {leaveTypes.length === 0 && (
            <tr>
              <td colSpan="7" className="muted">
                No leave types created
              </td>
            </tr>
          )}

          {leaveTypes.map((l) => (
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
                  className="btn-danger"
                  onClick={() => handleDelete(l.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ===== MODAL (ONLY PLACE IT EXISTS) ===== */}
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
    </section>
  );
}
