import React, { useState } from "react";

const OtherReports = () => {
  const [reportType, setReportType] = useState("");

  return (
    <div className="sr-page">
      <div className="sr-header">
        <h1>Other Reports</h1>
        <p>Additional reports and utilities</p>
      </div>

      <div className="sr-filters">
        <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
          <option value="">Select Report Type</option>
          <option value="manpower">Manpower Summary</option>
          <option value="compliance">Compliance Reports</option>
          <option value="custom">Custom Reports</option>
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
              <th>Category</th>
              <th>Last Generated</th>
              <th>Status</th>
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

export default OtherReports;
