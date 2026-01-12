import React, { useEffect, useState } from "react";
import "../../../styles/LeaveManagement.css";
import useLeaveRequests from "../hooks/useLeaveRequests";
import EmployeeLeaveModal from "./EmployeeLeaveModal";

export default function LeaveHistoryTable() {
  const { history, fetchHistory, loading, error } = useLeaveRequests();
  const [selectedEmp, setSelectedEmp] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

  return (
    <section className="card full">
      <h2>Leave History</h2>

      {loading && <div className="loading-overlay">Loading leave history...</div>}

      {error && <div className="error">Error: {error}</div>}

      {history.length === 0 && !loading && (
        <p className="muted">No leave history found</p>
      )}

      {history.length > 0 && (
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
            {history.map((row) => (
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
    </section>
  );
}
