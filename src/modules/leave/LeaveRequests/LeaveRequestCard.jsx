import React from "react";
import "../../../styles/LeaveManagement.css";

export default function LeaveRequestCard({ request, onApprove, onReject }) {
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

  return (
    <div className="req-card">
      <div className="req-info">
        <div className="req-header">
          <h3>{request.full_name}</h3>
          <span className="emp-id">({request.emp_id})</span>
        </div>

        <div className="req-meta-grid">
          <div className="meta-item">
            <span className="meta-label">Leave Type</span>
            <span className="meta-value">{request.leave_name}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Duration</span>
            <span className="meta-value">{request.total_days} Day(s)</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Dates</span>
            <span className="meta-value">{formatDate(request.from_date)} - {formatDate(request.to_date)}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Department</span>
            <span className="meta-value">{request.department_name || "—"}</span>
          </div>
          {request.shift_name && (
            <div className="meta-item">
              <span className="meta-label">Shift</span>
              <span className="meta-value">{request.shift_name}</span>
            </div>
          )}
          <div className="meta-item">
            <span className="meta-label">Applied On</span>
            <span className="meta-value">{formatDate(request.applied_at)}</span>
          </div>
        </div>

        {request.reason && (
          <div className="reason-box">
            <strong>Reason:</strong> {request.reason}
          </div>
        )}
      </div>

      <div className="req-actions">
        <button
          className="btn-success"
          onClick={onApprove}
          title="Approve leave request"
        >
          Approve
        </button>

        <button
          className="btn-danger"
          onClick={onReject}
          title="Reject leave request"
        >
          Reject
        </button>
      </div>
    </div>
  );
}

