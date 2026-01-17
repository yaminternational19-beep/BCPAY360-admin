import React, { useState } from "react";

const LeaveReports = () => {
  const [filters, setFilters] = useState({
    empCode: "",
    year: new Date().getFullYear().toString(),
    leaveType: "",
    status: "",
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
    alert(`Exported Leave Report as ${format}`);
  };

  const mockReports = [
    {
      empCode: "EMP-001",
      name: "John Doe",
      leaveType: "Casual Leave",
      year: 2024,
      approved: 3,
      pending: 1,
      rejected: 0,
      balance: 6,
      status: "Active",
    },
    {
      empCode: "EMP-002",
      name: "Jane Smith",
      leaveType: "Sick Leave",
      year: 2024,
      approved: 2,
      pending: 0,
      rejected: 1,
      balance: 8,
      status: "Active",
    },
    {
      empCode: "EMP-003",
      name: "Mike Johnson",
      leaveType: "Earned Leave",
      year: 2024,
      approved: 5,
      pending: 2,
      rejected: 0,
      balance: 3,
      status: "Active",
    },
  ];

  return (
    <div className="sr-page">
      <div className="sr-header">
        <h1>Leave Reports</h1>
        <p>View leave applications and balances</p>
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
            <label>Leave Type</label>
            <select
              name="leaveType"
              value={filters.leaveType}
              onChange={handleFilterChange}
            >
              <option value="">All Leave Types</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Earned Leave">Earned Leave</option>
              <option value="Maternity Leave">Maternity Leave</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">All Status</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
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
                  <th>Leave Type</th>
                  <th>Approved</th>
                  <th>Pending</th>
                  <th>Rejected</th>
                  <th>Balance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {mockReports.map((report, idx) => (
                  <tr key={idx}>
                    <td>{report.empCode}</td>
                    <td>{report.name}</td>
                    <td>{report.leaveType}</td>
                    <td>{report.approved}</td>
                    <td>{report.pending}</td>
                    <td>{report.rejected}</td>
                    <td>{report.balance}</td>
                    <td>
                      <span className="status-badge">{report.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="sr-summary">
              <p>Total Employees: <strong>{mockReports.length}</strong></p>
              <p>Total Approved Leaves: <strong>{mockReports.reduce((a, b) => a + b.approved, 0)}</strong></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveReports;
