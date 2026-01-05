import React, { useEffect, useState } from "react";
import "../../../styles/EmployeeTypes.css";
import {
  getBranches,
  getEmployeeTypes,
  createEmployeeType,
  updateEmployeeType,
  deleteEmployeeType as apiDeleteEmployeeType,
  toggleEmployeeTypeStatus,
} from "../../../api/master.api";


export default function EmployeeTypeList({ user }) {
  const isAdmin = user?.role === "COMPANY_ADMIN";
  const isHR = user?.role === "HR";

  const canCreate = isAdmin;
  const canEdit = isAdmin || isHR;
  const canDelete = isAdmin;

  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [employeeTypes, setEmployeeTypes] = useState([]);
  const [newType, setNewType] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [loading, setLoading] = useState(false);

  const loadBranches = async () => {
    try {
      const data = await getBranches();
      setBranches(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const loadEmployeeTypes = async (branchId) => {
    if (!branchId) {
      setEmployeeTypes([]);
      return;
    }
    try {
      const data = await getEmployeeTypes(branchId);
      setEmployeeTypes(Array.isArray(data) ? data : []);
    } catch (error) {
      setEmployeeTypes([]);
    }
  };

  useEffect(() => {
    loadBranches();
  }, []);

  const handleCreateEmployeeType = async () => {
    if (!canCreate || !newType.trim() || !selectedBranch) return;

    setLoading(true);
    try {
      await createEmployeeType({
        type_name: newType.trim(),
        branch_id: Number(selectedBranch),
      });
      setNewType("");
      loadEmployeeTypes(selectedBranch);
    } catch (error) {
      if (error.message && error.message.includes("already exists")) {
        alert(error.message);
      } else {
        console.error("Failed to create employee type:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmployeeType = async (id) => {
    if (!canEdit || !editingName.trim()) return;

    setLoading(true);
    try {
      await updateEmployeeType(id, { type_name: editingName.trim() });
      setEditingId(null);
      setEditingName("");
      loadEmployeeTypes(selectedBranch);
    } catch (error) {
      if (error.message && error.message.includes("already exists")) {
        alert(error.message);
      } else {
        console.error("Failed to update employee type:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployeeType = async (id) => {
    if (!canDelete) return;
    if (!confirm("Delete this employee type?")) return;

    try {
      await apiDeleteEmployeeType(id);
      loadEmployeeTypes(selectedBranch);
    } catch (error) {
      console.error("Failed to delete employee type:", error);
    }
  };

  const handleToggleStatus = async (type) => {
    try {
      await toggleEmployeeTypeStatus(type.id);
      loadEmployeeTypes(selectedBranch);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  return (
    <div className="et-page">
      <h2>Employee Types</h2>

      <div className="et-header-controls">
        <select
          value={selectedBranch}
          onChange={(e) => {
            setSelectedBranch(e.target.value);
            loadEmployeeTypes(e.target.value);
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
        <div className="hint warning">Please select a branch to manage employee types.</div>
      ) : (
        <>
          {canCreate && (
            <div className="et-actions">
              <input
                placeholder="New Employee Type (e.g., Permanent, Contract, Intern)"
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleCreateEmployeeType()}
              />
              <button onClick={handleCreateEmployeeType} disabled={loading || !newType.trim()}>
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
                    <th>Status</th>
                    {(canEdit || canDelete) && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {employeeTypes.length === 0 ? (
                    <tr>
                      <td colSpan={canEdit || canDelete ? 3 : 2} className="empty-state">
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
                                e.key === "Enter" && handleUpdateEmployeeType(type.id)
                              }
                              autoFocus
                            />
                          ) : (
                            type.type_name || type.name
                          )}
                        </td>
                        <td>
                          <span className={`status-badge ${type.is_active ? "active" : "inactive"}`}>
                            {type.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        {(canEdit || canDelete) && (
                          <td className="row-actions">
                            {editingId === type.id ? (
                              <button onClick={() => handleUpdateEmployeeType(type.id)} disabled={loading}>
                                Save
                              </button>
                            ) : (
                              <>
                                <button
                                  className={type.is_active ? "warning" : "success"}
                                  onClick={() => handleToggleStatus(type)}
                                >
                                  {type.is_active ? "Disable" : "Enable"}
                                </button>
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
                                    onClick={() => handleDeleteEmployeeType(type.id)}
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

