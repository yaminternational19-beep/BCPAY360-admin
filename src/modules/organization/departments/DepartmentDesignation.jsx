import React, { useEffect, useState } from "react";
import "../../../styles/DepartmentDesignation.css";

const API = import.meta.env.VITE_API_BASE_URL;

export default function DepartmentDesignation({ user }) {
    const isAdmin = user?.role === "COMPANY_ADMIN";
    const isHR = user?.role === "HR";

    /* ===============================
       PERMISSIONS
    ================================ */
    const canCreateDepartment = isAdmin;
    const canEditDepartment = isAdmin;
    const canDeleteDepartment = isAdmin;

    const canCreateDesignation = isAdmin || isHR;
    const canEditDesignation = isAdmin || isHR;
    const canDeleteDesignation = isAdmin || isHR;

    /* ===============================
       STATE
    ================================ */
    const [branches, setBranches] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);

    const [selectedBranch, setSelectedBranch] = useState("");
    const [selectedDept, setSelectedDept] = useState(null);

    const [newDept, setNewDept] = useState("");
    const [newDesignation, setNewDesignation] = useState("");

    const [editingDeptId, setEditingDeptId] = useState(null);
    const [editingDeptName, setEditingDeptName] = useState("");

    const [editingDesigId, setEditingDesigId] = useState(null);
    const [editingDesigName, setEditingDesigName] = useState("");

    const [loading, setLoading] = useState(false);

    /* ===============================
       AUTH FETCH
    ================================ */
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

    /* ===============================
       LOADERS
    ================================ */
    const loadBranches = async () => {
        const res = await authFetch(`${API}/api/branches`);
        if (res.ok) setBranches(await res.json());
    };

    const loadDepartments = async (branchId) => {
        setDepartments([]);
        setSelectedDept(null);
        setDesignations([]);

        if (!branchId) return;

        const res = await authFetch(
            `${API}/api/departments?branch_id=${branchId}`
        );
        if (res.ok) setDepartments(await res.json());
    };

    const loadDesignations = async (dept, branchId) => {
        setSelectedDept(dept);
        setDesignations([]);

        if (!dept || !branchId) return;

        const res = await authFetch(
            `${API}/api/designations?department_id=${dept.id}&branch_id=${branchId}`
        );
        if (res.ok) setDesignations(await res.json());
    };

    useEffect(() => {
        loadBranches();
    }, []);

    /* ===============================
       DEPARTMENT ACTIONS
    ================================ */
    const createDepartment = async () => {
        if (!canCreateDepartment || !newDept.trim() || !selectedBranch) return;

        setLoading(true);
        const res = await authFetch(`${API}/api/departments`, {
            method: "POST",
            body: JSON.stringify({
                department_name: newDept.trim(),
                branch_id: Number(selectedBranch),
            }),
        });
        setLoading(false);

        if (res.ok) {
            setNewDept("");
            loadDepartments(selectedBranch);
        }
    };

    const updateDepartment = async (id) => {
        if (!canEditDepartment || !editingDeptName.trim()) return;

        setLoading(true);
        const res = await authFetch(`${API}/api/departments/${id}`, {
            method: "PUT",
            body: JSON.stringify({ department_name: editingDeptName }),
        });
        setLoading(false);

        if (res.ok) {
            setEditingDeptId(null);
            loadDepartments(selectedBranch);
        }
    };

    const deleteDepartment = async (dept) => {
        if (!canDeleteDepartment) return;
        if (!confirm("Delete this department?")) return;

        await authFetch(`${API}/api/departments/${dept.id}`, {
            method: "DELETE",
        });

        loadDepartments(selectedBranch);
    };

    /* ===============================
       DESIGNATION ACTIONS
    ================================ */
    const createDesignation = async () => {
        if (
            !canCreateDesignation ||
            !newDesignation.trim() ||
            !selectedDept ||
            !selectedBranch
        )
            return;

        setLoading(true);
        const res = await authFetch(`${API}/api/designations`, {
            method: "POST",
            body: JSON.stringify({
                designation_name: newDesignation.trim(),
                department_id: selectedDept.id,
                branch_id: Number(selectedBranch),
            }),
        });
        setLoading(false);

        if (res.ok) {
            setNewDesignation("");
            loadDesignations(selectedDept, selectedBranch);
        }
    };

    const updateDesignation = async (id) => {
        if (!canEditDesignation || !editingDesigName.trim()) return;

        setLoading(true);
        const res = await authFetch(`${API}/api/designations/${id}`, {
            method: "PUT",
            body: JSON.stringify({
                designation_name: editingDesigName,
            }),
        });
        setLoading(false);

        if (res.ok) {
            setEditingDesigId(null);
            loadDesignations(selectedDept, selectedBranch);
        }
    };

    const deleteDesignation = async (desig) => {
        if (!canDeleteDesignation) return;
        if (!confirm("Delete this designation?")) return;

        await authFetch(`${API}/api/designations/${desig.id}`, {
            method: "DELETE",
        });

        loadDesignations(selectedDept, selectedBranch);
    };

    /* ===============================
       RENDER
    ================================ */
    return (
        <div className="dd-page">
            <div className="dd-content">
                <div className="dd-header">
                    <h2>Departments & Designations</h2>
                </div>

                {/* BRANCH SELECTOR */}
                <div className="branch-selector">
                    <label>Select Working Branch</label>
                    <select
                        value={selectedBranch}
                        onChange={(e) => {
                            const id = e.target.value;
                            setSelectedBranch(id);
                            loadDepartments(id);
                        }}
                    >
                        <option value="">— Select Branch —</option>
                        {branches.map((b) => (
                            <option key={b.id} value={b.id}>
                                {b.branch_name}
                            </option>
                        ))}
                    </select>
                </div>

                {!selectedBranch && (
                    <div className="hint warning">
                        Please select a branch to continue.
                    </div>
                )}

                {selectedBranch && (
                    <div className="dd-grid">
                        {/* LEFT - DEPARTMENTS PANEL */}
                        <div className="card dept-panel">
                            <div className="panel-header">
                                <h3>Departments</h3>
                                {canCreateDepartment && (
                                    <div className="add-section">
                                        <input
                                            placeholder="New Department"
                                            value={newDept}
                                            onChange={(e) => setNewDept(e.target.value)}
                                            onKeyPress={(e) => e.key === "Enter" && createDepartment()}
                                        />
                                        <button
                                            onClick={createDepartment}
                                            disabled={loading || !newDept.trim()}
                                            className="btn-add"
                                        >
                                            Add
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="panel-content">
                                <ul className="dept-list">
                                    {departments.length === 0 ? (
                                        <li className="empty-item">No departments found</li>
                                    ) : (
                                        departments.map((d, index) => (
                                            <li
                                                key={d.id}
                                                className={`dept-item ${selectedDept?.id === d.id ? "active" : ""}`}
                                                onClick={() => loadDesignations(d, selectedBranch)}
                                                style={{ '--item-index': index }}
                                            >
                                                {editingDeptId === d.id ? (
                                                    <div className="edit-mode">
                                                        <input
                                                            value={editingDeptName}
                                                            onChange={(e) => setEditingDeptName(e.target.value)}
                                                            autoFocus
                                                            onKeyPress={(e) => e.key === "Enter" && updateDepartment(d.id)}
                                                        />
                                                        <div className="action-buttons">
                                                            <button
                                                                onClick={() => updateDepartment(d.id)}
                                                                className="btn-save"
                                                            >
                                                                Save
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setEditingDeptId(null);
                                                                    setEditingDeptName("");
                                                                }}
                                                                className="btn-cancel"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <span className="dept-name">{d.department_name}</span>
                                                        <div className="action-buttons">
                                                            {canEditDepartment && (
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setEditingDeptId(d.id);
                                                                        setEditingDeptName(d.department_name);
                                                                    }}
                                                                    className="btn-edit"
                                                                >
                                                                    Edit
                                                                </button>
                                                            )}
                                                            {canDeleteDepartment && (
                                                                <button
                                                                    className="btn-delete"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        deleteDepartment(d);
                                                                    }}
                                                                >
                                                                    Delete
                                                                </button>
                                                            )}
                                                        </div>
                                                    </>
                                                )}
                                            </li>
                                        ))
                                    )}
                                </ul>
                            </div>
                        </div>

                        {/* RIGHT - DESIGNATIONS PANEL */}
                        <div className="card desig-panel">
                            {!selectedDept ? (
                                <div className="panel-placeholder">
                                    <div className="placeholder-icon">←</div>
                                    <p>Select a department to view designations</p>
                                </div>
                            ) : (
                                <>
                                    <div className="panel-header">
                                        <h3>{selectedDept.department_name} - Designations</h3>
                                        {canCreateDesignation && (
                                            <div className="add-section">
                                                <input
                                                    placeholder="New Designation"
                                                    value={newDesignation}
                                                    onChange={(e) => setNewDesignation(e.target.value)}
                                                    onKeyPress={(e) => e.key === "Enter" && createDesignation()}
                                                />
                                                <button
                                                    onClick={createDesignation}
                                                    disabled={loading || !newDesignation.trim()}
                                                    className="btn-add"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="panel-content">
                                        <div className="desig-list">
                                            {designations.length === 0 ? (
                                                <div className="empty-item">No designations found</div>
                                            ) : (
                                                designations.map((d, index) => (
                                                    <div
                                                        key={d.id}
                                                        className="desig-item"
                                                        style={{ '--item-index': index }}
                                                    >
                                                        {editingDesigId === d.id ? (
                                                            <div className="edit-mode">
                                                                <input
                                                                    value={editingDesigName}
                                                                    onChange={(e) => setEditingDesigName(e.target.value)}
                                                                    autoFocus
                                                                    onKeyPress={(e) => e.key === "Enter" && updateDesignation(d.id)}
                                                                />
                                                                <div className="action-buttons">
                                                                    <button
                                                                        onClick={() => updateDesignation(d.id)}
                                                                        className="btn-save"
                                                                    >
                                                                        Save
                                                                    </button>
                                                                    <button
                                                                        onClick={() => {
                                                                            setEditingDesigId(null);
                                                                            setEditingDesigName("");
                                                                        }}
                                                                        className="btn-cancel"
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <span className="desig-name">{d.designation_name}</span>
                                                                <div className="action-buttons">
                                                                    {canEditDesignation && (
                                                                        <button
                                                                            onClick={() => {
                                                                                setEditingDesigId(d.id);
                                                                                setEditingDesigName(d.designation_name);
                                                                            }}
                                                                            className="btn-edit"
                                                                        >
                                                                            Edit
                                                                        </button>
                                                                    )}
                                                                    {canDeleteDesignation && (
                                                                        <button
                                                                            className="btn-delete"
                                                                            onClick={() => deleteDesignation(d)}
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
