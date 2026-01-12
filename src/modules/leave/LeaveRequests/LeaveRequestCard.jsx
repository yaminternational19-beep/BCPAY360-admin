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
      {/* ================= LEFT INFO ================= */}
      <div className="req-info">
        <div>
          <strong>
            {request.full_name}
          </strong>
          <span className="muted" style={{ marginLeft: 6 }}>
            ({request.emp_id})
          </span>
        </div>

        <div className="meta">
          {request.department_name || "—"} ·{" "}
          {request.leave_name} · {request.total_days} day(s)
        </div>

        <div className="meta">
          {formatDate(request.from_date)} → {formatDate(request.to_date)}
        </div>

        {request.shift_name && (
          <div className="meta">
            Shift: {request.shift_name} ({request.shift_timing})
          </div>
        )}

        {request.reason && (
          <div className="reason">
            <strong>Reason:</strong> {request.reason}
          </div>
        )}

        <div className="meta">
          Applied on {formatDate(request.applied_at)}
        </div>
      </div>

      {/* ================= ACTIONS ================= */}
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
