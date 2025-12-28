import React, { useMemo, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import "../../../styles/EmployeeList.css";

import {
  Eye,
  Pencil,
  Trash2,
  Ban,
  CheckCircle,
} from "lucide-react";

const onEdit = (id) => {
  setSelectedEmployeeId(id);
  setShowForm(true);
};


/* =====================
   Pagination
===================== */
const Pagination = ({ page, totalPages, onPage }) => (
  <div className="pagination">
    <button disabled={page === 1} onClick={() => onPage(1)}>{"<<"}</button>
    <button disabled={page === 1} onClick={() => onPage(page - 1)}>{"<"}</button>
    <span>{page} / {totalPages}</span>
    <button disabled={page === totalPages} onClick={() => onPage(page + 1)}>{">"}</button>
    <button disabled={page === totalPages} onClick={() => onPage(totalPages)}>{">>"}</button>
  </div>
);

const EmployeeList = ({
  employees = [],
  onEdit,
  onDeactivate,
  onActivate,
  onDelete,
}) => {
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("All");
  const [designation, setDesignation] = useState("All");
  const [inactiveOnly, setInactiveOnly] = useState(false);
  const [sortBy, setSortBy] = useState("employee_code");
  const [page, setPage] = useState(1);

  const wrapperRef = useRef(null);
  const pageSize = 20;

  /* =====================
     FILTER OPTIONS
  ===================== */
  const depts = useMemo(
    () => ["All", ...new Set(employees.map(e => e.department).filter(Boolean))],
    [employees]
  );

  const designations = useMemo(() => {
    if (dept === "All") return ["All"];
    return [
      "All",
      ...new Set(
        employees
          .filter(e => e.department === dept)
          .map(e => e.designation)
          .filter(Boolean)
      ),
    ];
  }, [employees, dept]);

  /* =====================
     FILTER + SORT
  ===================== */
  const filtered = useMemo(() => {
    let list = [...employees];

    if (inactiveOnly) list = list.filter(e => Number(e.is_active) === 0);

    if (q) {
      const qq = q.toLowerCase();
      list = list.filter(
        e =>
          (e.employee_code || "").toLowerCase().includes(qq) ||
          (e.full_name || "").toLowerCase().includes(qq) ||
          (e.email || "").toLowerCase().includes(qq) ||
          (e.phone || "").includes(qq)
      );
    }

    if (dept !== "All") list = list.filter(e => e.department === dept);
    if (designation !== "All") list = list.filter(e => e.designation === designation);

    list.sort((a, b) => {
      if (sortBy === "name") {
        return (a.full_name || "").localeCompare(b.full_name || "");
      }
      if (sortBy === "salary") {
        return Number(b.salary || 0) - Number(a.salary || 0);
      }
      return (a.employee_code || "").localeCompare(b.employee_code || "");
    });

    return list;
  }, [employees, q, dept, designation, inactiveOnly, sortBy]);

  useEffect(() => {
    setPage(1);
  }, [q, dept, designation, inactiveOnly]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice((page - 1) * pageSize, page * pageSize);

  /* =====================
     EXPORT
  ===================== */
  const handleExport = () => {
    if (!filtered.length) return alert("No data to export");

    const exportData = filtered.map(e => ({
      "Employee Code": e.employee_code,
      "Full Name": e.full_name,
      Email: e.email || "",
      Phone: e.phone || "",
      Department: e.department,
      Designation: e.designation,
      "Joining Date": e.joining_date,
      "Employment Type": e.employment_type,
      Salary: e.salary,
      Status: e.is_active ? "Active" : "Inactive",
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Employees");
    XLSX.writeFile(wb, "employees.xlsx");
  };

  return (
    <div className="employee-list-wrap" ref={wrapperRef}>
      {/* FILTER BAR */}
      <div className="list-controls">
        <input
          placeholder="Search Emp Code / Name / Email / Phone"
          value={q}
          onChange={e => setQ(e.target.value)}
        />

        <select
          value={dept}
          onChange={e => {
            setDept(e.target.value);
            setDesignation("All");
          }}
        >
          {depts.map(d => <option key={d}>{d}</option>)}
        </select>

        <select
          value={designation}
          disabled={dept === "All"}
          onChange={e => setDesignation(e.target.value)}
        >
          {designations.map(d => <option key={d}>{d}</option>)}
        </select>

        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="employee_code">Sort: Emp Code</option>
          <option value="name">Sort: Name</option>
          <option value="salary">Sort: Salary</option>
        </select>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={inactiveOnly}
            onChange={e => setInactiveOnly(e.target.checked)}
          />
          Inactive Only
        </label>

        <button
          className="clear-btn"
          onClick={() => {
            setQ("");
            setDept("All");
            setDesignation("All");
            setInactiveOnly(false);
            setSortBy("employee_code");
          }}
        >
          Clear
        </button>

        <button className="export-btn" onClick={handleExport}>
          Export
        </button>
      </div>

      {/* TABLE */}
      <table className="employee-table">
        <thead>
          <tr>
            <th>Photo</th>
            <th>Emp Code</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Joining</th>
            <th>Salary</th>
            <th>Status</th>
            <th className="actions-cell">Actions</th>
          </tr>
        </thead>

        <tbody>
          {current.map(emp => {
            const isActive = Number(emp.is_active) === 1;
            return (
            <tr key={emp.id} className={!isActive ? "inactive-row" : ""}>
              <td><div className="emp-photo-placeholder">👤</div></td>
              <td>{emp.employee_code}</td>
              <td>{emp.full_name}</td>
              <td>{emp.phone || "-"}</td>
              <td>{emp.email || "-"}</td>
              <td>{emp.department}</td>
              <td>{emp.designation}</td>
              <td>{emp.joining_date ? new Date(emp.joining_date).toLocaleDateString() : "-"}</td>
              <td>₹{Number(emp.salary || 0).toLocaleString()}</td>
              <td>
                <span className={`status ${isActive ? "active" : "inactive"}`}>
                  {isActive ? "Active" : "Inactive"}
                </span>
              </td>

              <td className="actions-cell">
                <div className="row-actions">
                  <Link
                    to={`/admin/employee/${emp.id}`}
                    state={{ employee: emp }}
                    className="emp-icon-btn view"
                    title="View"
                  >
                    <Eye size={18} />
                  </Link>


                  <button
                    onClick={() => onEdit(emp.id)}
                    className="emp-icon-btn edit"
                    title="Edit"
                  >
                    <Pencil size={18} />
                  </button>


                  {isActive ? (
                    <button
                      onClick={() => onDeactivate(emp.id)}
                      className="emp-icon-btn deactivate"
                      title="Deactivate"
                    >
                      <Ban size={18} />
                    </button>
                  ) : (
                    <button
                      onClick={() => onActivate(emp.id)}
                      className="emp-icon-btn activate"
                      title="Activate"
                    >
                      <CheckCircle size={18} />
                    </button>
                  )}

                  <button
                    onClick={() => onDelete(emp.id)}
                    className="emp-icon-btn delete"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
            );
          })}
        </tbody>
      </table>

      {/* FOOTER */}
      <div className="list-footer">
        <span>
          Showing {(page - 1) * pageSize + 1} –{" "}
          {Math.min(page * pageSize, filtered.length)} of {filtered.length}
        </span>
        <Pagination page={page} totalPages={totalPages} onPage={setPage} />
      </div>
    </div>
  );
};

export default EmployeeList;
