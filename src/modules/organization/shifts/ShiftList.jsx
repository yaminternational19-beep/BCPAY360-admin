import React, { useEffect, useState } from "react";
import "../../../styles/Shifts.css";
import {
  getBranches,
  getShifts,
  createShift,
  updateShift,
  deleteShift as apiDeleteShift,
  toggleShiftStatus,
} from "../../../api/master.api";

const API = import.meta.env.VITE_API_BASE_URL;

export default function ShiftList({ user }) {
  const isAdmin = user?.role === "COMPANY_ADMIN";
  const isHR = user?.role === "HR";

  const canCreate = isAdmin;
  const canEdit = isAdmin || isHR;
  const canDelete = isAdmin;

  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [shifts, setShifts] = useState([]);
  const [newShift, setNewShift] = useState({
    shift_name: "",
    start_time: "",
    end_time: "",
    description: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [editingShift, setEditingShift] = useState({
    shift_name: "",
    start_time: "",
    end_time: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const loadBranches = async () => {
    try {
      const data = await getBranches();
      setBranches(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const loadShifts = async (branchId) => {
    if (!branchId) {
      setShifts([]);
      return;
    }
    try {
      const data = await getShifts(branchId);
      setShifts(Array.isArray(data) ? data : []);
    } catch (error) {
      setShifts([]);
    }
  };

  useEffect(() => {
    loadBranches();
  }, []);

  const handleCreateShift = async () => {
    if (!canCreate || !newShift.shift_name.trim() || !newShift.start_time || !newShift.end_time || !selectedBranch) return;

    setLoading(true);
    try {
      await createShift({
        shift_name: newShift.shift_name.trim(),
        start_time: newShift.start_time,
        end_time: newShift.end_time,
        description: newShift.description || null,
        branch_id: Number(selectedBranch),
      });
      setNewShift({ shift_name: "", start_time: "", end_time: "", description: "" });
      loadShifts(selectedBranch);
    } catch (error) {
      if (error.message && error.message.includes("already exists")) {
        alert(error.message);
      } else {
        console.error("Failed to create shift:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateShift = async (id) => {
    if (!canEdit) return;

    setLoading(true);
    try {
      await updateShift(id, {
        shift_name: editingShift.shift_name.trim(),
        start_time: editingShift.start_time,
        end_time: editingShift.end_time,
        description: editingShift.description || null,
      });
      setEditingId(null);
      setEditingShift({ shift_name: "", start_time: "", end_time: "", description: "" });
      loadShifts(selectedBranch);
    } catch (error) {
      if (error.message && error.message.includes("already exists")) {
        alert(error.message);
      } else {
        console.error("Failed to update shift:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteShift = async (id) => {
    if (!canDelete) return;
    if (!confirm("Delete this shift?")) return;

    try {
      await apiDeleteShift(id);
      loadShifts(selectedBranch);
    } catch (error) {
      console.error("Failed to delete shift:", error);
    }
  };

  const handleToggleStatus = async (shift) => {
    try {
      await toggleShiftStatus(shift.id);
      loadShifts(selectedBranch);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const formatTime = (time) => {
    if (!time) return "—";
    if (time.includes(":")) {
      const [h, m] = time.split(":");
      return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
    }
    return time;
  };

  const canSubmit = newShift.shift_name.trim() && newShift.start_time && newShift.end_time;

  return (
    <div className="shifts-page">
      <h2>Shift Management</h2>

      <div className="shifts-header-controls">
        <select
          value={selectedBranch}
          onChange={(e) => {
            setSelectedBranch(e.target.value);
            loadShifts(e.target.value);
          }}
          className="branch-select"
        >
          <option value="">— Select Branch —</option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.branch_name}
            </option>
          ))}
        </select>
      </div>

      {!selectedBranch ? (
        <div className="hint warning">Please select a branch to manage shifts.</div>
      ) : (
        <>
          {canCreate && (
            <div className="shifts-form card">
              <h3>Add New Shift</h3>
              <div className="form-grid">
                <div>
                  <label>Shift Name</label>
                  <input
                    placeholder="e.g., General Shift, Night Shift"
                    value={newShift.shift_name}
                    onChange={(e) =>
                      setNewShift({ ...newShift, shift_name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label>Start Time</label>
                  <input
                    type="time"
                    value={newShift.start_time}
                    onChange={(e) =>
                      setNewShift({ ...newShift, start_time: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label>End Time</label>
                  <input
                    type="time"
                    value={newShift.end_time}
                    onChange={(e) =>
                      setNewShift({ ...newShift, end_time: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label>Description (Optional)</label>
                <textarea
                  placeholder="Additional details about the shift"
                  value={newShift.description}
                  onChange={(e) =>
                    setNewShift({ ...newShift, description: e.target.value })
                  }
                  rows={2}
                />
              </div>
              <button onClick={handleCreateShift} disabled={loading || !canSubmit}>
                Add Shift
              </button>
            </div>
          )}

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
                        <td>
                          {editingId === shift.id ? (
                            <input
                              value={editingShift.shift_name}
                              onChange={(e) =>
                                setEditingShift({
                                  ...editingShift,
                                  shift_name: e.target.value,
                                })
                              }
                              autoFocus
                            />
                          ) : (
                            shift.shift_name || shift.name
                          )}
                        </td>
                        <td>
                          {editingId === shift.id ? (
                            <input
                              type="time"
                              value={editingShift.start_time}
                              onChange={(e) =>
                                setEditingShift({
                                  ...editingShift,
                                  start_time: e.target.value,
                                })
                              }
                            />
                          ) : (
                            formatTime(shift.start_time)
                          )}
                        </td>
                        <td>
                          {editingId === shift.id ? (
                            <input
                              type="time"
                              value={editingShift.end_time}
                              onChange={(e) =>
                                setEditingShift({
                                  ...editingShift,
                                  end_time: e.target.value,
                                })
                              }
                            />
                          ) : (
                            formatTime(shift.end_time)
                          )}
                        </td>
                        <td>
                          <span className={`status-badge ${shift.is_active ? "active" : "inactive"}`}>
                            {shift.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>
                          {editingId === shift.id ? (
                            <textarea
                              value={editingShift.description || ""}
                              onChange={(e) =>
                                setEditingShift({
                                  ...editingShift,
                                  description: e.target.value,
                                })
                              }
                              rows={2}
                            />
                          ) : (
                            <span className="description-text">
                              {shift.description || "—"}
                            </span>
                          )}
                        </td>
                        {(canEdit || canDelete) && (
                          <td className="row-actions">
                            {editingId === shift.id ? (
                              <button onClick={() => handleUpdateShift(shift.id)} disabled={loading}>
                                Save
                              </button>
                            ) : (
                              <>
                                <button
                                  className={shift.is_active ? "warning" : "success"}
                                  onClick={() => handleToggleStatus(shift)}
                                >
                                  {shift.is_active ? "Disable" : "Enable"}
                                </button>
                                {canEdit && (
                                  <button
                                    onClick={() => {
                                      setEditingId(shift.id);
                                      setEditingShift({
                                        shift_name: shift.shift_name || shift.name,
                                        start_time: formatTime(shift.start_time),
                                        end_time: formatTime(shift.end_time),
                                        description: shift.description || "",
                                      });
                                    }}
                                  >
                                    Edit
                                  </button>
                                )}
                                {canDelete && (
                                  <button
                                    className="danger"
                                    onClick={() => handleDeleteShift(shift.id)}
                                  >
                                    Delete
                                  </button>
                                )}
                              </>
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
        </>
      )}
    </div>
  );
}

