import React, { useMemo, useState, useEffect } from "react";
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
  const [showInactive, setShowInactive] = useState(false);
  const [sortBy, setSortBy] = useState("id");
  const [page, setPage] = useState(1);

  const pageSize = 20;

  /* =====================
     FILTER OPTIONS
  ===================== */
  const depts = useMemo(
    () => ["All", ...new Set(employees.map(e => e.department))],
    [employees]
  );

  const roles = useMemo(
    () => ["All", ...new Set(employees.map(e => e.role))],
    [employees]
  );

  /* =====================
     FILTER + SORT
  ===================== */
  const filtered = useMemo(() => {
    let list = employees.filter(e => showInactive || e.active);

    if (q) {
      const qq = q.toLowerCase();
      list = list.filter(e =>
        `${e.name} ${e.email} ${e.phone}`.toLowerCase().includes(qq)
      );
    }

    if (dept !== "All") list = list.filter(e => e.department === dept);
    if (role !== "All") list = list.filter(e => e.role === role);

    return [...list].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "joiningDate") return a.joiningDate.localeCompare(b.joiningDate);
      if (sortBy === "salary") return b.salary - a.salary;

      // EMP001 sort
      const aid = parseInt(a.id.replace("EMP", ""), 10);
      const bid = parseInt(b.id.replace("EMP", ""), 10);
      return aid - bid;
    });
  }, [employees, q, dept, role, showInactive, sortBy]);

  /* =====================
     PAGINATION SAFETY
  ===================== */
  useEffect(() => {
    setPage(1);
  }, [q, dept, role, showInactive]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice((page - 1) * pageSize, page * pageSize);

  /* =====================
     CSV EXPORT
  ===================== */
  const exportCSV = () => {
    if (!filtered.length) return;

    const rows = filtered.map(e => ({
      id: e.id,
      name: e.name,
      email: e.email,
      phone: e.phone,
      department: e.department,
      role: e.role,
      joiningDate: e.joiningDate,
      salary: e.salary,
      active: e.active,
    }));

    const csv = [
      Object.keys(rows[0]).join(","),
      ...rows.map(r =>
        Object.values(r).map(v => `"${v}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `employees_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="employee-list-wrap">
      {/* CONTROLS */}
      <div className="list-controls">
        <input
          placeholder="Search name / email / phone"
          value={q}
          onChange={e => setQ(e.target.value)}
        />

        <select value={dept} onChange={e => setDept(e.target.value)}>
          {depts.map(d => <option key={d}>{d}</option>)}
        </select>

        <select value={role} onChange={e => setRole(e.target.value)}>
          {roles.map(r => <option key={r}>{r}</option>)}
        </select>

        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="id">Sort: ID</option>
          <option value="name">Sort: Name</option>
          <option value="joiningDate">Sort: Joining Date</option>
          <option value="salary">Sort: Salary (desc)</option>
        </select>

        <label className="toggle">
          <input
            type="checkbox"
            checked={showInactive}
            onChange={e => setShowInactive(e.target.checked)}
          />
          <span>Show Inactive</span>
        </label>

        <button className="btn" onClick={exportCSV}>Export CSV</button>
      </div>

      {/* TABLE */}
      <table className="employee-table">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Phone</th><th>Email</th>
            <th>Department</th><th>Role</th><th>Joining</th>
            <th>Salary</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {current.map(emp => (
            <tr key={emp.id} className={!emp.active ? "inactive-row" : ""}>
              <td>{emp.id}</td>
              <td>{emp.name}</td>
              <td>{emp.phone}</td>
              <td>{emp.email}</td>
              <td>{emp.department}</td>
              <td>{emp.role}</td>
              <td>{emp.joiningDate}</td>
              <td>₹{emp.salary.toLocaleString()}</td>
              <td>{emp.active ? "Active" : "Inactive"}</td>
              <td className="actions">
                <button onClick={() => onEdit(emp.id)}>Edit</button>
                {emp.active ? (
                  <button onClick={() => onDeactivate(emp.id)}>Deactivate</button>
                ) : (
                  <button onClick={() => onActivate(emp.id)}>Activate</button>
                )}
                <button className="danger" onClick={() => onDelete(emp.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {!current.length && (
            <tr>
              <td colSpan={10} style={{ textAlign: "center" }}>
                No employees found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* FOOTER */}
      <div className="list-footer">
        <div>
          Showing {(page - 1) * pageSize + 1} –
          {Math.min(page * pageSize, filtered.length)} of {filtered.length}
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          onPage={p => {
            setPage(p);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </div>
    </div>
  );
};

export default EmployeeList;
