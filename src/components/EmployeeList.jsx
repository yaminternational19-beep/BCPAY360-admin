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
  const [openActionId, setOpenActionId] = useState(null);

  const pageSize = 20;

  /* =====================
     DEPARTMENTS (from data)
  ===================== */
  const depts = useMemo(
    () => ["All", ...new Set(employees.map(e => e.department))],
    [employees]
  );

  /* =====================
     ROLES (dependent)
  ===================== */
  const roles = useMemo(() => {
    if (dept === "All") return ["All"];
    return [
      "All",
      ...new Set(
        employees
          .filter(e => e.department === dept)
          .map(e => e.role)
      ),
    ];
  }, [employees, dept]);

  /* =====================
     FILTER + SORT
  ===================== */
  const filtered = useMemo(() => {
    let list = employees.filter(e => showInactive || e.active);

    if (q) {
      const qq = q.toLowerCase().trim();

      list = list.filter(e => {
        const normalizedId = e.id.replace("EMP", "").toLowerCase(); // 005
        const numericId = String(parseInt(normalizedId, 10));       // 5

        return (
          e.id.toLowerCase().includes(qq) ||   // EMP005
          normalizedId.includes(qq) ||         // 005
          numericId === qq ||                  // 5
          e.name.toLowerCase().includes(qq) ||
          e.email.toLowerCase().includes(qq) ||
          e.phone.includes(qq)
        );
      });
    }

    if (dept !== "All") list = list.filter(e => e.department === dept);
    if (role !== "All") list = list.filter(e => e.role === role);

    return [...list].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "joiningDate") return a.joiningDate.localeCompare(b.joiningDate);
      if (sortBy === "salary") return b.salary - a.salary;

      const aid = parseInt(a.id.replace("EMP", ""), 10);
      const bid = parseInt(b.id.replace("EMP", ""), 10);
      return aid - bid;
    });
  }, [employees, q, dept, role, showInactive, sortBy]);

  useEffect(() => {
    setPage(1);
  }, [q, dept, role, showInactive]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="employee-list-wrap">
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
          <option value="joiningDate">Sort: Joining Date</option>
          <option value="salary">Sort: Salary</option>
        </select>

        <label className="toggle">
          <input
            type="checkbox"
            checked={showInactive}
            onChange={e => setShowInactive(e.target.checked)}
          />
          <span>Show Inactive</span>
        </label>
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
              <td>
                <span className={`status ${emp.active ? "active" : "inactive"}`}>
                  {emp.active ? "Active" : "Inactive"}
                </span>
              </td>

              {/* ACTION MENU */}
              <td className="actions">
                <div className="action-menu">
                  <button
                    className="action-trigger"
                    onClick={() =>
                      setOpenActionId(openActionId === emp.id ? null : emp.id)
                    }
                  >
                    ⋮
                  </button>

                  {openActionId === emp.id && (
                    <div className="action-dropdown">
                      <button onClick={() => { onEdit(emp.id); setOpenActionId(null); }}>
                        ✏️ Edit
                      </button>

                      {emp.active ? (
                        <button onClick={() => { onDeactivate(emp.id); setOpenActionId(null); }}>
                          🚫 Deactivate
                        </button>
                      ) : (
                        <button onClick={() => { onActivate(emp.id); setOpenActionId(null); }}>
                          ✅ Activate
                        </button>
                      )}

                      <button
                        className="danger"
                        onClick={() => { onDelete(emp.id); setOpenActionId(null); }}
                      >
                        🗑 Delete
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* FOOTER */}
      <div className="list-footer">
        <span>
          Showing {(page - 1) * pageSize + 1} –
          {Math.min(page * pageSize, filtered.length)} of {filtered.length}
        </span>

        <Pagination
          page={page}
          totalPages={totalPages}
          onPage={p => setPage(p)}
        />
      </div>
    </div>
  );
};

export default EmployeeList;
