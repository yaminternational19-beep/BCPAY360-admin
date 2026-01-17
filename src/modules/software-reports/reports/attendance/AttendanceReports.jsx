import React, { useState } from "react";

const AttendanceReports = () => {
  const [filters, setFilters] = useState({
    branch: "",
    department: "",
    month: "",
    year: new Date().getFullYear().toString(),
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
    alert(`Exported Attendance Report as ${format}`);
  };

  const mockReports = [
    {
      empCode: "EMP-001",
      name: "John Doe",
      branch: "Head Office",
      present: 22,
      absent: 2,
      halfDay: 1,
      leaves: 4,
      percentage: 92,
    },
    {
      empCode: "EMP-002",
      name: "Jane Smith",
      branch: "Branch A",
      present: 24,
      absent: 0,
      halfDay: 1,
      leaves: 2,
      percentage: 96,
    },
    {
      empCode: "EMP-003",
      name: "Mike Johnson",
      branch: "Branch B",
      present: 20,
      absent: 3,
      halfDay: 2,
      leaves: 2,
      percentage: 87,
    },
  ];

  return (
    <div className="sr-page">
      <div className="sr-header">
        <h1>Attendance Reports</h1>
        <p>Track employee attendance and statistics</p>
      </div>

      <div className="sr-content">
        <div className="sr-filters">
          <div className="filter-group">
            <label>Branch</label>
            <select
              name="branch"
              value={filters.branch}
              onChange={handleFilterChange}
            >
              <option value="">Select Branch</option>
              <option value="Head Office">Head Office</option>
              <option value="Branch A">Branch A</option>
              <option value="Branch B">Branch B</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Department</label>
            <select
              name="department"
              value={filters.department}
              onChange={handleFilterChange}
            >
              <option value="">Select Department</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="Operations">Operations</option>
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
                  <th>Branch</th>
                  <th>Present</th>
                  <th>Absent</th>
                  <th>Half Day</th>
                  <th>Leaves</th>
                  <th>Attendance %</th>
                </tr>
              </thead>
              <tbody>
                {mockReports.map((report, idx) => (
                  <tr key={idx}>
                    <td>{report.empCode}</td>
                    <td>{report.name}</td>
                    <td>{report.branch}</td>
                    <td>{report.present}</td>
                    <td>{report.absent}</td>
                    <td>{report.halfDay}</td>
                    <td>{report.leaves}</td>
                    <td>
                      <span className="percentage-badge">
                        {report.percentage}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="sr-summary">
              <p>Total Records: <strong>{mockReports.length}</strong></p>
              <p>Average Attendance: <strong>{Math.round(mockReports.reduce((a, b) => a + b.percentage, 0) / mockReports.length)}%</strong></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceReports;
