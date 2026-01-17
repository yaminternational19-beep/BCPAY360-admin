import React, { useState } from "react";

const FullFinalReports = () => {
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
  });

  return (
    <div className="sr-page">
      <div className="sr-header">
        <h1>Full & Final Reports</h1>
        <p>Full and final settlement records</p>
      </div>

      <div className="sr-filters">
        <input type="date" placeholder="From Date" value={filters.dateFrom} onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })} />
        <input type="date" placeholder="To Date" value={filters.dateTo} onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })} />
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
              <th>Exit Date</th>
              <th>Settlement Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="5" className="placeholder-text">No data available</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FullFinalReports;
