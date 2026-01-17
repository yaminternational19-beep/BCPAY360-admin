import React, { useState } from "react";

const AttendanceReports = () => {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  return (
    <div className="sr-page">
      <div className="sr-header">
        <h1>Attendance Reports</h1>
        <p>Employee attendance tracking and analysis</p>
      </div>

      <div className="sr-filters">
        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          <option value="">Select Month</option>
          <option value="01">January</option>
          <option value="02">February</option>
          <option value="03">March</option>
        </select>
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">Select Year</option>
          <option value="2024">2024</option>
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
              <th>Present</th>
              <th>Absent</th>
              <th>Half Day</th>
              <th>Working Days</th>
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

export default AttendanceReports;
