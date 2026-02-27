import React, { useState, useEffect } from "react";
import "../../../styles/LeaveManagement.css";
import LeaveRequestCard from "./LeaveRequestCard";
import RejectLeaveModal from "./RejectLeaveModal";
export default function PendingLeaveList({
  requests = [],
  pagination = { page: 1, limit: 10, total: 0, totalPages: 1 },
  onPageChange,
  loading,
  error,
  approve,
  reject,
}) {
  const [rejecting, setRejecting] = useState(null);

  return (
    <div style={{ position: 'relative', minHeight: '300px' }}>
      {loading && (
        <div className="lm-loading-overlay">
          <div className="spinner"></div>
          <span>Syncing Requests...</span>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {!loading && requests.length === 0 && (
        <div className="lm-empty-state">
          <p>No leave requests found for this selection.</p>
        </div>
      )}

      <div className={`requests-container ${loading ? 'opacity-40' : ''}`}>
        {requests.map(req => (
          <LeaveRequestCard
            key={req.id}
            request={req}
            onApprove={() => approve(req.id)}
            onReject={() => setRejecting(req)}
            showActions={req.status?.toUpperCase() === "PENDING" || !req.status}
          />
        ))}
      </div>

      {/* Modern Pagination Footer */}
      {pagination.totalPages > 1 && (
        <div className="pagination-footer-premium">
          <div className="pagination-info">
            Showing <span>{requests.length}</span> of <span>{pagination.total}</span> requests
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
                const p = i + 1; // Simplified for now
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
