import React, { useEffect, useState } from "react";
import { FaHourglassHalf, FaCalendarCheck, FaHistory, FaClipboardList, FaSearch, FaRedo } from "react-icons/fa";

/* Leave Policy */
import LeavePolicyForm from "./LeavePolicy/LeavePolicyForm";
import LeavePolicyTable from "./LeavePolicy/LeavePolicyTable";

/* Leave Requests */
import PendingLeaveList from "./LeaveRequests/PendingLeaveList";

/* Leave History */
import LeaveHistoryTable from "./LeaveHistory/LeaveHistoryTable";

import "../../styles/LeaveManagement.css";
import { getDepartments } from "../../api/master.api";
import { useBranch } from "../../hooks/useBranch"; // Import Hook
import NoBranchState from "../../components/NoBranchState";

import useLeaveRequests from "./hooks/useLeaveRequests";

export default function LeaveManagementPage() {
  const [activeTab, setActiveTab] = useState("approvals");
  const [showPolicyForm, setShowPolicyForm] = useState(false);

  // Use Branch Hook
  const { branches: branchList, selectedBranch, changeBranch, isSingleBranch, canProceed, isLoading: branchLoading } = useBranch();

  // Integrated Leave Hook
  const {
    requests,
    history,
    loading: leaveLoading,
    error: leaveError,
    approve,
    reject,
    fetchPending,
    fetchHistory
  } = useLeaveRequests();

  // Filter States
  const [filters, setFilters] = useState({
    search: "",
    departmentId: "",
    status: "ALL"
  });

  // Master Data
  const [departmentList, setDepartmentList] = useState([]);
  const [loadingTab, setLoadingTab] = useState(null);

  useEffect(() => {
    fetchPending();
    fetchHistory();
  }, [fetchPending, fetchHistory, selectedBranch]);

  useEffect(() => {
    if (selectedBranch) {
      const fetchDepts = async () => {
        try {
          const res = await getDepartments(selectedBranch);
          setDepartmentList(res?.data || res || []);
        } catch (err) {
          // silenced
        }
      };
      fetchDepts();
    } else {
      setDepartmentList([]);
    }
  }, [selectedBranch]);

  // Derived Stats
  const pendingCount = requests.filter(req => {
    return !selectedBranch || String(req.branch_id) === String(selectedBranch);
  }).length;

  const onLeaveTodayCount = history.filter(h => {
    if (h.status !== 'APPROVED') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const from = new Date(h.from_date);
    from.setHours(0, 0, 0, 0);

    const to = new Date(h.to_date);
    to.setHours(0, 0, 0, 0);

    const branchMatch = !selectedBranch || String(h.branch_id) === String(selectedBranch);
    return branchMatch && today >= from && today <= to;
  }).length;

  const handleReset = () => {
    setFilters({
      search: "",
      departmentId: "",
      status: "ALL"
    });
  };

  const switchTab = (tab) => {
    setLoadingTab(tab);
    setTimeout(() => {
      setActiveTab(tab);
      setLoadingTab(null);
    }, 200);
  };

  // Combine filters with global selectedBranch for children
  const activeFilters = { ...filters, branchId: selectedBranch };

  return (
    <div className="lm-root">
      {/* ================= PAGE HEADER ================= */}
      <div className="lm-page-header">
        <div className="lm-title-section">
          <h1>Leave Management</h1>
          <p>Review attendance data, process leave requests and manage policies.</p>
        </div>
        <button className="btn-primary premium" onClick={() => setShowPolicyForm(true)}>
          + Add Leave Policy
        </button>
      </div>

      {/* ================= SUMMARY CARDS ================= */}
      <div className="lm-summary-grid">
        <div className="lm-summary-card" onClick={() => switchTab("approvals")}>
          <div className="lm-icon-box pending">
            <FaHourglassHalf />
          </div>
          <div className="lm-summary-info">
            <span className="lm-summary-label">Pending</span>
            <span className="lm-summary-value">{pendingCount}</span>
          </div>
        </div>

        <div className="lm-summary-card">
          <div className="lm-icon-box approved">
            <FaCalendarCheck />
          </div>
          <div className="lm-summary-info">
            <span className="lm-summary-label">On Leave Today</span>
            <span className="lm-summary-value">{onLeaveTodayCount}</span>
          </div>
        </div>

        <div className="lm-summary-card" onClick={() => switchTab("history")}>
          <div className="lm-icon-box history">
            <FaHistory />
          </div>
          <div className="lm-summary-info">
            <span className="lm-summary-label">History</span>
            <span className="lm-summary-value">View All</span>
          </div>
        </div>

        <div className="lm-summary-card" onClick={() => switchTab("policy")}>
          <div className="lm-icon-box policy">
            <FaClipboardList />
          </div>
          <div className="lm-summary-info">
            <span className="lm-summary-label">Policies</span>
            <span className="lm-summary-value">Active</span>
          </div>
        </div>
      </div>

      {/* ================= FILTERS BAR ================= */}
      <div className="lm-filters-bar">
        <div className="lm-search-container" style={{ flex: 1, position: 'relative' }}>
          <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            className="lm-search-input"
            placeholder="Search by employee name or code..."
            style={{ paddingLeft: '40px' }}
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>

        {/* Hide Branch Selector if Single Branch Mode */}
        {!isSingleBranch && (
          <select
            className="lm-select"
            value={selectedBranch === null ? "ALL" : selectedBranch}
            onChange={(e) => {
              const val = e.target.value;
              changeBranch(val === "ALL" ? null : Number(val));
            }}
          >
            {branchList.length > 1 && <option value="ALL">All Branches</option>}
            {branchList.map(b => (
              <option key={b.id} value={b.id}>{b.branch_name}</option>
            ))}
          </select>
        )}

        <select
          className="lm-select"
          value={filters.departmentId}
          onChange={(e) => setFilters({ ...filters, departmentId: e.target.value })}
          disabled={!selectedBranch}
        >
          <option value="">{selectedBranch ? "All Departments" : "Select Branch First"}</option>
          {departmentList.map(d => (
            <option key={d.id} value={d.id}>{d.department_name}</option>
          ))}
        </select>

        <select
          className="lm-select"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>

        <button className="lm-btn-reset" onClick={handleReset} title="Reset Filters">
          <FaRedo /> Reset
        </button>
      </div>

      {/* ================= TAB SWITCH ================= */}
      <div className="lm-switch">
        <div
          className={`lm-tab ${activeTab === "approvals" ? "active" : ""}`}
          onClick={() => switchTab("approvals")}
        >
          <FaHourglassHalf /> Approvals
          {pendingCount > 0 && (
            <span className="tab-badge">{pendingCount}</span>
          )}
        </div>

        <div
          className={`lm-tab ${activeTab === "history" ? "active" : ""}`}
          onClick={() => switchTab("history")}
        >
          <FaHistory /> History
        </div>

        <div
          className={`lm-tab ${activeTab === "policy" ? "active" : ""}`}
          onClick={() => switchTab("policy")}
        >
          <FaClipboardList /> Leave Types / Policies
        </div>
      </div>

      {/* ================= PANEL ================= */}
      <section className="lm-panel" style={{ padding: '20px' }}>
        {loadingTab && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <span>Switching View...</span>
          </div>
        )}

        {/* POLICY */}
        <div className={`lm-section ${activeTab === "policy" ? "active" : ""}`}>
          <LeavePolicyTable filters={activeFilters} />
        </div>

        {/* APPROVALS */}
        <div className={`lm-section ${activeTab === "approvals" ? "active" : ""}`}>
          <PendingLeaveList
            filters={activeFilters}
            requests={requests}
            history={history}
            loading={leaveLoading}
            error={leaveError}
            approve={approve}
            reject={reject}
            fetchPending={fetchPending}
            fetchHistory={fetchHistory}
          />
        </div>

        {/* HISTORY */}
        <div className={`lm-section ${activeTab === "history" ? "active" : ""}`}>
          <LeaveHistoryTable
            filters={activeFilters}
            history={history}
            loading={leaveLoading}
            error={leaveError}
            fetchHistory={fetchHistory}
          />
        </div>
      </section>

      {/* ================= MODAL ================= */}
      {showPolicyForm && (
        <LeavePolicyForm onClose={() => setShowPolicyForm(false)} />
      )}
    </div>
  );
}
