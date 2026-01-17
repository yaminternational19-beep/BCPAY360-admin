import React, { useState } from "react";

const SalaryReports = () => {
  const [filters, setFilters] = useState({
    empCode: "",
    month: "",
    year: new Date().getFullYear().toString(),
    reportType: "Payslip",
  });

  const [showTable, setShowTable] = useState(false);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    setShowTable(true);
  };

  const handleExport = (format) => {
    alert(`Exported Salary Report as ${format}`);
  };

  const mockReports = [
    {
      empCode: "EMP-001",
      name: "John Doe",
      month: "January",
      basicSalary: 50000,
      allowances: 10000,
      deductions: 5000,
      netSalary: 55000,
      reportType: "Payslip",
    },
    {
      empCode: "EMP-002",
      name: "Jane Smith",
      month: "January",
      basicSalary: 45000,
      allowances: 8000,
      deductions: 4500,
      netSalary: 48500,
      reportType: "Payslip",
    },
    {
      empCode: "EMP-003",
      name: "Mike Johnson",
      month: "January",
      basicSalary: 55000,
      allowances: 12000,
      deductions: 6000,
      netSalary: 61000,
      reportType: "Payslip",
    },
  ];

  return (
    <div className="sr-page">
      <div className="sr-header">
        <h1>Salary Reports</h1>
        <p>View payslips, bonuses, and salary information</p>
      </div>

      <div className="sr-content">
        <div className="sr-filters">
          <div className="filter-group">
            <label>Employee Code</label>
            <input
              type="text"
              name="empCode"
              value={filters.empCode}
              onChange={handleFilterChange}
              placeholder="e.g., EMP-001"
            />
          </div>

          <div className="filter-group">
            <label>Report Type</label>
            <select
              name="reportType"
              value={filters.reportType}
              onChange={handleFilterChange}
            >
              <option value="Payslip">Payslip</option>
              <option value="Bonus">Bonus</option>
              <option value="Arrears">Arrears</option>
              <option value="Advance">Advance</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Month</label>
            <select
              name="month"
              value={filters.month}
              onChange={handleFilterChange}
            >
              <option value="">Select Month</option>
              {[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ].map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Year</label>
            <select
              name="year"
              value={filters.year}
              onChange={handleFilterChange}
            >
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select>
          </div>

          <button className="btn-primary" onClick={handleApplyFilters}>
            🔍 Apply Filters
          </button>
        </div>

        {showTable && (
          <div className="sr-table-container">
            <div className="sr-export-buttons">
              <button
                className="btn-secondary"
                onClick={() => handleExport("Excel")}
              >
                📊 Export Excel
              </button>
              <button
                className="btn-secondary"
                onClick={() => handleExport("PDF")}
              >
                📄 Export PDF
              </button>
            </div>

            <table className="sr-table">
              <thead>
                <tr>
                  <th>Emp Code</th>
                  <th>Name</th>
                  <th>Month</th>
                  <th>Basic Salary</th>
                  <th>Allowances</th>
                  <th>Deductions</th>
                  <th>Net Salary</th>
                </tr>
              </thead>
              <tbody>
                {mockReports.map((report, idx) => (
                  <tr key={idx}>
                    <td>{report.empCode}</td>
                    <td>{report.name}</td>
                    <td>{report.month}</td>
                    <td>₹{report.basicSalary.toLocaleString()}</td>
                    <td>₹{report.allowances.toLocaleString()}</td>
                    <td>₹{report.deductions.toLocaleString()}</td>
                    <td className="highlight">₹{report.netSalary.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="sr-summary">
              <p>Total Records: <strong>{mockReports.length}</strong></p>
              <p>Total Payroll: <strong>₹{mockReports.reduce((a, b) => a + b.netSalary, 0).toLocaleString()}</strong></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalaryReports;
