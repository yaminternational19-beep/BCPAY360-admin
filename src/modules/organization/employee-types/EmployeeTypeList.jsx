import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaCheck, FaTimes, FaPlus, FaSearch } from "react-icons/fa";
import "../../../styles/EmployeeTypes.css";
import {
  getBranches,
  getEmployeeTypes,
  createEmployeeType,
  updateEmployeeType,
  deleteEmployeeType as apiDeleteEmployeeType,
} from "../../../api/master.api";

export default function EmployeeTypeList({ user }) {
  const isAdmin = user?.role === "COMPANY_ADMIN";
  const isHR = user?.role === "HR";

  const canCreate = isAdmin || isHR;
  const canEdit = isAdmin || isHR;
  const canDelete = isAdmin;

  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [employeeTypes, setEmployeeTypes] = useState([]);
  const [newType, setNewType] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const loadBranches = async () => {
    try {
      const data = await getBranches();
      setBranches(data || []);
    } catch (error) {
      alert("Failed to load employee types: " + error.message);
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
      alert("Failed to create employee type: " + error.message);
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
      alert("Failed to update employee type: " + error.message);
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
      alert("Failed to delete employee type: " + error.message);
    }
  };

  const filteredTypes = employeeTypes.filter(t =>
    (t.type_name || t.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="et-container">
      <div className="et-layout-wrapper">
        <div className="et-main-panel">
          <div className="et-panel-header">
            <div className="header-info">
              <h3>Employee Types</h3>
              <span>Total: {filteredTypes.length}</span>
            </div>

            <div className="header-actions-row">
              <div className="branch-nav-inline">
                <select
                  value={selectedBranch}
                  onChange={(e) => {
                    setSelectedBranch(e.target.value);
                    loadEmployeeTypes(e.target.value);
                  }}
                  className="et-branch-dropdown"
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
                  placeholder="Search types..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {selectedBranch && canCreate && (
                <div className="add-et-row">
                  <input
                    placeholder="New Employee Type"
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleCreateEmployeeType()}
                  />
                  <button
                    onClick={handleCreateEmployeeType}
                    disabled={loading || !newType.trim()}
                    className="btn-add-et"
                  >
                    <FaPlus /> Add Type
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="et-list-scroll">
            {!selectedBranch ? (
              <div className="no-data-msg">Please select a branch above to view employee types.</div>
            ) : filteredTypes.length === 0 ? (
              <div className="no-data-msg">No employee types found.</div>
            ) : (
              <div className="et-grid-modern">
                {filteredTypes.map((type) => (
                  <div key={type.id} className="et-card-item">
                    {editingId === type.id ? (
                      <div className="et-edit-row">
                        <input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          autoFocus
                          onKeyPress={(e) => e.key === "Enter" && handleUpdateEmployeeType(type.id)}
                        />
                        <div className="edit-controls">
                          <button onClick={() => handleUpdateEmployeeType(type.id)} className="btn-tick"><FaCheck /></button>
                          <button onClick={() => setEditingId(null)} className="btn-cross"><FaTimes /></button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="et-info">
                          <span className="t-name">{type.type_name || type.name}</span>
                          <span className={`status-pill ${type.is_active ? "active" : "inactive"}`}>
                            {type.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <div className="et-actions-btns">
                          {canEdit && (
                            <button
                              onClick={() => {
                                setEditingId(type.id);
                                setEditingName(type.type_name || type.name);
                              }}
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              className="btn-trash"
                              onClick={() => handleDeleteEmployeeType(type.id)}
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                      </>
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

