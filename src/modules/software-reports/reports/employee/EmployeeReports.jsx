import React, { useState } from "react";

const EmployeeReports = () => {
  const [filters, setFilters] = useState({
    empCode: "",
    branch: "",
    department: "",
    dateFrom: "",
    dateTo: "",
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
    alert(`Exported Employee Report as ${format}`);
  };

  const mockReports = [
    {
      empCode: "EMP-001",
      name: "John Doe",
      branch: "Head Office",
      department: "HR",
      designation: "Manager",
      joinDate: "2020-01-15",
      status: "Active",
    },
    {
      empCode: "EMP-002",
      name: "Jane Smith",
      branch: "Branch A",
      department: "Finance",
      designation: "Analyst",
      joinDate: "2021-03-20",
      status: "Active",
    },
    {
      empCode: "EMP-003",
      name: "Mike Johnson",
      branch: "Branch B",
      department: "Operations",
      designation: "Coordinator",
      joinDate: "2022-06-10",
      status: "Active",
    },
  ];

  return (
    <div className="sr-page">
      <div className="sr-header">
        <h1>Employee Reports</h1>
        <p>View employee details, status, and information</p>
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
            <label>From Date</label>
            <input
              type="date"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-group">
            <label>To Date</label>
            <input
              type="date"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleFilterChange}
            />
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
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Join Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {mockReports.map((report, idx) => (
                  <tr key={idx}>
                    <td>{report.empCode}</td>
                    <td>{report.name}</td>
                    <td>{report.branch}</td>
                    <td>{report.department}</td>
                    <td>{report.designation}</td>
                    <td>{report.joinDate}</td>
                    <td>
                      <span className="status-badge">{report.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="sr-summary">
              <p>Total Employees: <strong>{mockReports.length}</strong></p>
              <p>Active: <strong>{mockReports.filter(r => r.status === "Active").length}</strong></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeReports;
