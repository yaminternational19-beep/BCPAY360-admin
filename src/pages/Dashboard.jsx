import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Dashboard.css";
import { API_BASE } from "../utils/apiBase";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ✅ hooks FIRST, no conditions above */
  const attendanceChart = useMemo(() => {
    if (!data) return null;

    return {
      labels: ["Present", "Absent", "Late"],
      datasets: [
        {
          data: [
            data.attendance.present,
            data.attendance.absent,
            data.attendance.late,
          ],
          backgroundColor: ["#22c55e", "#ef4444", "#f59e0b"],
        },
      ],
    };
  }, [data]);

  const costChart = useMemo(() => {
    if (!data) return null;

    return {
      labels: ["Payroll", "Overtime", "PF"],
      datasets: [
        {
          data: [
            data.cost.payroll,
            data.cost.overtime,
            data.cost.pf,
          ],
          backgroundColor: ["#2563eb", "#f97316", "#14b8a6"],
        },
      ],
    };
  }, [data]);

  useEffect(() => {
    const controller = new AbortController();

    const loadDashboard = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/dashboard`, {
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) throw new Error("Failed to load dashboard");

        const json = await res.json();
        setData(json);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
    return () => controller.abort();
  }, []);

  /* ✅ conditionals AFTER hooks */
  if (loading) return <div className="dash-loading">Loading dashboard…</div>;
  if (error) return <div className="dash-error">{error}</div>;
  if (!data) return <div className="dash-empty">No data</div>;

  const { employees, attendance, approvals, payroll, cost, compliance } = data;

  return (
  <div className="dashboard">

    {/* HERO SUMMARY */}
    <div className="dash-hero">
      <div>
        <h2>HR & Payroll Dashboard</h2>
        <span className="dash-sub">
          Live attendance, payroll & compliance overview
        </span>
      </div>

      <div className="hero-tags">
        <span className="tag success">
          Payroll {payroll ? "Running" : "Not Started"}
        </span>
        <span className="tag warn">
          {approvals.leave} Pending Actions
        </span>
      </div>
    </div>

    {/* KPI STRIP */}
    <div className="kpi-strip">

      <div className="kpi-card">
        <h4>Total Employees</h4>
        <div className="kpi-value">{employees.total}</div>
        <p className="kpi-meta">
          {employees.active} Active · {employees.inactive} Inactive
        </p>
        <Link to="employees" className="btn">
          Manage
        </Link>
      </div>

      <div className="kpi-card">
        <h4>Attendance Today</h4>
        <div className="kpi-value">{attendance.present}</div>
        <p className="kpi-meta">
          Absent {attendance.absent} · Late {attendance.late}
        </p>
        <Link to="attendance" className="btn">
          View
        </Link>
      </div>

      <div className="kpi-card warning">
        <h4>Pending Approvals</h4>
        <div className="kpi-value">{approvals.leave}</div>
        <p className="kpi-meta">Leave Requests</p>
        <Link to="leavemanagement" className="btn warning">
          Review
        </Link>
      </div>

    </div>

    {/* ANALYTICS */}
    <div className="dash-analytics">

      <div className="card">
        <h3>Attendance Distribution</h3>
        {attendanceChart && <Doughnut data={attendanceChart} />}
      </div>

      <div className="card">
        <h3>Cost Split</h3>
        {costChart && <Doughnut data={costChart} />}
      </div>

      <div className="card">
        <h3>Compliance Status</h3>
        <ul className="status-list">
          <li className={compliance.pfFiled ? "ok" : "warn"}>
            PF: {compliance.pfFiled ? "Filed" : "Pending"}
          </li>
          <li className="warn">ESI: Pending</li>
          <li className={compliance.gratuityEligible ? "ok" : "info"}>
            Gratuity: {compliance.gratuityEligible ? "Eligible" : "N/A"}
          </li>
        </ul>
      </div>

    </div>

  </div>
);

};

export default Dashboard;
