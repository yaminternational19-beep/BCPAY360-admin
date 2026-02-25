import React, { useEffect, useState } from "react";
import "../../../styles/LeaveManagement.css";
import EmployeeLeaveModal from "./EmployeeLeaveModal";

export default function LeaveHistoryTable({
  filters,
  history = [],
  loading,
  error,
  fetchHistory
}) {
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (fetchHistory && history.length === 0) fetchHistory();
  }, [fetchHistory, history.length]);

  // Reset to page 1 when data/filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, history]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

  const filteredHistory = (history || []).filter(row => {
    const searchLow = (filters.search || "").toLowerCase();
    const matchesSearch = !filters.search ||
      (row.full_name?.toLowerCase() || "").includes(searchLow) ||
      (row.emp_id?.toLowerCase() || "").includes(searchLow);

    // Status Filter (New)
    const matchesStatus = !filters.status || filters.status === "ALL" ||
      (row.status?.toUpperCase() === filters.status.toUpperCase());

    const matchesBranch = !filters.branchId ||
      (row.branch_id && String(row.branch_id) === String(filters.branchId)) ||
      (!row.branch_id);

    const matchesDept = !filters.departmentId ||
      (row.department_id && String(row.department_id) === String(filters.departmentId)) ||
      (!row.department_id);

    return matchesSearch && matchesStatus && matchesBranch && matchesDept;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const paginatedHistory = filteredHistory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div style={{ position: 'relative' }}>
      {loading && <div className="loading-overlay">Loading leave history...</div>}

      {error && <div className="error" style={{ padding: '20px' }}>Error: {error}</div>}

      {filteredHistory.length === 0 && !loading && (
        <div className="muted" style={{ padding: '60px 20px', textAlign: 'center' }}>
          No leave history found matching your filters
        </div>
      )}

      {filteredHistory.length > 0 && (
        <>
          <table className="clean-table">
            <thead>
              <tr>
                <th>Emp ID</th>
                <th>Employee</th>
                <th>Department</th>
                <th>Leave</th>
                <th>From</th>
                <th>To</th>
                <th>Days</th>
                <th>Shift</th>
                <th>Status</th>
                <th>Applied</th>
              </tr>
            </thead>

            <tbody>
              {paginatedHistory.map((row) => (
                <tr
                  key={row.id}
                  className="clickable"
                  onClick={() => setSelectedEmp(row.employee_id)}
                  title="Click to view employee leave details"
                >
                  <td>
                    <strong>{row.emp_id}</strong>
                  </td>

                  <td>{row.full_name}</td>

                  <td>{row.department_name || "-"}</td>

                  <td>{row.leave_name}</td>

                  <td>{formatDate(row.from_date)}</td>

                  <td>{formatDate(row.to_date)}</td>

                  <td>{row.total_days}</td>

                  <td>
                    {row.shift_name
                      ? `${row.shift_name} (${row.shift_timing})`
                      : "-"}
                  </td>

                  <td>
                    <span className={`badge ${row.status.toLowerCase()}`}>
                      {row.status}
                    </span>
                  </td>

                  <td>{formatDate(row.applied_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="lm-pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="pg-btn"
              >
                Previous
              </button>
              <span className="pg-info">Page {currentPage} of {totalPages}</span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="pg-btn"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {selectedEmp && (
        <EmployeeLeaveModal
          employeeId={selectedEmp}
          history={history.filter(
            (h) => h.employee_id === selectedEmp
          )}
          onClose={() => setSelectedEmp(null)}
        />
      )}
    </div>
  );
}
