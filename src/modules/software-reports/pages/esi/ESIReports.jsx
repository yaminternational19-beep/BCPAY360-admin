import React, { useState } from "react";

const ESIReports = () => {
  const [month, setMonth] = useState("");

  return (
    <div className="sr-page">
      <div className="sr-header">
        <h1>ESI Reports</h1>
        <p>Employee State Insurance reports and filing</p>
      </div>

      <div className="sr-filters">
        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          <option value="">Select Month</option>
          <option value="01">January</option>
          <option value="02">February</option>
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
              <th>ESI Number</th>
              <th>Contribution</th>
              <th>Month</th>
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

export default ESIReports;
