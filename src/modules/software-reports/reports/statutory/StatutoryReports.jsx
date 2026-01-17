import React, { useState } from "react";

const StatutoryReports = () => {
  const [filters, setFilters] = useState({
    reportType: "PF",
    month: "",
    year: new Date().getFullYear().toString(),
    branch: "",
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
    alert(`Exported Statutory Report as ${format}`);
  };

  const mockReports = [
    {
      empCode: "EMP-001",
      name: "John Doe",
      reportType: "PF",
      empContribution: 1800,
      empContribution_pf: 1800,
      companyContribution: 1800,
      totalContribution: 3600,
    },
    {
      empCode: "EMP-002",
      name: "Jane Smith",
      reportType: "ESI",
      empContribution: 75,
      companyContribution: 325,
      totalContribution: 400,
    },
    {
      empCode: "EMP-003",
      name: "Mike Johnson",
      reportType: "Gratuity",
      yearsOfService: 2,
      gratuityAmount: 45000,
      gratuityValue: 45000,
    },
  ];

  return (
    <div className="sr-page">
      <div className="sr-header">
        <h1>Statutory Reports</h1>
        <p>View PF, ESI, Gratuity, and Full & Final Settlements</p>
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
              <option value="PF">PF Contribution Register</option>
              <option value="ESI">ESI Contribution Register</option>
              <option value="Gratuity">Gratuity Statement</option>
              <option value="FullFinal">Full & Final Settlement</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Branch</label>
            <select
              name="branch"
              value={filters.branch}
              onChange={handleFilterChange}
            >
              <option value="">All Branches</option>
              <option value="Head Office">Head Office</option>
              <option value="Branch A">Branch A</option>
              <option value="Branch B">Branch B</option>
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
                  <th>Type</th>
                  <th>Emp Contribution</th>
                  <th>Company Contribution</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {mockReports.map((report, idx) => (
                  <tr key={idx}>
                    <td>{report.empCode}</td>
                    <td>{report.name}</td>
                    <td>{report.reportType}</td>
                    <td>₹{report.empContribution}</td>
                    <td>₹{report.companyContribution}</td>
                    <td className="highlight">₹{report.totalContribution}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="sr-summary">
              <p>Total Records: <strong>{mockReports.length}</strong></p>
              <p>Total Company Contribution: <strong>₹{mockReports.reduce((a, b) => a + b.companyContribution, 0).toLocaleString()}</strong></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatutoryReports;
