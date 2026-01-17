import React, { useState } from "react";

const PayslipReports = () => {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  return (
    <div className="sr-page">
      <div className="sr-header">
        <h1>Pay Slip Reports</h1>
        <p>Individual pay slip details and records</p>
      </div>

      <div className="sr-filters">
        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          <option value="">Select Month</option>
          <option value="01">January</option>
          <option value="02">February</option>
        </select>
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">Select Year</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
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
              <th>Month</th>
              <th>Gross</th>
              <th>Deductions</th>
              <th>Net</th>
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

export default PayslipReports;
