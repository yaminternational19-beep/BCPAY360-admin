import React, { useState } from "react";

const PersonnelFiles = () => {
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    branch: "",
    department: "",
  });

  return (
    <div className="sr-page">
      <div className="sr-header">
        <h1>Personnel Files</h1>
        <p>Employee records and personnel information</p>
      </div>

      <div className="sr-filters">
        <input type="date" placeholder="From Date" value={filters.dateFrom} onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })} />
        <input type="date" placeholder="To Date" value={filters.dateTo} onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })} />
        <select value={filters.branch} onChange={(e) => setFilters({ ...filters, branch: e.target.value })}>
          <option value="">All Branches</option>
          <option value="HQ">Head Office</option>
          <option value="B1">Branch 1</option>
        </select>
        <select value={filters.department} onChange={(e) => setFilters({ ...filters, department: e.target.value })}>
          <option value="">All Departments</option>
          <option value="HR">HR</option>
          <option value="IT">IT</option>
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
              <th>Designation</th>
              <th>Department</th>
              <th>Branch</th>
              <th>Date of Joining</th>
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

export default PersonnelFiles;
