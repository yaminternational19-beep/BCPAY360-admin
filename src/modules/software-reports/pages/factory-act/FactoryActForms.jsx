import React, { useState } from "react";

const FactoryActForms = () => {
  const [formType, setFormType] = useState("");

  return (
    <div className="sr-page">
      <div className="sr-header">
        <h1>Factory Act Forms</h1>
        <p>Government mandated factory act forms and documentation</p>
      </div>

      <div className="sr-filters">
        <select value={formType} onChange={(e) => setFormType(e.target.value)}>
          <option value="">Select Form</option>
          <option value="form-a">Form A - Register of Workmen</option>
          <option value="form-b">Form B - Muster Roll</option>
          <option value="form-c">Form C - Registers</option>
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
              <th>Form Name</th>
              <th>Version</th>
              <th>Last Updated</th>
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

export default FactoryActForms;
