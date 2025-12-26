import React, { useEffect, useState } from "react";
import "../styles/Shifts.css";

const API = import.meta.env.VITE_API_BASE_URL;

export default function Shifts({ user }) {
  const isAdmin = user?.role === "COMPANY_ADMIN";
  const isHR = user?.role === "HR";

  const canCreate = isAdmin;
  const canEdit = isAdmin || isHR;
  const canDelete = isAdmin;

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

  const authFetch = (url, options = {}) => {
    const token = localStorage.getItem("token");
    return fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  };

  const loadShifts = async () => {
    try {
      const res = await authFetch(`${API}/api/shifts`);
      if (res.ok) {
        const data = await res.json();
        setShifts(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      setShifts([]);
    }
  };

  useEffect(() => {
    loadShifts();
  }, []);

  const createShift = async () => {
    if (!canCreate || !newShift.shift_name.trim() || !newShift.start_time || !newShift.end_time) return;

    setLoading(true);
    try {
      const res = await authFetch(`${API}/api/shifts`, {
        method: "POST",
        body: JSON.stringify({
          shift_name: newShift.shift_name.trim(),
          start_time: newShift.start_time,
          end_time: newShift.end_time,
          description: newShift.description || null,
        }),
      });
      if (res.ok) {
        setNewShift({ shift_name: "", start_time: "", end_time: "", description: "" });
        loadShifts();
      }
    } catch (error) {
      console.error("Failed to create shift:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateShift = async (id) => {
    if (!canEdit) return;

    setLoading(true);
    try {
      const res = await authFetch(`${API}/api/shifts/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          shift_name: editingShift.shift_name.trim(),
          start_time: editingShift.start_time,
          end_time: editingShift.end_time,
          description: editingShift.description || null,
        }),
      });
      if (res.ok) {
        setEditingId(null);
        setEditingShift({ shift_name: "", start_time: "", end_time: "", description: "" });
        loadShifts();
      }
    } catch (error) {
      console.error("Failed to update shift:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteShift = async (id) => {
    if (!canDelete) return;
    if (!confirm("Delete this shift?")) return;

    try {
      await authFetch(`${API}/api/shifts/${id}`, {
        method: "DELETE",
      });
      loadShifts();
    } catch (error) {
      console.error("Failed to delete shift:", error);
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
          <button onClick={createShift} disabled={loading || !canSubmit}>
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
                          <button onClick={() => updateShift(shift.id)} disabled={loading}>
                            Save
                          </button>
                        ) : (
                          <>
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
                                onClick={() => deleteShift(shift.id)}
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
    </div>
  );
}
