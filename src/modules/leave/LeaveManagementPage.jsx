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

export default function LeaveManagementPage() {
  const [activeTab, setActiveTab] = useState("approvals");
  const [showPolicyForm, setShowPolicyForm] = useState(false);

  // Use Branch Hook
  const { branches: branchList, selectedBranch, changeBranch, isSingleBranch, canProceed, isLoading: branchLoading } = useBranch();

  // Filter States
  const [filters, setFilters] = useState({
    search: "",
    branchId: "",
    departmentId: ""
  });

  // Master Data
  const [departmentList, setDepartmentList] = useState([]);

  // Counts (In production, fetch these from a dedicated summary API)
  const [pendingCount, setPendingCount] = useState(0);
  const [loadingTab, setLoadingTab] = useState(null);

  // Sync selected branch to filters
  useEffect(() => {
    if (selectedBranch) {
      setFilters(prev => ({ ...prev, branchId: selectedBranch, departmentId: "" }));
    }
  }, [selectedBranch]);

  useEffect(() => {
    // If user changes branch manually in UI (for multi-branch)
    if (filters.branchId && filters.branchId !== selectedBranch) {
      changeBranch(filters.branchId);
    }
  }, [filters.branchId, selectedBranch, changeBranch]);

  useEffect(() => {
    if (filters.branchId) {
      const fetchDepts = async () => {
        try {
          const res = await getDepartments(filters.branchId);
          setDepartmentList(res?.data || res || []);
        } catch (err) {
          // silenced
        }
      };
      fetchDepts();
    } else {
      setDepartmentList([]);
    }
  }, [filters.branchId]);

  const handleReset = () => {
    setFilters({
      search: "",
      branchId: "",
      departmentId: ""
    });
  };

  const switchTab = (tab) => {
    setLoadingTab(tab);
    setTimeout(() => {
      setActiveTab(tab);
      setLoadingTab(null);
    }, 200);
  };

  return (
    <div className="lm-root">
      {/* ================= PAGE HEADER ================= */}
      <div className="lm-page-header">
        <div className="lm-title-section">
          <h1>Leave Management</h1>
          <p>Review attendance data, process leave requests and manage policies.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowPolicyForm(true)}>
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
            <span className="lm-summary-value">0</span>
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
            value={filters.branchId}
            onChange={(e) => setFilters({ ...filters, branchId: e.target.value, departmentId: "" })}
          >
            <option value="">All Branches</option>
            {branchList.map(b => (
              <option key={b.id} value={b.id}>{b.branch_name}</option>
            ))}
          </select>
        )}

        <select
          className="lm-select"
          value={filters.departmentId}
          onChange={(e) => setFilters({ ...filters, departmentId: e.target.value })}
          disabled={!filters.branchId}
        >
          <option value="">{filters.branchId ? "All Departments" : "Select Branch First"}</option>
          {departmentList.map(d => (
            <option key={d.id} value={d.id}>{d.department_name}</option>
          ))}
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
          <LeavePolicyTable filters={filters} />
        </div>

        {/* APPROVALS */}
        <div className={`lm-section ${activeTab === "approvals" ? "active" : ""}`}>
          <PendingLeaveList
            onCountChange={setPendingCount}
            filters={filters}
          />
        </div>

        {/* HISTORY */}
        <div className={`lm-section ${activeTab === "history" ? "active" : ""}`}>
          <LeaveHistoryTable filters={filters} />
        </div>
      </section>

      {/* ================= MODAL ================= */}
      {showPolicyForm && (
        <LeavePolicyForm onClose={() => setShowPolicyForm(false)} />
      )}
    </div>
  );
}
