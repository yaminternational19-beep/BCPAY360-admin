import { useState, useMemo } from "react";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import "../styles/PayrollManagement.css";
import { makeEmployees } from "../utils/employeeGenerator";

/* ===============================
   HELPERS
================================ */
const money = (n) => `₹ ${Number(n || 0).toFixed(2)}`;
const PAGE_SIZE = 5;

/* ===============================
   COMPONENT
================================ */
export default function PayrollManagement() {
  /* -----------------------------
     EMPLOYEES (REALISTIC DATA)
  ----------------------------- */
  const employees = useMemo(() => makeEmployees(50), []);

  /* -----------------------------
     STATE
  ----------------------------- */
  const [structures, setStructures] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [selectedStructure, setSelectedStructure] = useState(null);

  const [incentives, setIncentives] = useState({});
  const [payroll, setPayroll] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedEmpId, setSelectedEmpId] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("2025-01");

  const [empPage, setEmpPage] = useState(1);
  const [payPage, setPayPage] = useState(1);

  const [structureForm, setStructureForm] = useState({
    name: "",
    basic: "",
  });

  const [componentForm, setComponentForm] = useState({
    type: "allowance",
    label: "",
    mode: "fixed",
    value: "",
  });

  /* -----------------------------
     SEARCH FILTER
  ----------------------------- */
  const filteredEmployees = useMemo(() => {
    return employees.filter((e) =>
      `${e.id} ${e.name} ${e.department}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [employees, search]);

  /* -----------------------------
     PAGINATION
  ----------------------------- */
  const pagedEmployees = useMemo(() => {
    const start = (empPage - 1) * PAGE_SIZE;
    return filteredEmployees.slice(start, start + PAGE_SIZE);
  }, [filteredEmployees, empPage]);

  const pagedPayroll = useMemo(() => {
    const start = (payPage - 1) * PAGE_SIZE;
    return payroll.slice(start, start + PAGE_SIZE);
  }, [payroll, payPage]);

  /* -----------------------------
     STRUCTURE CRUD
  ----------------------------- */
  const addStructure = (e) => {
    e.preventDefault();
    if (!structureForm.name || !structureForm.basic) return;

    setStructures((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: structureForm.name,
        basic: Number(structureForm.basic),
        allowances: [],
        deductions: [],
      },
    ]);

    setStructureForm({ name: "", basic: "" });
  };

  const addComponent = (e) => {
    e.preventDefault();
    if (!selectedStructure) return;

    setStructures((prev) =>
      prev.map((s) =>
        s.id === selectedStructure.id
          ? {
              ...s,
              [componentForm.type === "allowance"
                ? "allowances"
                : "deductions"]: [
                ...s[
                  componentForm.type === "allowance"
                    ? "allowances"
                    : "deductions"
                ],
                {
                  id: Date.now(),
                  label: componentForm.label,
                  mode: componentForm.mode,
                  value: Number(componentForm.value),
                },
              ],
            }
          : s
      )
    );

    setComponentForm({
      type: "allowance",
      label: "",
      mode: "fixed",
      value: "",
    });
  };

  /* -----------------------------
     ASSIGN STRUCTURE
  ----------------------------- */
  const assignStructure = (empId, structureId) => {
    setAssignments((prev) => ({
      ...prev,
      [empId]: Number(structureId),
    }));
  };

  /* -----------------------------
     INCENTIVES
  ----------------------------- */
  const updateIncentive = (empId, field, value) => {
    setIncentives((prev) => ({
      ...prev,
      [empId]: {
        ...prev[empId],
        [field]: Number(value),
      },
    }));
  };

  /* -----------------------------
     PAYROLL GENERATION
  ----------------------------- */
  const generatePayroll = () => {
    const targetEmployees = selectedEmpId
      ? filteredEmployees.filter((e) => e.id === selectedEmpId)
      : filteredEmployees;

    const data = targetEmployees.map((emp) => {
      const structure = structures.find(
        (s) => s.id === assignments[emp.id]
      );

      const basic = structure?.basic || emp.salary;

      const allowances =
        structure?.allowances.map((a) => ({
          ...a,
          amount:
            a.mode === "fixed" ? a.value : (a.value / 100) * basic,
        })) || [];

      const deductions =
        structure?.deductions.map((d) => ({
          ...d,
          amount:
            d.mode === "fixed" ? d.value : (d.value / 100) * basic,
        })) || [];

      const inc = incentives[emp.id] || {};
      const incentiveAmount =
        (inc.hours || 0) * (inc.rate || 0) + (inc.bonus || 0);

      const gross =
        basic +
        allowances.reduce((t, a) => t + a.amount, 0) +
        incentiveAmount;

      const net =
        gross - deductions.reduce((t, d) => t + d.amount, 0);

      return {
        emp,
        month: selectedMonth,
        basic,
        incentives: incentiveAmount,
        allowances,
        deductions,
        gross,
        net,
      };
    });

    setPayroll(data);
    setPayPage(1);
  };

  /* -----------------------------
     EXPORT EXCEL
  ----------------------------- */
  const exportToExcel = () => {
    const rows = payroll.map((p) => ({
      EmployeeID: `EMP${p.emp.id}`,
      Name: p.emp.name,
      Department: p.emp.department,
      Month: p.month,
      Basic: p.basic,
      Incentives: p.incentives,
      Gross: p.gross,
      Net: p.net,
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payroll");

    XLSX.writeFile(wb, `Payroll_${selectedMonth}.xlsx`);
  };

  /* -----------------------------
     PDF SLIP
  ----------------------------- */
  const downloadSlip = (p) => {
    const doc = new jsPDF();
    let y = 20;

    doc.text("Salary Slip", 15, y);
    y += 10;

    doc.text(`Employee ID: EMP${p.emp.id}`, 15, y);
    y += 8;

    doc.text(`Name: ${p.emp.name}`, 15, y);
    y += 8;

    doc.text(`Month: ${p.month}`, 15, y);
    y += 8;

    doc.text(`Basic Salary: ${money(p.basic)}`, 15, y);
    y += 8;

    doc.text(`Incentives: ${money(p.incentives)}`, 15, y);
    y += 8;

    doc.text(`Gross Salary: ${money(p.gross)}`, 15, y);
    y += 8;

    doc.text(`Net Salary: ${money(p.net)}`, 15, y);

    doc.save(`EMP${p.emp.id}_${p.month}_SalarySlip.pdf`);
  };

  /* ===============================
     UI
  =============================== */
  return (
    <div className="pay-container">
      <h1>Payroll Management</h1>

      {/* STRUCTURES */}
      <section className="card">
        <h2>Salary Structures</h2>

        <form className="row" onSubmit={addStructure}>
          <input
            placeholder="Structure Name"
            value={structureForm.name}
            onChange={(e) =>
              setStructureForm({ ...structureForm, name: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Basic Salary"
            value={structureForm.basic}
            onChange={(e) =>
              setStructureForm({ ...structureForm, basic: e.target.value })
            }
          />
          <button className="btn-primary">Add</button>
        </form>

        <div className="structure-list">
          {structures.map((s) => (
            <div
              key={s.id}
              className={`structure-card ${
                selectedStructure?.id === s.id ? "active" : ""
              }`}
              onClick={() => setSelectedStructure(s)}
            >
              <b>{s.name}</b>
              <div className="small">Basic: {money(s.basic)}</div>
            </div>
          ))}
        </div>

        {selectedStructure && (
          <form className="row" onSubmit={addComponent}>
            <select
              value={componentForm.type}
              onChange={(e) =>
                setComponentForm({ ...componentForm, type: e.target.value })
              }
            >
              <option value="allowance">Allowance</option>
              <option value="deduction">Deduction</option>
            </select>

            <input
              placeholder="Label"
              value={componentForm.label}
              onChange={(e) =>
                setComponentForm({ ...componentForm, label: e.target.value })
              }
            />

            <select
              value={componentForm.mode}
              onChange={(e) =>
                setComponentForm({ ...componentForm, mode: e.target.value })
              }
            >
              <option value="fixed">Fixed</option>
              <option value="percent">Percent</option>
            </select>

            <input
              type="number"
              placeholder="Value"
              value={componentForm.value}
              onChange={(e) =>
                setComponentForm({ ...componentForm, value: e.target.value })
              }
            />

            <button className="btn-primary">Add</button>
          </form>
        )}
      </section>

      {/* ASSIGN & SEARCH */}
      <section className="card">
        <div className="sticky-header">
          <input
            className="search"
            placeholder="Search Employee"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setEmpPage(1);
            }}
          />
        </div>

        <h2>Assign Structure & Incentives</h2>

        {pagedEmployees.map((e) => (
          <div className="assign-row" key={e.id}>
            <div className="emp-id">EMP{e.id}</div>
            <div className="emp-name">{e.name}</div>

            <select
              value={assignments[e.id] || ""}
              onChange={(x) => assignStructure(e.id, x.target.value)}
            >
              <option value="">Structure</option>
              {structures.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Hours"
              onChange={(x) =>
                updateIncentive(e.id, "hours", x.target.value)
              }
            />
            <input
              type="number"
              placeholder="Rate/hr"
              onChange={(x) =>
                updateIncentive(e.id, "rate", x.target.value)
              }
            />
            <input
              type="number"
              placeholder="Bonus"
              onChange={(x) =>
                updateIncentive(e.id, "bonus", x.target.value)
              }
            />
          </div>
        ))}
      </section>

      {/* PAYROLL */}
      <section className="card">
        <h2>Generate Payroll</h2>

        <div className="row">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />

          <select
            value={selectedEmpId || ""}
            onChange={(e) =>
              setSelectedEmpId(
                e.target.value ? Number(e.target.value) : null
              )
            }
          >
            <option value="">All Employees</option>
            {filteredEmployees.map((e) => (
              <option key={e.id} value={e.id}>
                EMP{e.id} - {e.name}
              </option>
            ))}
          </select>

          <button className="btn-primary" onClick={generatePayroll}>
            Generate
          </button>

          <button className="btn-sm" onClick={exportToExcel}>
            Export Excel
          </button>
        </div>

        <div className="summary-bar">
          <div>Total Employees: {payroll.length}</div>
          <div>
            Total Payout:{" "}
            {money(payroll.reduce((t, p) => t + p.net, 0))}
          </div>
        </div>

        {pagedPayroll.map((p) => (
          <div className="payroll-card" key={p.emp.id}>
            <b>
              EMP{p.emp.id} – {p.emp.name}
            </b>
            <div>Month: {p.month}</div>
            <div>Basic: {money(p.basic)}</div>
            <div>Incentives: {money(p.incentives)}</div>
            <div>Gross: {money(p.gross)}</div>
            <div className="net">Net: {money(p.net)}</div>

            <button className="btn-sm" onClick={() => downloadSlip(p)}>
              Download Slip
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}
