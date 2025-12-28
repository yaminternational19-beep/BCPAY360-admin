import React, { useEffect, useState } from "react";
import "../../../styles/Branch.css";
import BranchForm from "./BranchForm";

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

  const loadBranches = async () => {
    try {
      const res = await authFetch(`${API}/api/branches`);
      if (res.ok) {
        const data = await res.json();
        setBranches(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      setBranches([]);
    }
  };

  const loadCompanies = async () => {
    try {
      const res = await authFetch(`${API}/api/companies`);
      if (res.ok) {
        const data = await res.json();
        setCompanies(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      setCompanies([]);
    }
  };

  useEffect(() => {
    loadBranches();
    loadCompanies();
  }, []);

  const handleSave = async (payload) => {
    setLoading(true);
    try {
      if (selected) {
        const res = await authFetch(`${API}/api/branches/${selected.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setShowForm(false);
          setSelected(null);
          loadBranches();
        }
      } else {
        const res = await authFetch(`${API}/api/branches`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setShowForm(false);
          loadBranches();
        }
      }
    } catch (error) {
      console.error("Failed to save branch:", error);
      alert("Failed to save branch. Please try again.");
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
      const res = await authFetch(`${API}/api/branches/${id}`, {
        method: "PUT",
        body: JSON.stringify({ is_active: newStatus }),
      });
      if (res.ok) {
        loadBranches();
      }
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
          companies={companies}
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

