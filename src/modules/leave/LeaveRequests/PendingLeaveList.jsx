import React, { useState, useEffect } from "react";
import "../../../styles/LeaveManagement.css";
import useLeaveRequests from "../hooks/useLeaveRequests";
import LeaveRequestCard from "./LeaveRequestCard";
import RejectLeaveModal from "./RejectLeaveModal";

export default function PendingLeaveList({ onCountChange, filters }) {
  const { requests, loading, error, approve, reject, fetchPending } = useLeaveRequests();
  const [rejecting, setRejecting] = useState(null);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  useEffect(() => {
    if (onCountChange) onCountChange(requests.length);
  }, [requests, onCountChange]);

  const filteredRequests = requests.filter(req => {
    const searchLow = filters.search.toLowerCase();
    const matchesSearch = !filters.search ||
      req.name.toLowerCase().includes(searchLow) ||
      req.employee_code.toLowerCase().includes(searchLow);

    // Assuming API or hook returns branch_id and department_id in the request object
    const matchesBranch = !filters.branchId || String(req.branch_id) === String(filters.branchId);
    const matchesDept = !filters.departmentId || String(req.department_id) === String(filters.departmentId);

    return matchesSearch && matchesBranch && matchesDept;
  });

  return (
    <div style={{ position: 'relative', minHeight: '200px' }}>
      {loading && <div className="loading-overlay">Loading pending leave requests...</div>}

      {error && <div className="error-message" style={{ color: 'var(--danger)', padding: '20px' }}>{error}</div>}

      {filteredRequests.length === 0 && !loading && (
        <div className="muted" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <p>No pending leave requests found matching your filters</p>
        </div>
      )}

      <div className="requests-container">
        {filteredRequests.map(req => (
          <LeaveRequestCard
            key={req.id}
            request={req}
            onApprove={() => approve(req.id)}
            onReject={() => setRejecting(req)}
          />
        ))}
      </div>

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
    </div>
  );
}
