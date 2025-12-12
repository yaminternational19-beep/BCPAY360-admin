import React, { useMemo, useState } from "react";
import "../styles/EmployeeList.css";

// simple pagination component inside
const Pagination = ({page, totalPages, onPage}) => (
  <div className="pagination">
    <button disabled={page===1} onClick={()=>onPage(1)}>{"<<"}</button>
    <button disabled={page===1} onClick={()=>onPage(page-1)}>{"<"}</button>
    <span>{page} / {totalPages}</span>
    <button disabled={page===totalPages} onClick={()=>onPage(page+1)}>{">"}</button>
    <button disabled={page===totalPages} onClick={()=>onPage(totalPages)}>{">>"}</button>
  </div>
);

const EmployeeList = ({ employees, onEdit, onDeactivate, onActivate, onSaveDocs, onDelete }) => {
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("All");
  const [role, setRole] = useState("All");
  const [showInactive, setShowInactive] = useState(false);
  const [sortBy, setSortBy] = useState("id");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // departments & roles for filters
  const depts = useMemo(()=>["All", ...Array.from(new Set(employees.map(e=>e.department)))], [employees]);
  const roles = useMemo(()=>["All", ...Array.from(new Set(employees.map(e=>e.role)))], [employees]);

  // filtered + sorted
  const filtered = useMemo(()=>{
    let list = employees.filter(e => showInactive ? true : e.active);
    if (q) {
      const qq = q.toLowerCase();
      list = list.filter(e => `${e.name} ${e.email} ${e.phone}`.toLowerCase().includes(qq));
    }
    if (dept !== "All") list = list.filter(e => e.department === dept);
    if (role !== "All") list = list.filter(e => e.role === role);
    // sort
    list = list.sort((a,b)=> {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "joiningDate") return a.joiningDate.localeCompare(b.joiningDate);
      if (sortBy === "salary") return b.salary - a.salary;
      return a.id - b.id;
    });
    return list;
  }, [employees, q, dept, role, showInactive, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice((page-1)*pageSize, page*pageSize);

  // CSV export (client-side)
  const exportCSV = () => {
    const rows = filtered.map(e => ({
      id: e.id, name: e.name, email: e.email, phone: e.phone,
      department: e.department, role: e.role, joiningDate: e.joiningDate, salary: e.salary, active: e.active
    }));
    const csv = [
      Object.keys(rows[0] || {}).join(","),
      ...rows.map(r => Object.values(r).map(v => `"${v}"`).join(","))
    ].join("\n");
    const blob = new Blob([csv], {type: "text/csv"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `employees_export_${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="employee-list-wrap">
      <div className="list-controls">
        <div className="search-row">
          <input placeholder="Search name / email / phone" value={q} onChange={e=> { setQ(e.target.value); setPage(1); }} />
          <select value={dept} onChange={e=>{setDept(e.target.value); setPage(1);}}>
            {depts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={role} onChange={e=>{setRole(e.target.value); setPage(1);}}>
            {roles.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)}>
            <option value="id">Sort: ID</option>
            <option value="name">Sort: Name</option>
            <option value="joiningDate">Sort: Joining Date</option>
            <option value="salary">Sort: Salary (desc)</option>
          </select>
          <label className="toggle">
            <input type="checkbox" checked={showInactive} onChange={e=>setShowInactive(e.target.checked)} />
            <span>Show Inactive</span>
          </label>
          <button className="btn" onClick={exportCSV}>Export CSV</button>
        </div>
      </div>


      <table className="employee-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Department</th>
            <th>Role</th>
            <th>Joining</th>
            <th>Salary</th>
            <th>Active</th>
            <th>Docs</th>    
            <th>Actions</th>

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
              <td>{emp.active ? "Yes" : "No"}</td>

              <td className="docs-cell">
                <label className="upload-btn">
                  Upload
                  <input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) onSaveDocs(emp.id, { resume: file.name });
                    }}
                  />
                </label>

                {emp.docs?.resume ? (
                  <button
                    className="open-doc"
                    onClick={() => alert(`Open: ${emp.docs.resume}`)}
                  >
                    Open
                  </button>
                ) : (
                  <span style={{ opacity: 0.5 }}>No file</span>
                )}
              </td>

              
              <td className="actions">
                <button onClick={()=>onEdit(emp.id)}>Edit</button>
                {emp.active ? <button onClick={()=>onDeactivate(emp.id)}>Deactivate</button> : <button onClick={()=>onActivate(emp.id)}>Activate</button>}
                <button className="danger" onClick={()=>onDelete(emp.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {current.length === 0 && (
            <tr><td colSpan={10} style={{textAlign:"center"}}>No employees found</td></tr>
          )}
        </tbody>
      </table>

      <div className="list-footer">
        <div>Showing { ((page-1)*pageSize)+1 } - { Math.min(page*pageSize, filtered.length) } of {filtered.length}</div>
        <Pagination page={page} totalPages={totalPages} onPage={(p)=>{ setPage(p); window.scrollTo({top:0,behavior:"smooth"}); }} />
      </div>
    </div>
  );
};

export default EmployeeList;
