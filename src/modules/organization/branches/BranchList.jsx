import React, { useEffect, useState } from "react";
import "../../../styles/Branch.css";
import BranchForm from "./BranchForm";
import {
  getBranches,
  createBranch,
  updateBranch,
  toggleBranchStatus,
  deleteBranch,
} from "../../../api/master.api";



import { FaPlus, FaEdit, FaPowerOff, FaTrash, FaEye, FaBan } from "react-icons/fa";

export default function BranchList({ user }) {
  const isAdmin = user?.role === "COMPANY_ADMIN";

  const canCreate = isAdmin;
  const canEdit = isAdmin;
  const canDelete = isAdmin;

  const [branches, setBranches] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadBranches = async () => {
    try {
      setLoading(true);
      const data = await getBranches();
      setBranches(Array.isArray(data) ? data : []);
    } catch (error) {
      setBranches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBranches();
  }, []);

  const handleSave = async (payload) => {
    try {
      if (selected) {
        await updateBranch(selected.id, payload);
        setShowForm(false);
        setSelected(null);
        loadBranches();
      } else {
        await createBranch(payload);
        setShowForm(false);
        loadBranches();
      }
    } catch (error) {
      console.error("Failed to save branch:", error);
      alert(error.message || "Failed to save branch. Please try again.");
    }
  };

  const handleEdit = (id) => {
    const branch = branches.find((b) => b.id === id);
    if (branch) {
      setSelected(branch);
      setShowForm(true);
    }
  };

  const handleToggleStatus = async (id) => {
    const branch = branches.find((b) => b.id === id);
    if (!branch) return;

    const newStatus = !branch.is_active;
    if (!confirm(`${newStatus ? "Activate" : "Deactivate"} branch "${branch.branch_name}"?`)) return;

    try {
      await toggleBranchStatus(id);
      loadBranches();
    } catch (error) {
      console.error("Failed to update branch status:", error);
      alert("Failed to update branch status.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this branch?")) return;

    try {
      await deleteBranch(id);
      loadBranches();
    } catch (error) {
      console.error("Failed to delete branch:", error);
      alert("Failed to delete branch.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="branch-page">
      <div className="branch-header">
        <h2>Branches</h2>
        {canCreate && (
          <button
            className="btn-primary"
            onClick={() => {
              setSelected(null);
              setShowForm(true);
            }}
          >
            <FaPlus /> Add Branch
          </button>
        )}
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Branch Name</th>
                <th>Code</th>
                <th>Location</th>
                <th>Status</th>
                {(canEdit || canDelete) && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "40px" }}>Loading branches...</td>
                </tr>
              ) : branches.length === 0 ? (
                <tr>
                  <td colSpan={canEdit || canDelete ? 6 : 5} className="empty-state">
                    No branches found
                  </td>
                </tr>
              ) : (
                branches.map((branch) => (
                  <tr key={branch.id}>
                    <td style={{ fontWeight: 600 }}>{branch.branch_name || branch.name}</td>
                    <td>{branch.branch_code || "—"}</td>
                    <td>{branch.location || "—"}</td>
                    <td>
                      <span className={`status-badge ${branch.is_active ? "active" : "inactive"}`}>
                        {branch.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>{formatDate(branch.created_at || branch.created_date)}</td>
                    <td>
                      <div className="row-actions">
                        <button
                          className="btn-action btn-action-view"
                          onClick={() => handleEdit(branch.id)}
                          title="View Details"
                        >
                          <FaEye />
                        </button>

                        {canEdit && (
                          <button
                            className="btn-action btn-action-edit"
                            onClick={() => handleEdit(branch.id)}
                            title="Edit Branch"
                          >
                            <FaEdit />
                          </button>
                        )}

                        {canEdit && (
                          <button
                            onClick={() => handleToggleStatus(branch.id)}
                            className={`btn-action btn-action-toggle ${branch.is_active ? "active" : "inactive"}`}
                            title={branch.is_active ? "Deactivate" : "Activate"}
                          >
                            <FaBan />
                          </button>
                        )}

                        {canDelete && (
                          <button
                            className="btn-action btn-action-delete"
                            onClick={() => handleDelete(branch.id)}
                            title="Delete Branch"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <BranchForm
          initial={selected}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setSelected(null);
          }}
        />
      )}
    </div>
  );
}

