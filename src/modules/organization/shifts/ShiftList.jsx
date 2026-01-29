import React, { useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaClock, FaSearch } from "react-icons/fa";
import "../../../styles/Shifts.css";

export default function ShiftList({ branches, selectedBranch, onBranchChange, shifts, onAdd, onEdit, onDelete, user }) {
  const isAdmin = user?.role === "COMPANY_ADMIN";
  const isHR = user?.role === "HR";

  const canCreate = isAdmin;
  const canEdit = isAdmin || isHR;
  const canDelete = isAdmin;

  const [searchTerm, setSearchTerm] = useState("");

  const formatTime = (time) => {
    if (!time) return "—";
    if (time.includes(":")) {
      const [h, m] = time.split(":");
      return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
    }
    return time;
  };

  const filteredShifts = shifts.filter(s =>
    (s.shift_name || s.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="shifts-container">
      <div className="shifts-layout-wrapper">
        <div className="shifts-main-panel">

          {/* Unified Header */}
          <div className="shifts-panel-header">
            <div className="header-info">
              <h3>Shift Management</h3>
              <span>Total: {filteredShifts.length}</span>
            </div>

            <div className="header-actions-row">
              <div className="branch-nav-inline">
                <select
                  value={selectedBranch}
                  onChange={(e) => onBranchChange(e.target.value)}
                  className="shifts-branch-dropdown"
                >
                  <option value="">Select Branch</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>{b.branch_name}</option>
                  ))}
                </select>
              </div>

              <div className="search-bar-et">
                <FaSearch className="search-icon" />
                <input
                  placeholder="Search shifts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {canCreate && selectedBranch && (
                <button onClick={onAdd} className="btn-add-shift">
                  <FaPlus /> Add Shift
                </button>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="shifts-list-scroll">
            {!selectedBranch ? (
              <div className="shifts-empty-state">
                <div className="empty-box">
                  <h3>No Branch Selected</h3>
                  <p>Please select a branch to view and manage shifts.</p>
                </div>
              </div>
            ) : filteredShifts.length === 0 ? (
              <div className="no-data-msg">No shifts found for this branch.</div>
            ) : (
              <div className="shifts-grid">
                {filteredShifts.map((shift) => (
                  <div key={shift.id} className="shift-card-item">
                    <div className="shift-header">
                      <div className="shift-name">{shift.shift_name || shift.name}</div>
                      <span className={`status-badge ${shift.is_active ? "active" : "inactive"}`}>
                        {shift.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="shift-time-range">
                      <FaClock size={12} />
                      {formatTime(shift.start_time)} - {formatTime(shift.end_time)}
                    </div>

                    <div className="shift-desc">
                      {shift.description || "No description provided."}
                    </div>

                    {(canEdit || canDelete) && (
                      <div className="shift-actions">
                        {canEdit && (
                          <button onClick={() => onEdit(shift)} title="Edit Shift">
                            <FaEdit />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            className="btn-trash"
                            onClick={() => onDelete(shift.id)}
                            title="Delete Shift"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

