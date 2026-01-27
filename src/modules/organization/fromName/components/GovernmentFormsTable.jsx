import React from "react";
import "../styles/styleforms.css";
const GovernmentFormsTable = ({ data, loading, onEdit, onDelete }) => {
  if (loading) return <p>Loading…</p>;
  if (!data.length) return <p>No government forms found.</p>;

  return (
    <div className="gov-table-wrapper">
      <table className="gov-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Form Name</th>
            <th>Code</th>
            <th>Category</th>
            <th>Period</th>
            <th>Employee Specific</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((f, i) => (
            <tr key={f.id}>
              <td>{i + 1}</td>
              <td>{f.formName}</td>
              <td><span className="gov-badge code">{f.formCode}</span></td>
              <td><span className="gov-badge category">{f.category}</span></td>
              <td>{f.periodType}</td>
              <td>{f.isEmployeeSpecific ? "Yes" : "No"}</td>
              <td>
                <span className={`gov-status ${f.status === "ACTIVE" ? "active" : "inactive"}`}>
                  {f.status}
                </span>
              </td>
              <td>
                <div className="gov-actions">
                  <button className="btn-icon edit" onClick={() => onEdit(f)} title="Edit">
                    ✎
                  </button>
                  <button
                    className="btn-icon delete"
                    disabled={f.status === "ACTIVE"}
                    onClick={() => onDelete(f)}
                    title="Delete"
                  >
                    🗑
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GovernmentFormsTable;
