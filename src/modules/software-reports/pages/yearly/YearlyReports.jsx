import React, { useState } from "react";

const YearlyReports = () => {
  const [year, setYear] = useState("");

  return (
    <div className="sr-page">
      <div className="sr-header">
        <h1>Yearly Reports</h1>
        <p>Annual reports and summaries</p>
      </div>

      <div className="sr-filters">
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">Select Year</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
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
              <th>Report Name</th>
              <th>Year</th>
              <th>Generated Date</th>
              <th>Records</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="4" className="placeholder-text">No data available</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default YearlyReports;
