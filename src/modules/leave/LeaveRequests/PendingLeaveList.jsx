import React, { useState, useEffect } from "react";
import "../../../styles/LeaveManagement.css";
import LeaveRequestCard from "./LeaveRequestCard";
import RejectLeaveModal from "./RejectLeaveModal";
export default function PendingLeaveList({
  filters,
  requests = [],
  history = [],
  loading,
  error,
  approve,
  reject,
  fetchPending,
  fetchHistory
}) {
  const [rejecting, setRejecting] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset to page 1 when data/filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, requests, history]);

  const displayData = filters.status === "PENDING" || filters.status === "ALL"
    ? requests
    : history.filter(h => h.status?.toUpperCase() === filters.status);

  const filteredRequests = (displayData || []).filter(req => {
    const searchLow = (filters.search || "").toLowerCase();
    const matchesSearch = !filters.search ||
      (req.full_name?.toLowerCase() || "").includes(searchLow) ||
      (req.emp_id?.toLowerCase() || "").includes(searchLow);

    const matchesBranch = !filters.branchId ||
      (req.branch_id && String(req.branch_id) === String(filters.branchId)) ||
      (!req.branch_id);

    const matchesDept = !filters.departmentId ||
      (req.department_id && String(req.department_id) === String(filters.departmentId)) ||
      (!req.department_id);

    return matchesSearch && matchesBranch && matchesDept;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);



  return (
    <div style={{ position: 'relative', minHeight: '200px' }}>
      {loading && <div className="loading-overlay">Loading leave requests...</div>}

      {error && <div className="error-message" style={{ color: 'var(--danger)', padding: '20px' }}>{error}</div>}

      {filteredRequests.length === 0 && !loading && (
        <div className="muted" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <p>No {filters.status.toLowerCase()} leave requests found matching your filters</p>
        </div>
      )}

      <div className="requests-container">
        {paginatedRequests.map(req => (
          <LeaveRequestCard
            key={req.id}
            request={req}
            onApprove={() => approve(req.id)}
            onReject={() => setRejecting(req)}
            showActions={req.status?.toUpperCase() === "PENDING" || !req.status}
          />
        ))}
      </div>

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
