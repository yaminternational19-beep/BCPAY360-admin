import React, { useEffect, useState } from "react";
import "../../../styles/LeaveManagement.css";
import EmployeeLeaveModal from "./EmployeeLeaveModal";

export default function LeaveHistoryTable({
  history = [],
  pagination = { page: 1, limit: 10, total: 0, totalPages: 1 },
  onPageChange,
  loading,
  error,
}) {
  const [selectedEmp, setSelectedEmp] = useState(null);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

  return (
    <div style={{ position: 'relative', minHeight: '400px' }}>
      {loading && (
        <div className="lm-loading-overlay">
          <div className="spinner"></div>
          <span>Syncing History...</span>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {!loading && history.length === 0 && (
        <div className="lm-empty-state">
          <p>No leave history available for the selected filters.</p>
        </div>
      )}

      <table className={`clean-table ${loading ? 'opacity-40' : ''}`}>
        <thead>
          <tr>
            <th>Emp ID</th>
            <th>Employee</th>
            <th>Department</th>
            <th>Leave Type</th>
            <th>From Date</th>
            <th>To Date</th>
            <th>Total Days</th>
            <th>Shift Info</th>
            <th>Status</th>
            <th>Applied At</th>
          </tr>
        </thead>

        <tbody>
          {history.map((row) => (
            <tr
              key={row.id}
              className="clickable"
              onClick={() => setSelectedEmp(row)}
              title="Click to view details"
            >
              <td><strong>{row.emp_id}</strong></td>
              <td>{row.full_name}</td>
              <td>{row.department_name || "-"}</td>
              <td><span className="leave-type-pill">{row.leave_name}</span></td>
              <td>{formatDate(row.from_date)}</td>
              <td>{formatDate(row.to_date)}</td>
              <td><span className="days-badge">{row.total_days}</span></td>
              <td>
                <div className="shift-info-cell">
                  <span>{row.shift_name || "-"}</span>
                  {row.shift_timing && <small>{row.shift_timing}</small>}
                </div>
              </td>
              <td>
                <span className={`badge ${row.status?.toLowerCase()}`}>
                  {row.status}
                </span>
              </td>
              <td>{formatDate(row.applied_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modern Pagination Footer */}
      {pagination.totalPages > 1 && (
        <div className="pagination-footer-premium">
          <div className="pagination-info">
            Showing <span>{history.length}</span> of <span>{pagination.total}</span> records
          </div>
          <div className="pagination-controls">
            <button
              disabled={pagination.page <= 1 || loading}
              onClick={() => onPageChange(pagination.page - 1)}
              className="pg-btn-premium"
            >
              Previous
            </button>
            <div className="page-numbers">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    className={`pg-num-btn ${pagination.page === p ? 'active' : ''}`}
                    onClick={() => onPageChange(p)}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
            <button
              disabled={pagination.page >= pagination.totalPages || loading}
              onClick={() => onPageChange(pagination.page + 1)}
              className="pg-btn-premium"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {selectedEmp && (
        <EmployeeLeaveModal
          employeeId={selectedEmp.employee_id}
          history={[selectedEmp]} // Show details for this specific one
          onClose={() => setSelectedEmp(null)}
        />
      )}
    </div>
  );
}
