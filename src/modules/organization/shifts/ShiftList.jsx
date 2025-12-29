import React from "react";
import "../../../styles/Shifts.css";

export default function ShiftList({ branches, selectedBranch, onBranchChange, shifts, onAdd, onEdit, onDelete, onToggleStatus, user }) {
  const isAdmin = user?.role === "COMPANY_ADMIN";
  const isHR = user?.role === "HR";

  const canCreate = isAdmin;
  const canEdit = isAdmin || isHR;
  const canDelete = isAdmin;

  const formatTime = (time) => {
    if (!time) return "—";
    if (time.includes(":")) {
      const [h, m] = time.split(":");
      return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
    }
    return time;
  };

  return (
    <>
      <h2>Shift Management</h2>

      <div className="shifts-header-controls">
        <select
          value={selectedBranch}
          onChange={(e) => onBranchChange(e.target.value)}
          className="branch-select"
        >
          <option value="">— Select Branch —</option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.branch_name}
            </option>
          ))}
        </select>
        {canCreate && selectedBranch && (
          <button onClick={onAdd} className="btn-add">
            Add Shift
          </button>
        )}
      </div>

      {!selectedBranch ? (
        <div className="hint warning">Please select a branch to manage shifts.</div>
      ) : (
        <div className="card">
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Shift Name</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Status</th>
                  <th>Description</th>
                  {(canEdit || canDelete) && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {shifts.length === 0 ? (
                  <tr>
                    <td colSpan={canEdit || canDelete ? 5 : 4} className="empty-state">
                      No shifts found
                    </td>
                  </tr>
                ) : (
                  shifts.map((shift) => (
                    <tr key={shift.id}>
                      <td>{shift.shift_name || shift.name}</td>
                      <td>{formatTime(shift.start_time)}</td>
                      <td>{formatTime(shift.end_time)}</td>
                      <td>
                        <span className={`status-badge ${shift.is_active ? "active" : "inactive"}`}>
                          {shift.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <span className="description-text">
                          {shift.description || "—"}
                        </span>
                      </td>
                      {(canEdit || canDelete) && (
                        <td className="row-actions">
                          <button
                            className={shift.is_active ? "warning" : "success"}
                            onClick={() => onToggleStatus(shift)}
                          >
                            {shift.is_active ? "Disable" : "Enable"}
                          </button>
                          {canEdit && (
                            <button onClick={() => onEdit(shift)}>
                              Edit
                            </button>
                          )}
                          {canDelete && (
                            <button
                              className="danger"
                              onClick={() => onDelete(shift.id)}
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

