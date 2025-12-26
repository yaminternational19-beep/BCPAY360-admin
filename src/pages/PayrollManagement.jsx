import React, { useMemo, useState } from "react";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import "../styles/PayrollManagement.css";
import { makeEmployees } from "../utils/employeeGenerator";

const PAGE_SIZE = 5;
const empCode = (id) => `EMP${String(id).padStart(3, "0")}`;
const money = (n) => `₹ ${Number(n || 0).toFixed(2)}`;

export default function PayrollManagement() {
  const user = JSON.parse(localStorage.getItem("auth_user"));
  const isAdmin = user?.role === "COMPANY_ADMIN";
  const isHR = user?.role === "HR";

  if (!user || (!isAdmin && !isHR)) {
    return (
      <div className="pay-container">
        <h2>Access Restricted</h2>
        <p>You don't have permission to access Payroll.</p>
      </div>
    );
  }

  const allEmployees = useMemo(() => makeEmployees(200), []);
  const employees = useMemo(() => {
    return isAdmin
      ? allEmployees
      : allEmployees.filter(e => e.department === user.department);
  }, [allEmployees, isAdmin, user.department]);

  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("2025-01");
  const [page, setPage] = useState(1);
  const [inputs, setInputs] = useState({});
  const [payroll, setPayroll] = useState([]);

  /* FILTER */
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return employees.filter(e =>
      `${empCode(e.id)} ${e.name}`.toLowerCase().includes(q)
    );
  }, [employees, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  /* INPUT UPDATE */
  const update = (id, field, value) => {
    setInputs(p => ({
      ...p,
      [id]: { ...p[id], [field]: Number(value) }
    }));
  };

  /* GENERATE */
  const generatePayroll = () => {
    if (!isAdmin) return;

    const data = filtered.map(emp => {
      const base = emp.salary || 0;
      const i = inputs[emp.id] || {};
      const incentives = (i.hours || 0) * (i.rate || 0);
      const bonus = i.bonus || 0;
      const net = base + incentives + bonus;

      return { emp, base, incentives, bonus, net };
    });

    setPayroll(data);
  };

  /* EXPORT */
  const exportExcel = () => {
    if (!isAdmin) return;

    const rows = payroll.map(p => ({
      EmployeeID: empCode(p.emp.id),
      Name: p.emp.name,
      Department: p.emp.department,
      Month: month,
      NetSalary: p.net
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payroll");
    XLSX.writeFile(wb, `Payroll_${month}.xlsx`);
  };

  const downloadSlip = (p) => {
    const doc = new jsPDF();
    doc.text("Salary Slip", 20, 20);
    doc.text(`Employee: ${p.emp.name}`, 20, 35);
    doc.text(`ID: ${empCode(p.emp.id)}`, 20, 45);
    doc.text(`Month: ${month}`, 20, 55);
    doc.text(`Net Salary: ${money(p.net)}`, 20, 70);
    doc.save(`${empCode(p.emp.id)}_${month}.pdf`);
  };

  return (
    <div className="pay-container">
      <h1>Payroll Management</h1>

      {/* TOP BAR */}
      <div className="pay-topbar">
        <input
          className="search"
          placeholder="Search EMP ID or Name"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
        <input
          type="month"
          className="month-picker"
          value={month}
          onChange={e => setMonth(e.target.value)}
        />
      </div>

      {/* EMPLOYEE PANEL */}
      <div className="card">
        {pageData.map(e => (
          <div className="assign-row" key={e.id}>
            <div className="emp-id">{empCode(e.id)}</div>
            <div className="emp-name">{e.name}</div>

            <input placeholder="Hours" onChange={x => update(e.id,"hours",x.target.value)} />
            <input placeholder="Rate" onChange={x => update(e.id,"rate",x.target.value)} />
            <input placeholder="Bonus" onChange={x => update(e.id,"bonus",x.target.value)} />
          </div>
        ))}

        {/* PAGINATION */}
        <div className="pager">
          <button disabled={page===1} onClick={()=>setPage(p=>p-1)}>Prev</button>
          <span>{page} / {totalPages}</span>
          <button disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}>Next</button>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="action-row">
        {isAdmin ? (
          <>
            <button className="btn-primary" onClick={generatePayroll}>Generate Payroll</button>
            <button className="btn-sm" onClick={exportExcel}>Export Excel</button>
          </>
        ) : (
          <p className="muted">Only Admin can generate payroll.</p>
        )}
      </div>

      {/* RESULTS */}
      {payroll.map(p => (
        <div className="payroll-card" key={p.emp.id}>
          <b>{empCode(p.emp.id)} — {p.emp.name}</b>
          <div>Net Salary: {money(p.net)}</div>
          {isAdmin && (
            <button className="btn-sm" onClick={()=>downloadSlip(p)}>Download Slip</button>
          )}
        </div>
      ))}
    </div>
  );
}
