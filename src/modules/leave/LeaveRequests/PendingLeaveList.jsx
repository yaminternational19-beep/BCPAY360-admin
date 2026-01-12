import React, { useState, useEffect } from "react";
import "../../../styles/LeaveManagement.css";
import useLeaveRequests from "../hooks/useLeaveRequests";
import LeaveRequestCard from "./LeaveRequestCard";
import RejectLeaveModal from "./RejectLeaveModal";

export default function PendingLeaveList() {
  const { requests, loading, error, approve, reject, fetchPending } = useLeaveRequests();

  const [rejecting, setRejecting] = useState(null);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  return (
    <section className="card">
      <h2>Pending Leave Requests</h2>

      {loading && <div className="loading-overlay">Loading pending leave requests...</div>}

      {error && <div className="error">Error: {error}</div>}

      {requests.length === 0 && !loading && (
        <p className="muted">No pending leave requests</p>
      )}

      {requests.map(req => (
        <LeaveRequestCard
          key={req.id}
          request={req}
          onApprove={() => approve(req.id)}
          onReject={() => setRejecting(req)}
        />
      ))}

      {rejecting && (
        <RejectLeaveModal
          request={rejecting}
          onClose={() => setRejecting(null)}
          onSubmit={async (remarks) => {
            await reject(rejecting.id, remarks);
            setRejecting(null);
          }}
        />
      )}
    </section>
  );
}
