import React, { useState, useMemo } from "react";
import "../styles/LeaveManagement.css";

export default function LeaveManagement() {
  const [policies, setPolicies] = useState([
    { id: 1, type: "SL", display: "Sick Leave", limit: 10 },
    { id: 2, type: "CL", display: "Casual Leave", limit: 12 },
    { id: 3, type: "EL", display: "Earned Leave", limit: 18 },
  ]);

  const [requests, setRequests] = useState([
    {
      id: 101,
      empName: "Asha Patel",
      empId: "E-112",
      type: "SL",
      from: "2025-12-18",
      to: "2025-12-19",
      days: 2,
      reason: "High fever",
      status: "Pending",
      comments: [],
    },
    {
      id: 102,
      empName: "Rohit Sharma",
      empId: "E-207",
      type: "CL",
      from: "2025-12-22",
      to: "2025-12-22",
      days: 1,
      reason: "Personal work",
      status: "Pending",
      comments: [],
    },
  ]);

  const [history, setHistory] = useState([]);

  const [form, setForm] = useState({ type: "", display: "", limit: "" });
  const [editingId, setEditingId] = useState(null);

  function savePolicy(e) {
    e.preventDefault();
    const { type, display, limit } = form;
    if (!type.trim() || !display.trim() || !limit) return;

    if (editingId) {
      setPolicies((p) =>
        p.map((x) =>
          x.id === editingId
            ? { ...x, type, display, limit: Number(limit) }
            : x
        )
      );
      setEditingId(null);
    } else {
      setPolicies((p) => [
        ...p,
        {
          id: Date.now(),
          type: type.toUpperCase(),
          display,
          limit: Number(limit),
        },
      ]);
    }

    setForm({ type: "", display: "", limit: "" });
  }

  function removePolicy(id) {
    setPolicies((p) => p.filter((x) => x.id !== id));
  }

  function editPolicy(p) {
    setEditingId(p.id);
    setForm({ type: p.type, display: p.display, limit: p.limit });
  }

  function handleRequestAction(id, action, comment = "") {
    setRequests((rs) => {
      const req = rs.find((r) => r.id === id);
      if (!req) return rs;

      const updated = { ...req, status: action };
      if (comment)
        updated.comments.push({
          by: "HR",
          text: comment,
          at: new Date().toISOString(),
        });

      setHistory((h) => [{ ...updated, actionedAt: new Date() }, ...h]);

      return rs.filter((r) => r.id !== id);
    });
  }

  function addCommentToRequest(id, comment) {
    if (!comment.trim()) return;

    setRequests((rs) =>
      rs.map((r) =>
        r.id === id
          ? {
              ...r,
              comments: [
                ...r.comments,
                { by: "HR", text: comment, at: new Date().toISOString() },
              ],
            }
          : r
      )
    );
  }

  const leaveSummary = useMemo(() => {
    const used = history.reduce((acc, h) => {
      acc[h.type] = (acc[h.type] || 0) + h.days;
      return acc;
    }, {});

    return policies.map((p) => ({
      ...p,
      used: used[p.type] || 0,
      remaining: p.limit - (used[p.type] || 0),
    }));
  }, [policies, history]);

  return (
    <div className="lm-root">
      <header className="lm-header">
        <h1>Leave Management</h1>
      </header>

      <div className="lm-grid">
        {/* POLICY SETUP */}
        <section className="card">
          <h2>Leave Policy Setup</h2>

          <form className="policy-form" onSubmit={savePolicy}>
            <div className="row">
              <input
                placeholder="Code (SL)"
                value={form.type}
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value.toUpperCase() })
                }
              />
              
              <input
                placeholder="Display Name (Sick Leave)"
                value={form.display}
                onChange={(e) =>
                  setForm({ ...form, display: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Yearly Limit"
                value={form.limit}
                onChange={(e) => setForm({ ...form, limit: e.target.value })}
              />
            </div>

            <button className="btn-primary">
              {editingId ? "Update Policy" : "Add Policy"}
            </button>
          </form>

          <table className="clean-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Limit</th>
                <th>Used</th>
                <th>Remaining</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {leaveSummary.map((p) => (
                <tr key={p.id}>
                  <td>{p.type}</td>
                  <td>{p.display}</td>
                  <td>{p.limit}</td>
                  <td>{p.used}</td>
                  <td>{p.remaining}</td>
                  <td>
                    <button className="btn-sm" onClick={() => editPolicy(p)}>
                      Edit
                    </button>
                    <button
                      className="btn-sm danger"
                      onClick={() => removePolicy(p.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* REQUESTS */}
        <section className="card">
          <h2>Pending Requests</h2>

          {requests.length === 0 && <p className="empty">No pending requests</p>}

          {requests.map((r) => (
            <div className="req-card" key={r.id}>
              <div className="req-top">
                <div>
                  <b>{r.empName}</b> ({r.empId})
                  <div className="meta">
                    {r.type} · {r.from} → {r.to} · {r.days} days
                  </div>
                </div>

                <div className="req-actions">
                  <button
                    className="btn-success"
                    onClick={() =>
                      handleRequestAction(r.id, "Approved", "Approved by HR")
                    }
                  >
                    Approve
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() =>
                      handleRequestAction(r.id, "Rejected", "Rejected by HR")
                    }
                  >
                    Reject
                  </button>
                </div>
              </div>

              <p className="reason">Reason: {r.reason}</p>

              <div className="comment-box">
                {r.comments.map((c, i) => (
                  <div className="comment" key={i}>
                    {c.text}
                  </div>
                ))}

                <input
                  placeholder="Add comment & press Enter"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addCommentToRequest(r.id, e.target.value);
                      e.target.value = "";
                    }
                  }}
                />
              </div>
            </div>
          ))}
        </section>

        {/* HISTORY */}
        <section className="card full">
          <h2>Leave History</h2>

          <table className="clean-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Employee</th>
                <th>Type</th>
                <th>Days</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.id}>
                  <td>{new Date(h.actionedAt).toLocaleString()}</td>
                  <td>
                    {h.empName} ({h.empId})
                  </td>
                  <td>{h.type}</td>
                  <td>{h.days}</td>
                  <td className={h.status === "Approved" ? "green" : "red"}>
                    {h.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
