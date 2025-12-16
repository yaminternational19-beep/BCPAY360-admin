import React, { useMemo, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/EmployeeList.css";

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
  employees,
  onEdit,
  onDeactivate,
  onActivate,
  onDelete,
}) => {
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("All");
  const [role, setRole] = useState("All");
  const [inactiveOnly, setInactiveOnly] = useState(false);
  const [sortBy, setSortBy] = useState("id");
  const [page, setPage] = useState(1);
  const [activeRow, setActiveRow] = useState(null);

  const wrapperRef = useRef(null);
  const pageSize = 20;

  /* =====================
     CLOSE ACTIONS ON OUTSIDE CLICK
  ===================== */
  useEffect(() => {
    const close = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setActiveRow(null);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  /* =====================
     FILTER DATA
  ===================== */
  const depts = useMemo(
    () => ["All", ...new Set(employees.map(e => e.department))],
    [employees]
  );

  const roles = useMemo(() => {
    if (dept === "All") return ["All"];
    return ["All", ...new Set(
      employees.filter(e => e.department === dept).map(e => e.role)
    )];
  }, [employees, dept]);

  const filtered = useMemo(() => {
    let list = employees;

    if (inactiveOnly) list = list.filter(e => !e.active);

    if (q) {
      const qq = q.toLowerCase().trim();
      list = list.filter(e =>
        e.id.toLowerCase().includes(qq) ||
        e.name.toLowerCase().includes(qq) ||
        e.email.toLowerCase().includes(qq) ||
        e.phone.includes(qq)
      );
    }

    if (dept !== "All") list = list.filter(e => e.department === dept);
    if (role !== "All") list = list.filter(e => e.role === role);

    return [...list].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "salary") return b.salary - a.salary;
      return parseInt(a.id.slice(3)) - parseInt(b.id.slice(3));
    });
  }, [employees, q, dept, role, inactiveOnly, sortBy]);

  useEffect(() => setPage(1), [q, dept, role, inactiveOnly]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="employee-list-wrap" ref={wrapperRef}>
      {/* FILTER BAR */}
      <div className="list-controls">
        <input
          placeholder="Search EMP ID / Name / Email / Phone"
          value={q}
          onChange={e => setQ(e.target.value)}
        />

        <select value={dept} onChange={e => { setDept(e.target.value); setRole("All"); }}>
          {depts.map(d => <option key={d}>{d}</option>)}
        </select>

        <select value={role} disabled={dept === "All"} onChange={e => setRole(e.target.value)}>
          {roles.map(r => <option key={r}>{r}</option>)}
        </select>

        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="id">Sort: ID</option>
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
            setRole("All");
            setInactiveOnly(false);
            setSortBy("id");
          }}
        >
          Clear
        </button>

        <button className="export-btn">Export</button>
      </div>

      {/* TABLE */}
      <table className="employee-table">
        <thead>
          <tr>
            <th>Profile</th>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Department</th>
            <th>Role</th>
            <th>Joining</th>
            <th>Salary</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {current.map(emp => (
            <tr key={emp.id} className={!emp.active ? "inactive-row" : ""}>
              <td>
                <img
                  src={emp.avatar}
                  alt={emp.name}
                  className="emp-avatar"
                />
              </td>
              <td>{emp.id}</td>
              <td>{emp.name}</td>
              <td>{emp.phone}</td>
              <td>{emp.email}</td>
              <td>{emp.department}</td>
              <td>{emp.role}</td>
              <td>{emp.joiningDate}</td>
              <td>₹{emp.salary.toLocaleString()}</td>
              <td>
                <span className={`status ${emp.active ? "active" : "inactive"}`}>
                  {emp.active ? "Active" : "Inactive"}
                </span>
              </td>
              <td>
                <div className="row-actions">
                  <Link
                      to={`/admin/employee/${emp.id}`}
                      state={{ employee: emp }}
                      className="view"
                    >
                      View
                    </Link>

                  <button onClick={() => onEdit(emp.id)} className="edit">
                    Edit
                  </button>

                  {emp.active ? (
                    <button onClick={() => onDeactivate(emp.id)} className="deactivate">
                      Deactivate
                    </button>
                  ) : (
                    <button onClick={() => onActivate(emp.id)} className="activate">
                      Activate
                    </button>
                  )}

                  <button onClick={() => onDelete(emp.id)} className="delete">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
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
