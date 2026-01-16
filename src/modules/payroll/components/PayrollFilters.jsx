import { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./payroll.css";

const EmployeePreviewTable = ({ employees = [] }) => {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [branch, setBranch] = useState("");

  // ----------------------------
  // FILTER OPTIONS (derived from props)
  // ----------------------------
  const departments = useMemo(
    () => [...new Set(employees.map(e => e.department).filter(Boolean))].sort(),
    [employees]
  );

  const branches = useMemo(
    () => [...new Set(employees.map(e => e.branch).filter(Boolean))].sort(),
    [employees]
  );

  // ----------------------------
  // FILTER LOGIC
  // ----------------------------
  const filteredEmployees = useMemo(() => {
    return employees.filter(e => {
      const matchesSearch =
        e.emp_code?.toLowerCase().includes(search.toLowerCase()) ||
        e.name?.toLowerCase().includes(search.toLowerCase());

      const matchesDept =
        !department || e.department === department;

      const matchesBranch =
        !branch || e.branch === branch;

      return matchesSearch && matchesDept && matchesBranch;
    });
  }, [employees, search, department, branch]);

  // ----------------------------
  // EXPORT EXCEL
  // ----------------------------
  const exportExcel = () => {
    if (filteredEmployees.length === 0) {
      alert("No data to export");
      return;
    }

    const data = filteredEmployees.map(e => ({
      "Employee Code": e.emp_code || "",
      "Employee Name": e.name || "",
      "Department": e.department || "",
      "Branch": e.branch || "",
      "Designation": e.designation || "",
      "Base Salary": e.base_salary || 0,
      "Status": e.payment_status || ""
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payroll Preview");
    XLSX.writeFile(workbook, "employee_payroll_preview.xlsx");
  };

  // ----------------------------
  // EXPORT PDF
  // ----------------------------
  const exportPDF = () => {
    if (filteredEmployees.length === 0) {
      alert("No data to export");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Employee Payroll Preview", 14, 16);

    doc.autoTable({
      startY: 22,
      head: [[
        "Code",
        "Name",
        "Department",
        "Branch",
        "Designation",
        "Status"
      ]],
      body: filteredEmployees.map(e => [
        e.emp_code || "",
        e.name || "",
        e.department || "",
        e.branch || "",
        e.designation || "",
        e.payment_status || ""
      ]),
      styles: {
        font: "helvetica",
        fontSize: 10
      },
      headStyles: {
        fillColor: [41, 99, 235],
        textColor: [255, 255, 255]
      }
    });

    doc.save("employee_payroll_preview.pdf");
  };

  // ----------------------------
  // CLEAR FILTERS
  // ----------------------------
  const clearFilters = () => {
    setSearch("");
    setDepartment("");
    setBranch("");
  };

  return (
    <div className="preview-container">
      <h3>Employee Payroll Preview</h3>

      {/* FILTER BAR */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by name or code"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="filter-input"
        />

        <select 
          value={department} 
          onChange={e => setDepartment(e.target.value)}
          className="filter-select"
        >
          <option value="">All Departments</option>
          {departments.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <select 
          value={branch} 
          onChange={e => setBranch(e.target.value)}
          className="filter-select"
        >
          <option value="">All Branches</option>
          {branches.map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>

        <button onClick={clearFilters} className="secondary">
          Clear
        </button>

        <button onClick={exportExcel} className="primary">
          Export Excel
        </button>

        <button onClick={exportPDF} className="primary">
          Export PDF
        </button>
      </div>

      {/* TABLE */}
      <div className="table-wrapper">
        <table className="employee-preview">
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Department</th>
              <th>Branch</th>
              <th>Designation</th>
              <th>Base Salary</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                  No records found
                </td>
              </tr>
            ) : (
              filteredEmployees.map((e, i) => (
                <tr key={i}>
                  <td>{e.emp_code || "-"}</td>
                  <td>{e.name || "-"}</td>
                  <td>{e.department || "-"}</td>
                  <td>{e.branch || "-"}</td>
                  <td>{e.designation || "-"}</td>
                  <td>₹{(e.base_salary || 0).toLocaleString('en-IN')}</td>
                  <td>
                    <span className={`status ${e.payment_status === "SUCCESS" ? "paid" : "pending"}`}>
                      {e.payment_status || "N/A"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeePreviewTable;
