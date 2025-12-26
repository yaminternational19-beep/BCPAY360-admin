import React, { useEffect, useState } from "react";
import "../styles/EmployeeTypes.css";

const API = import.meta.env.VITE_API_BASE_URL;

export default function EmployeeTypes({ user }) {
  const isAdmin = user?.role === "COMPANY_ADMIN";
  const isHR = user?.role === "HR";

  const canCreate = isAdmin;
  const canEdit = isAdmin || isHR;
  const canDelete = isAdmin;

  const [employeeTypes, setEmployeeTypes] = useState([]);
  const [newType, setNewType] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
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

  const loadEmployeeTypes = async () => {
    try {
      const res = await authFetch(`${API}/api/employee-types`);
      if (res.ok) {
        const data = await res.json();
        setEmployeeTypes(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      setEmployeeTypes([]);
    }
  };

  useEffect(() => {
    loadEmployeeTypes();
  }, []);

  const createEmployeeType = async () => {
    if (!canCreate || !newType.trim()) return;

    setLoading(true);
    try {
      const res = await authFetch(`${API}/api/employee-types`, {
        method: "POST",
        body: JSON.stringify({ type_name: newType.trim() }),
      });
      if (res.ok) {
        setNewType("");
        loadEmployeeTypes();
      }
    } catch (error) {
      console.error("Failed to create employee type:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateEmployeeType = async (id) => {
    if (!canEdit || !editingName.trim()) return;

    setLoading(true);
    try {
      const res = await authFetch(`${API}/api/employee-types/${id}`, {
        method: "PUT",
        body: JSON.stringify({ type_name: editingName.trim() }),
      });
      if (res.ok) {
        setEditingId(null);
        setEditingName("");
        loadEmployeeTypes();
      }
    } catch (error) {
      console.error("Failed to update employee type:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployeeType = async (id) => {
    if (!canDelete) return;
    if (!confirm("Delete this employee type?")) return;

    try {
      await authFetch(`${API}/api/employee-types/${id}`, {
        method: "DELETE",
      });
      loadEmployeeTypes();
    } catch (error) {
      console.error("Failed to delete employee type:", error);
    }
  };

  return (
    <div className="et-page">
      <h2>Employee Types</h2>

      {canCreate && (
        <div className="et-actions">
          <input
            placeholder="New Employee Type (e.g., Permanent, Contract, Intern)"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && createEmployeeType()}
          />
          <button onClick={createEmployeeType} disabled={loading || !newType.trim()}>
            Add Employee Type
          </button>
        </div>
      )}

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Employee Type</th>
                {(canEdit || canDelete) && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {employeeTypes.length === 0 ? (
                <tr>
                  <td colSpan={canEdit || canDelete ? 2 : 1} className="empty-state">
                    No employee types found
                  </td>
                </tr>
              ) : (
                employeeTypes.map((type) => (
                  <tr key={type.id}>
                    <td>
                      {editingId === type.id ? (
                        <input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === "Enter" && updateEmployeeType(type.id)
                          }
                          autoFocus
                        />
                      ) : (
                        type.type_name || type.name
                      )}
                    </td>
                    {(canEdit || canDelete) && (
                      <td className="row-actions">
                        {editingId === type.id ? (
                          <button onClick={() => updateEmployeeType(type.id)} disabled={loading}>
                            Save
                          </button>
                        ) : (
                          <>
                            {canEdit && (
                              <button
                                onClick={() => {
                                  setEditingId(type.id);
                                  setEditingName(type.type_name || type.name);
                                }}
                              >
                                Edit
                              </button>
                            )}
                            {canDelete && (
                              <button
                                className="danger"
                                onClick={() => deleteEmployeeType(type.id)}
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
