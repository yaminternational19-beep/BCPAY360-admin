import React from "react";
import {
    FaSearch,
    FaFilter,
    FaEye,
    FaUpload,
    FaTrash,
    FaFilePdf,
    FaRedo
} from "react-icons/fa";
import "./FormBase.css";

const FormBase = ({
    formName,
    act,
    children,
    filters = {},
    handlers = {},
    branches = [],
    departments = [],
    employees = [],
    loading = false,
    onView,
    onUpload,
    onDelete
}) => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return (
        <div className="form-container fade-in">
            {/* 1. Header Section */}
            <header className="form-header">
                <div className="header-info">
                    <h1>{formName}</h1>
                    <p className="act-info">{act}</p>
                </div>
                <div className="header-actions">
                    <button className="btn-secondary btn-icon-text">
                        <FaEye size={14} /> View Sample
                    </button>
                    <button className="btn-primary btn-icon-text">
                        <FaFilePdf size={14} /> Generate Form
                    </button>
                    <button className="btn-outline btn-icon-text">
                        <FaRedo size={14} /> Reset
                    </button>
                </div>
            </header>

            {/* 2. Filter Section */}
            <section className="filter-bar sticky-filters shadow-sm">
                <div className="filter-group main-search">
                    <div className="search-wrapper">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search Name or Code..."
                            value={filters.search || ""}
                            onChange={(e) => handlers.onSearch?.(e.target.value)}
                        />
                    </div>
                </div>

                <div className="filter-group">
                    <select
                        value={filters.branch || ""}
                        onChange={(e) => handlers.onBranchChange?.(e.target.value)}
                    >
                        <option value="">Select Branch</option>
                        {branches.map(b => (
                            <option key={b.id || b} value={b.id || b}>{b.name || b}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <select
                        value={filters.department || ""}
                        onChange={(e) => handlers.onDepartmentChange?.(e.target.value)}
                    >
                        <option value="">Select Department</option>
                        {departments.map(d => (
                            <option key={d.id || d} value={d.id || d}>{d.name || d}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group date-filters">
                    <select
                        value={filters.month || months[new Date().getMonth()]}
                        onChange={(e) => handlers.onMonthChange?.(e.target.value)}
                    >
                        {months.map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                    <select
                        value={filters.year || currentYear}
                        onChange={(e) => handlers.onYearChange?.(e.target.value)}
                    >
                        {years.map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>
            </section>

            {/* 3. Employee List Section */}
            <section className="form-content-area card shadow-sm">
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Fetching records...</p>
                    </div>
                ) : employees.length > 0 ? (
                    <div className="table-wrapper">
                        <table className="employee-forms-table">
                            <thead>
                                <tr>
                                    <th>Employee Code</th>
                                    <th>Name</th>
                                    <th>Branch</th>
                                    <th>Department</th>
                                    <th>Period</th>
                                    <th className="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((emp) => (
                                    <tr key={emp.id}>
                                        <td className="font-mono">{emp.employee_code}</td>
                                        <td>{emp.full_name}</td>
                                        <td>{emp.branch?.name || emp.branch || "-"}</td>
                                        <td>{emp.department?.name || emp.department || "-"}</td>
                                        <td>{filters.month || "-"} {filters.year || "-"}</td>
                                        <td>
                                            <div className="row-actions">
                                                <button
                                                    className="action-btn view"
                                                    onClick={() => onView?.(emp)}
                                                    title="View Form"
                                                >
                                                    <FaEye />
                                                </button>
                                                <button
                                                    className="action-btn upload"
                                                    onClick={() => onUpload?.(emp)}
                                                    title="Upload Form"
                                                >
                                                    <FaUpload />
                                                </button>
                                                <button
                                                    className="action-btn delete"
                                                    onClick={() => {
                                                        if (window.confirm(`Delete form for ${emp.full_name}?`)) {
                                                            onDelete?.(emp);
                                                        }
                                                    }}
                                                    title="Delete Form"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="empty-state">
                        <p>No employee records found matching current filters.</p>
                        {/* Backward Compatibility: Still render children if provided */}
                        {children}
                    </div>
                )}
            </section>
        </div>
    );
};

export default FormBase;

