import React, { useState } from "react";
import jsPDF from "jspdf";
import "../styles/PayrollManagement.css";

const money = (n) => `₹ ${Number(n).toFixed(2)}`;

export default function PayrollManagement() {
  const [structures, setStructures] = useState([]);
  const [employees, setEmployees] = useState([
    { id: 1, name: "Asha Patel", code: "E112", structureId: null },
    { id: 2, name: "Rohit Sharma", code: "E207", structureId: null },
  ]);

  const [form, setForm] = useState({
    name: "",
    basic: "",
  });

  const [component, setComponent] = useState({
    type: "allowance",
    label: "",
    mode: "fixed",
    value: "",
  });

  const [selected, setSelected] = useState(null);
  const [payroll, setPayroll] = useState([]);

  // --------------------------------------------------
  // Save Salary Structure
  // --------------------------------------------------
  const saveStructure = (e) => {
    e.preventDefault();

    if (!form.name || !form.basic) return;

    const newStruct = {
      id: Date.now(),
      name: form.name,
      basic: Number(form.basic),
      allowances: [],
      deductions: [],
    };

    setStructures([...structures, newStruct]);
    setForm({ name: "", basic: "" });
  };

  // --------------------------------------------------
  // Add Allowance / Deduction
  // --------------------------------------------------
  const addComponent = (e) => {
    e.preventDefault();
    if (!selected) return alert("Select a structure to edit.");

    setStructures((prev) =>
      prev.map((s) =>
        s.id === selected.id
          ? {
              ...s,
              [component.type === "allowance" ? "allowances" : "deductions"]: [
                ...s[component.type === "allowance" ? "allowances" : "deductions"],
                {
                  id: Date.now(),
                  label: component.label,
                  mode: component.mode,
                  value: Number(component.value),
                },
              ],
            }
          : s
      )
    );

    setComponent({ type: "allowance", label: "", mode: "fixed", value: "" });
  };

  // --------------------------------------------------
  // Assign Structure to Employee
  // --------------------------------------------------
  const assignStructure = (empId, structId) => {
    setEmployees((prev) =>
      prev.map((e) =>
        e.id === empId ? { ...e, structureId: Number(structId) } : e
      )
    );
  };

  // --------------------------------------------------
  // Generate Payroll
  // --------------------------------------------------
  const generatePayroll = () => {
    const data = employees.map((emp) => {
      const st = structures.find((s) => s.id === emp.structureId);
      if (!st) return { emp, gross: 0, net: 0, items: [] };

      const basic = st.basic;

      const allowances = st.allowances.map((a) => ({
        ...a,
        amount:
          a.mode === "fixed" ? a.value : (a.value / 100) * basic,
      }));

      const deductions = st.deductions.map((d) => ({
        ...d,
        amount:
          d.mode === "fixed" ? d.value : (d.value / 100) * basic,
      }));

      const gross =
        basic + allowances.reduce((t, x) => t + x.amount, 0);

      const net =
        gross - deductions.reduce((t, x) => t + x.amount, 0);

      return { emp, basic, allowances, deductions, gross, net };
    });

    setPayroll(data);
  };

  // --------------------------------------------------
  // PDF Slip
  // --------------------------------------------------
  const downloadSlip = (p) => {
    const doc = new jsPDF();
    let y = 20;

    doc.text("Salary Slip", 15, y);
    y += 10;

    doc.text(`Employee: ${p.emp.name}`, 15, y);
    y += 8;

    doc.text(`Code: ${p.emp.code}`, 15, y);
    y += 12;

    doc.text(`Basic: ${money(p.basic)}`, 15, y);
    y += 12;

    doc.text("Allowances:", 15, y);
    y += 8;

    p.allowances.forEach((a) => {
      doc.text(`${a.label}: ${money(a.amount)}`, 25, y);
      y += 8;
    });

    y += 4;
    doc.text("Deductions:", 15, y);
    y += 8;

    p.deductions.forEach((d) => {
      doc.text(`${d.label}: ${money(d.amount)}`, 25, y);
      y += 8;
    });

    y += 12;
    doc.text(`Gross: ${money(p.gross)}`, 15, y);
    y += 10;

    doc.text(`Net Salary: ${money(p.net)}`, 15, y);

    doc.save(`${p.emp.code}_salary_slip.pdf`);
  };

  return (
    <div className="pay-container">
      <h1 className="fade-in">Payroll Management</h1>

      {/* ------------------ Salary Structure ------------------ */}
      <section className="card slide-up">
        <h2>Salary Structure</h2>

        <form className="row" onSubmit={saveStructure}>
          <input
            placeholder="Structure Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Basic Salary"
            value={form.basic}
            onChange={(e) => setForm({ ...form, basic: e.target.value })}
          />
          <button className="btn-primary">Add</button>
        </form>

        <div className="structure-list">
          {structures.map((s) => (
            <div
              key={s.id}
              className="structure-card hover-zoom"
              onClick={() => setSelected(s)}
            >
              <b>{s.name}</b>
              <div className="small">Basic: {money(s.basic)}</div>
            </div>
          ))}
        </div>

        {selected && (
          <div className="editor fade-in">
            <h3>Edit Components ({selected.name})</h3>

            <form className="row" onSubmit={addComponent}>
              <select
                value={component.type}
                onChange={(e) =>
                  setComponent({ ...component, type: e.target.value })
                }
              >
                <option value="allowance">Allowance</option>
                <option value="deduction">Deduction</option>
              </select>

              <input
                placeholder="Label"
                value={component.label}
                onChange={(e) =>
                  setComponent({ ...component, label: e.target.value })
                }
              />

              <select
                value={component.mode}
                onChange={(e) =>
                  setComponent({ ...component, mode: e.target.value })
                }
              >
                <option value="fixed">Fixed</option>
                <option value="percent">Percent</option>
              </select>

              <input
                type="number"
                placeholder="Value"
                value={component.value}
                onChange={(e) =>
                  setComponent({ ...component, value: e.target.value })
                }
              />

              <button className="btn-primary">Add</button>
            </form>
          </div>
        )}
      </section>

      {/* ------------------ Assign Structures ------------------ */}
      <section className="card fade-in">
        <h2>Assign Salary Structure</h2>

        {employees.map((e) => (
          <div className="assign-row" key={e.id}>
            <span>{e.name}</span>
            <select
              value={e.structureId || ""}
              onChange={(x) => assignStructure(e.id, x.target.value)}
            >
              <option value="">Select Structure</option>
              {structures.map((s) => (
                <option value={s.id} key={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        ))}
      </section>

      {/* ------------------ Payroll Generation ------------------ */}
      <section className="card slide-up">
        <h2>Generate Payroll</h2>

        <button className="btn-primary" onClick={generatePayroll}>
          Generate
        </button>

        <div className="payroll-results">
          {payroll.map((p) => (
            <div key={p.emp.id} className="payroll-card hover-zoom">
              <b>{p.emp.name}</b>
              <div>Gross: {money(p.gross)}</div>
              <div>Net: {money(p.net)}</div>

              <button
                className="btn-sm"
                onClick={() => downloadSlip(p)}
              >
                Download Slip
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
