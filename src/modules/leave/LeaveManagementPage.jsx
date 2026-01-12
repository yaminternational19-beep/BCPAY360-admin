import React, { useEffect, useState } from "react";

/* Leave Policy */
import LeavePolicyForm from "./LeavePolicy/LeavePolicyForm";
import LeavePolicyTable from "./LeavePolicy/LeavePolicyTable";

/* Leave Requests */
import PendingLeaveList from "./LeaveRequests/PendingLeaveList";

/* Leave History */
import LeaveHistoryTable from "./LeaveHistory/LeaveHistoryTable";

import "../../styles/LeaveManagement.css";

export default function LeaveManagementPage() {
  const [activeTab, setActiveTab] = useState("policy");
  const [showPolicyForm, setShowPolicyForm] = useState(false);

  // Simulated counts (replace with real API data)
  const [pendingCount, setPendingCount] = useState(0);
  const [loadingTab, setLoadingTab] = useState(null);

  /* ===============================
     KEYBOARD SHORTCUTS
  =============================== */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "1") setActiveTab("policy");
      if (e.key === "2") setActiveTab("approvals");
      if (e.key === "3") setActiveTab("history");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  /* ===============================
     AUTO-SWITCH TO APPROVALS
     (call this when polling / socket updates)
  =============================== */
  useEffect(() => {
    if (pendingCount > 0) {
      setActiveTab("approvals");
    }
  }, [pendingCount]);

  const switchTab = (tab) => {
    setLoadingTab(tab);
    setTimeout(() => {
      setActiveTab(tab);
      setLoadingTab(null);
    }, 200); // smooth transition delay
  };

  return (
    <div className="lm-root">
      {/* ================= HEADER ================= */}
      <header className="lm-header">
        <h1>Leave Management</h1>
        <p>Admin / HR Leave Control Panel</p>
      </header>

      {/* ================= TAB SWITCH ================= */}
      <div className="lm-switch">

        <div
          className={`lm-tab ${activeTab === "approvals" ? "active" : ""}`}
          onClick={() => switchTab("approvals")}
        >
          ⏳ Approvals
          {pendingCount > 0 && (
            <span className="tab-badge">{pendingCount}</span>
          )}
        </div>

        <div
          className={`lm-tab ${activeTab === "history" ? "active" : ""}`}
          onClick={() => switchTab("history")}
        >
          🕘 History
        </div>


        <div
          className={`lm-tab ${activeTab === "policy" ? "active" : ""}`}
          onClick={() => switchTab("policy")}
        >
          🧾 Leave Types
        </div>
      </div>

      {/* ================= PANEL ================= */}
      <section className="lm-panel">
        {/* Sticky Action Bar */}
       

        {/* Skeleton Loader */}
        {loadingTab && <div className="lm-skeleton" />}

        {/* POLICY */}
        <div className={`lm-section ${activeTab === "policy" ? "active" : ""}`}>
          <LeavePolicyTable />
        </div>

        {/* APPROVALS */}
        <div
          className={`lm-section ${
            activeTab === "approvals" ? "active" : ""
          }`}
        >
          <PendingLeaveList
            onCountChange={setPendingCount}
          />
        </div>

        {/* HISTORY */}
        <div
          className={`lm-section ${activeTab === "history" ? "active" : ""}`}
        >
          <LeaveHistoryTable />
        </div>
      </section>

      {/* ================= MODAL ================= */}
      {showPolicyForm && (
        <LeavePolicyForm onClose={() => setShowPolicyForm(false)} />
      )}
    </div>
  );
}
