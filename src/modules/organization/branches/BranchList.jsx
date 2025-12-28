import React, { useEffect, useState } from "react";
import "../../../styles/Branch.css";
import BranchForm from "./BranchForm";
import {
  getBranches,
  createBranch,
  updateBranch,
  toggleBranchStatus,
} from "../../../api/master.api";

const API = import.meta.env.VITE_API_BASE_URL;

export default function BranchList({ user }) {
  const isAdmin = user?.role === "COMPANY_ADMIN";

  const canCreate = isAdmin;
  const canEdit = isAdmin;
  const canDelete = isAdmin;

  const [branches, setBranches] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);



  const loadBranches = async () => {
    try {
      const data = await getBranches();
      setBranches(Array.isArray(data) ? data : []);
    } catch (error) {
      setBranches([]);
    }
  };

  useEffect(() => {
    loadBranches();
  }, []);

  const handleSave = async (payload) => {
    setLoading(true);
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
      if (error.message && error.message.includes("already exists")) {
        alert(error.message);
      } else {
        alert("Failed to save branch. Please try again.");
      }
    } finally {
      setLoading(false);
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
            Add Branch
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
                <th>Created Date</th>
                {(canEdit || canDelete) && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {branches.length === 0 ? (
                <tr>
                  <td colSpan={canEdit || canDelete ? 6 : 5} className="empty-state">
                    No branches found
                  </td>
                </tr>
              ) : (
                branches.map((branch) => (
                  <tr key={branch.id}>
                    <td>{branch.branch_name || branch.name}</td>
                    <td>{branch.branch_code || "—"}</td>
                    <td>{branch.location || "—"}</td>
                    <td>
                      <span className={`status-badge ${branch.is_active ? "active" : "inactive"}`}>
                        {branch.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>{formatDate(branch.created_at || branch.created_date)}</td>
                    {(canEdit || canDelete) && (
                      <td className="row-actions">
                        {canEdit && (
                          <button onClick={() => handleEdit(branch.id)}>Edit</button>
                        )}
                        {canEdit && (
                          <button
                            onClick={() => handleToggleStatus(branch.id)}
                            className={branch.is_active ? "warning" : "success"}
                          >
                            {branch.is_active ? "Disable" : "Enable"}
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

