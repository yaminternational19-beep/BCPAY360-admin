import React, { useEffect, useState } from "react";
import "../../../styles/DepartmentDesignation.css";
import {
    getBranches,
    getDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment as apiDeleteDepartment,
    getDesignations,
    createDesignation,
    updateDesignation,
    deleteDesignation as apiDeleteDesignation,
    toggleDesignationStatus,
} from "../../../api/master.api";

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
    const [newDesignationCode, setNewDesignationCode] = useState("");

    const [editingDeptId, setEditingDeptId] = useState(null);
    const [editingDeptName, setEditingDeptName] = useState("");

    const [editingDesigId, setEditingDesigId] = useState(null);
    const [editingDesigName, setEditingDesigName] = useState("");
    const [editingDesigCode, setEditingDesigCode] = useState("");

    const [loading, setLoading] = useState(false);

    /* ===============================
       AUTH FETCH
    ================================ */


    /* ===============================
       LOADERS
    ================================ */
    const loadBranches = async () => {
        try {
            const data = await getBranches();
            setBranches(data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const loadDepartments = async (branchId) => {
        setDepartments([]);
        setSelectedDept(null);
        setDesignations([]);

        if (!branchId) return;

        try {
            const data = await getDepartments(branchId);
            setDepartments(data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const loadDesignations = async (dept, branchId) => {
        setSelectedDept(dept);
        setDesignations([]);

        if (!dept || !branchId) return;

        try {
            const data = await getDesignations(branchId, dept.id);
            setDesignations(data || []);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadBranches();
    }, []);

    /* ===============================
       DEPARTMENT ACTIONS
    ================================ */
    /* ===============================
       DEPARTMENT ACTIONS
    ================================ */
    const handleCreateDepartment = async () => {
        if (!canCreateDepartment || !newDept.trim() || !selectedBranch) return;

        setLoading(true);
        try {
            await createDepartment({
                department_name: newDept.trim(),
                branch_id: Number(selectedBranch),
            });
            setNewDept("");
            loadDepartments(selectedBranch);
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateDepartment = async (id) => {
        if (!canEditDepartment || !editingDeptName.trim()) return;

        setLoading(true);
        try {
            await updateDepartment(id, { department_name: editingDeptName });
            setEditingDeptId(null);
            loadDepartments(selectedBranch);
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteDepartment = async (dept) => {
        if (!canDeleteDepartment) return;
        if (!confirm("Delete this department?")) return;

        try {
            await apiDeleteDepartment(dept.id);
            loadDepartments(selectedBranch);
        } catch (error) {
            alert(error.message);
        }
    };

    /* ===============================
       DESIGNATION ACTIONS
    ================================ */
    /* ===============================
       DESIGNATION ACTIONS
    ================================ */
    const handleCreateDesignation = async () => {
        if (
            !canCreateDesignation ||
            !newDesignation.trim() ||
            !newDesignationCode.trim() ||
            !selectedDept ||
            !selectedBranch
        )
            return;

        setLoading(true);
        try {
            await createDesignation({
                designation_name: newDesignation.trim(),
                designation_code: newDesignationCode.trim(),
                department_id: selectedDept.id,
                branch_id: Number(selectedBranch),
            });
            setNewDesignation("");
            setNewDesignationCode("");
            loadDesignations(selectedDept, selectedBranch);
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateDesignation = async (id) => {
        if (!canEditDesignation || !editingDesigName.trim() || !editingDesigCode.trim()) return;

        setLoading(true);
        try {
            await updateDesignation(id, {
                designation_name: editingDesigName,
                designation_code: editingDesigCode,
            });
            setEditingDesigId(null);
            loadDesignations(selectedDept, selectedBranch);
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteDesignation = async (desig) => {
        if (!canDeleteDesignation) return;
        if (!confirm("Delete this designation?")) return;

        try {
            await apiDeleteDesignation(desig.id);
            loadDesignations(selectedDept, selectedBranch);
        } catch (error) {
            alert(error.message);
        }
    };

    const handleToggleStatus = async (desig) => {
        try {
            await toggleDesignationStatus(desig.id);
            loadDesignations(selectedDept, selectedBranch);
        } catch (error) {
            alert(error.message);
        }
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
                                            onKeyPress={(e) => e.key === "Enter" && handleCreateDepartment()}
                                        />
                                        <button
                                            onClick={handleCreateDepartment}
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
                                                            onKeyPress={(e) => e.key === "Enter" && handleUpdateDepartment(d.id)}
                                                        />
                                                        <div className="action-buttons">
                                                            <button
                                                                onClick={() => handleUpdateDepartment(d.id)}
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
                                                                        handleDeleteDepartment(d);
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
                                                    placeholder="Designation Name"
                                                    value={newDesignation}
                                                    onChange={(e) => setNewDesignation(e.target.value)}
                                                />
                                                <input
                                                    placeholder="Role Code"
                                                    value={newDesignationCode}
                                                    onChange={(e) => setNewDesignationCode(e.target.value)}
                                                    onKeyPress={(e) => e.key === "Enter" && handleCreateDesignation()}
                                                />
                                                <button
                                                    onClick={handleCreateDesignation}
                                                    disabled={loading || !newDesignation.trim() || !newDesignationCode.trim()}
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
                                                                    placeholder="Name"
                                                                />
                                                                <input
                                                                    value={editingDesigCode}
                                                                    onChange={(e) => setEditingDesigCode(e.target.value)}
                                                                    placeholder="Code"
                                                                    onKeyPress={(e) => e.key === "Enter" && handleUpdateDesignation(d.id)}
                                                                />
                                                                <div className="action-buttons">
                                                                    <button
                                                                        onClick={() => handleUpdateDesignation(d.id)}
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
                                                                <span className="desig-name">
                                                                    {d.designation_name} <small>({d.designation_code})</small>
                                                                </span>
                                                                <div className="action-buttons">
                                                                    <button
                                                                        className={`btn-delete ${d.is_active ? "warning" : "success"}`}
                                                                        onClick={() => handleToggleStatus(d)}
                                                                        style={{ marginLeft: 5 }}
                                                                    >
                                                                        {d.is_active ? "D" : "E"}
                                                                    </button>
                                                                    {canEditDesignation && (
                                                                        <button
                                                                            onClick={() => {
                                                                                setEditingDesigId(d.id);
                                                                                setEditingDesigName(d.designation_name);
                                                                                setEditingDesigCode(d.designation_code || "");
                                                                            }}
                                                                            className="btn-edit"
                                                                        >
                                                                            Edit
                                                                        </button>
                                                                    )}
                                                                    {canDeleteDesignation && (
                                                                        <button
                                                                            className="btn-delete"
                                                                            onClick={() => handleDeleteDesignation(d)}
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