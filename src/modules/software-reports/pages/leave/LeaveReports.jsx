import React, { useState } from "react";

const LeaveReports = () => {
  const [filters, setFilters] = useState({
    year: "",
    leaveType: "",
    status: "",
  });

  return (
    <div className="sr-page">
      <div className="sr-header">
        <h1>Leave Reports</h1>
        <p>Leave management and tracking</p>
      </div>

      <div className="sr-filters">
        <select value={filters.year} onChange={(e) => setFilters({ ...filters, year: e.target.value })}>
          <option value="">Select Year</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
        </select>
        <select value={filters.leaveType} onChange={(e) => setFilters({ ...filters, leaveType: e.target.value })}>
          <option value="">All Leave Types</option>
          <option value="EL">Earned Leave</option>
          <option value="SL">Sick Leave</option>
        </select>
        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All Status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <div className="sr-actions">
        <button className="btn-export-pdf">📄 Export PDF</button>
        <button className="btn-export-excel">📊 Export Excel</button>
      </div>

      <div className="sr-table-placeholder">
        <table className="sr-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Leave Type</th>
              <th>From Date</th>
              <th>To Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="6" className="placeholder-text">No data available</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveReports;
