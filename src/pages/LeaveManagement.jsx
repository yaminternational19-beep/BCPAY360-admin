import React, { useState, useMemo } from "react";
import "../styles/LeaveManagement.css";
import { makeEmployees } from "../utils/employeeGenerator";

const PAGE_SIZE = 5;

const leaveTypes = {
  SL: "Sick Leave",
  CL: "Casual Leave",
  EL: "Earned Leave",
};

const empCode = (id) => `EMP${String(id).padStart(3, "0")}`;

function randomDate() {
  return `2025-${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}-${String(
    Math.floor(Math.random() * 25) + 1
  ).padStart(2, "0")}`;
}

function generateRequests(employees, count = 12) {
  return Array.from({ length: count }).map((_, i) => {
    const emp = employees[Math.floor(Math.random() * employees.length)];
    const days = Math.floor(Math.random() * 3) + 1;
    const type = Object.keys(leaveTypes)[Math.floor(Math.random() * 3)];

    return {
      id: `${Date.now()}_${i}`,
      empId: emp.id,
      empName: emp.name,
      department: emp.department,
      type,
      from: randomDate(),
      to: randomDate(),
      days,
      status: "Pending",
    };
  });
}

export default function LeaveManagement() {
  /* =============================
     AUTH
  ============================== */
  const user = JSON.parse(localStorage.getItem("auth_user")) || {};
  const isAdmin = user.role === "COMPANY_ADMIN";
  const isHR = user.role === "HR";

  const employees = useMemo(() => makeEmployees(200), []);

  /* =============================
     STATE
  ============================== */
  const [policies] = useState([
    { type: "SL", limit: 10 },
    { type: "CL", limit: 12 },
    { type: "EL", limit: 18 },
  ]);

  const [requests, setRequests] = useState(generateRequests(employees));
  const [history, setHistory] = useState([]);
  const [reqPage, setReqPage] = useState(1);
  const [activeEmployee, setActiveEmployee] = useState(null);

  /* =============================
     DATA-LEVEL ACCESS CONTROL
  ============================== */
  const visibleRequests = useMemo(() => {
    if (isAdmin) return requests;
    if (isHR) {
      return requests.filter(r => r.department === user.department);
    }
    return [];
  }, [requests, isAdmin, isHR, user.department]);

  /* =============================
     LEAVE USAGE
  ============================== */
  const usageByEmployee = useMemo(() => {
    const map = {};
    history.forEach(h => {
      if (!map[h.empId]) map[h.empId] = {};
      map[h.empId][h.type] = (map[h.empId][h.type] || 0) + h.days;
    });
    return map;
  }, [history]);

  const getPolicyLimit = (type) =>
    policies.find(p => p.type === type)?.limit || 0;

  /* =============================
     ACTIONS
  ============================== */
  const approveRequest = (req) => {
    const used = usageByEmployee[req.empId]?.[req.type] || 0;
    const limit = getPolicyLimit(req.type);

    if (used + req.days > limit) {
      alert(`${leaveTypes[req.type]} exceeded. Remaining: ${limit - used}`);
      return;
    }

    setRequests(prev => prev.filter(r => r.id !== req.id));
    setHistory(prev => [
      { ...req, status: "Approved", actionedAt: new Date().toISOString() },
      ...prev,
    ]);
  };

  const rejectRequest = (req) => {
    setRequests(prev => prev.filter(r => r.id !== req.id));
    setHistory(prev => [
      { ...req, status: "Rejected", actionedAt: new Date().toISOString() },
      ...prev,
    ]);
  };

  /* =============================
     PAGINATION
  ============================== */
  const pagedRequests = useMemo(() => {
    const start = (reqPage - 1) * PAGE_SIZE;
    return visibleRequests.slice(start, start + PAGE_SIZE);
  }, [visibleRequests, reqPage]);

  /* =============================
     HISTORY SUMMARY
  ============================== */
  const historySummary = useMemo(() => {
    const summary = {};
    history.forEach(h => {
      if (!summary[h.empId]) {
        summary[h.empId] = { name: h.empName, SL: 0, CL: 0, EL: 0 };
      }
      if (h.status === "Approved") {
        summary[h.empId][h.type] += h.days;
      }
    });
    return Object.values(summary);
  }, [history]);

  const openEmployeeHistory = (empId) => {
    setActiveEmployee({
      emp: employees.find(e => e.id === empId),
      history: history.filter(h => h.empId === empId),
    });
  };

  return (
    <div className="lm-root">
      <header className="lm-header">
        <h1>Leave Management</h1>
        <p>
          {isAdmin
            ? "Admin Access — All Departments"
            : `HR Access — ${user.department} Department`}
        </p>
      </header>

      <div className="lm-grid">
        {/* POLICY */}
        <section className="card">
          <h2>Leave Policy</h2>
          <table className="clean-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Leave Type</th>
                <th>Yearly Limit</th>
              </tr>
            </thead>
            <tbody>
              {policies.map(p => (
                <tr key={p.type}>
                  <td>{p.type}</td>
                  <td>{leaveTypes[p.type]}</td>
                  <td>{p.limit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* PENDING REQUESTS */}
        <section className="card">
          <h2>Pending Requests</h2>

          {pagedRequests.length === 0 && (
            <p className="muted">No pending requests.</p>
          )}

          {pagedRequests.map(r => {
            const used = usageByEmployee[r.empId]?.[r.type] || 0;
            const limit = getPolicyLimit(r.type);

            return (
              <div className="req-card" key={r.id}>
                <div>
                  <b className="emp-link" onClick={() => openEmployeeHistory(r.empId)}>
                    {empCode(r.empId)} — {r.empName}
                  </b>
                  <div className="meta">
                    {leaveTypes[r.type]} · {r.days} days
                  </div>
                  <div className="meta">
                    Allowed: {limit} | Used: {used} | Balance: {limit - used}
                  </div>
                </div>

                <div className="req-actions">
                  <button className="btn-success" onClick={() => approveRequest(r)}>
                    Approve
                  </button>
                  <button className="btn-danger" onClick={() => rejectRequest(r)}>
                    Reject
                  </button>
                </div>
              </div>
            );
          })}

          <div className="pager">
            <button disabled={reqPage === 1} onClick={() => setReqPage(p => p - 1)}>
              Prev
            </button>
            <span>Page {reqPage}</span>
            <button
              disabled={reqPage * PAGE_SIZE >= visibleRequests.length}
              onClick={() => setReqPage(p => p + 1)}
            >
              Next
            </button>
          </div>
        </section>

        {/* HISTORY */}
        <section className="card full">
          <h2>Leave History Summary</h2>
          <table className="clean-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>SL</th>
                <th>CL</th>
                <th>EL</th>
              </tr>
            </thead>
            <tbody>
              {historySummary.map((h, i) => (
                <tr key={i}>
                  <td>{h.name}</td>
                  <td>{h.SL}</td>
                  <td>{h.CL}</td>
                  <td>{h.EL}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      {/* EMPLOYEE HISTORY MODAL */}
      {activeEmployee && (
        <div className="lm-modal-backdrop" onClick={() => setActiveEmployee(null)}>
          <div className="lm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="lm-modal-header">
              <h3>
                {empCode(activeEmployee.emp.id)} — {activeEmployee.emp.name}
              </h3>
              <button onClick={() => setActiveEmployee(null)}>✕</button>
            </div>

            <div className="lm-modal-body">
              <p><strong>Department:</strong> {activeEmployee.emp.department}</p>

              {activeEmployee.history.length === 0 ? (
                <p className="muted">No leave history.</p>
              ) : (
                <table className="clean-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>From</th>
                      <th>To</th>
                      <th>Days</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeEmployee.history.map(h => (
                      <tr key={h.id}>
                        <td>{leaveTypes[h.type]}</td>
                        <td>{h.from}</td>
                        <td>{h.to}</td>
                        <td>{h.days}</td>
                        <td>{h.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
