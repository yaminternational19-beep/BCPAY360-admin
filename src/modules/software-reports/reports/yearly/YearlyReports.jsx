import React, { useState } from "react";

const YearlyReports = () => {
  const [filters, setFilters] = useState({
    year: new Date().getFullYear().toString(),
    reportType: "Annual Summary",
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
    alert(`Exported Yearly Report as ${format}`);
  };

  const mockReports = [
    {
      empCode: "EMP-001",
      name: "John Doe",
      totalSalary: 660000,
      totalAttendance: 264,
      totalLeaves: 10,
      totalDeduction: 60000,
      yearlySummary: "Completed",
    },
    {
      empCode: "EMP-002",
      name: "Jane Smith",
      totalSalary: 582000,
      totalAttendance: 270,
      totalLeaves: 5,
      totalDeduction: 54000,
      yearlySummary: "Completed",
    },
    {
      empCode: "EMP-003",
      name: "Mike Johnson",
      totalSalary: 732000,
      totalAttendance: 261,
      totalLeaves: 14,
      totalDeduction: 72000,
      yearlySummary: "Completed",
    },
  ];

  return (
    <div className="sr-page">
      <div className="sr-header">
        <h1>Yearly Reports</h1>
        <p>View annual summaries and statistics</p>
      </div>

      <div className="sr-content">
        <div className="sr-filters">
          <div className="filter-group">
            <label>Report Type</label>
            <select
              name="reportType"
              value={filters.reportType}
              onChange={handleFilterChange}
            >
              <option value="Annual Summary">Annual Summary</option>
              <option value="Employee Summary">Employee Summary</option>
              <option value="Department Summary">Department Summary</option>
              <option value="Financial Summary">Financial Summary</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Year</label>
            <select
              name="year"
              value={filters.year}
              onChange={handleFilterChange}
            >
              <option value="2022">2022</option>
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
                  <th>Total Salary (₹)</th>
                  <th>Attendance Days</th>
                  <th>Total Leaves</th>
                  <th>Total Deductions (₹)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {mockReports.map((report, idx) => (
                  <tr key={idx}>
                    <td>{report.empCode}</td>
                    <td>{report.name}</td>
                    <td className="highlight">₹{report.totalSalary.toLocaleString()}</td>
                    <td>{report.totalAttendance}</td>
                    <td>{report.totalLeaves}</td>
                    <td>₹{report.totalDeduction.toLocaleString()}</td>
                    <td>
                      <span className="status-badge">{report.yearlySummary}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="sr-summary">
              <p>Total Employees: <strong>{mockReports.length}</strong></p>
              <p>Total Annual Payroll: <strong>₹{mockReports.reduce((a, b) => a + b.totalSalary, 0).toLocaleString()}</strong></p>
              <p>Average Attendance: <strong>{Math.round(mockReports.reduce((a, b) => a + b.totalAttendance, 0) / mockReports.length)} Days</strong></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YearlyReports;
