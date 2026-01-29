import React from "react";
import "../styles/styleforms.css";
import { FaEdit, FaTrash, FaPowerOff, FaEye, FaBan } from "react-icons/fa";

const GovernmentFormsTable = ({ data, loading, onEdit, onDelete, onToggleStatus }) => {
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
              <td>
                <span className={`gov-status ${f.status === "ACTIVE" ? "active" : "inactive"}`}>
                  {f.status}
                </span>
              </td>
              <td>
                <div className="gov-actions">
                  <button
                    className="btn-action btn-action-view"
                    onClick={() => onEdit(f)}
                    title="View Form Details"
                  >
                    <FaEye />
                  </button>

                  <button
                    className="btn-action btn-action-edit"
                    onClick={() => onEdit(f)}
                    title="Edit Form"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className={`btn-action btn-action-toggle ${f.status === "ACTIVE" ? "active" : "inactive"}`}
                    onClick={() => onToggleStatus(f)}
                    title={f.status === "ACTIVE" ? "Deactivate" : "Activate"}
                  >
                    <FaBan />
                  </button>
                  <button
                    className="btn-action btn-action-delete"
                    disabled={f.status === "ACTIVE"}
                    onClick={() => onDelete(f)}
                    title={f.status === "ACTIVE" ? "Deactivate before deleting" : "Delete Form"}
                  >
                    <FaTrash />
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
