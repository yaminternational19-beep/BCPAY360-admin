import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Dashboard.css";
import { API_BASE } from "../utils/apiBase";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/dashboard`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setDashboard(data.kpis);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="dash-loading">Loading dashboard…</div>;
  if (!dashboard) return <div className="dash-loading">No data available</div>;

  /* ===========================
     CHART DATA
  =========================== */

  const attendanceChart = {
    labels: ["Present", "Absent", "Late", "On Leave"],
    datasets: [
      {
        data: [
          dashboard.attendance.present,
          dashboard.attendance.absent,
          dashboard.attendance.late,
          dashboard.approvals.leave,
        ],
        backgroundColor: ["#22c55e", "#ef4444", "#f59e0b", "#6366f1"],
      },
    ],
  };

  const costChart = {
    labels: ["Payroll", "Overtime", "PF"],
    datasets: [
      {
        data: [
          dashboard.cost.payroll,
          dashboard.cost.overtime,
          dashboard.cost.esiPf,
        ],
        backgroundColor: ["#2563eb", "#f97316", "#14b8a6"],
      },
    ],
  };

  return (
    <div className="dashboard">

      {/* HEADER */}
      <div className="dash-header">
        <h2>HR & Payroll Dashboard</h2>
        <span className="dash-sub">
          Live company metrics & compliance status
        </span>
      </div>

      {/* KPI STRIP */}
      <div className="kpi-strip">

        <div className="kpi-card">
          <h4>Total Employees</h4>
          <div className="kpi-value">{dashboard.employees.total}</div>
          <p className="kpi-meta">
            {dashboard.employees.inactive} inactive
          </p>
          <Link to="employees" className="btn">
            Manage Employees
          </Link>
        </div>

        <div className="kpi-card">
          <h4>Attendance Today</h4>
          <div className="kpi-value">
            {dashboard.attendance.present}
          </div>
          <p className="kpi-meta">
            Absent {dashboard.attendance.absent} · Late {dashboard.attendance.late}
          </p>
          <Link to="attendance" className="btn">
            View Attendance
          </Link>
        </div>

        <div className="kpi-card warning">
          <h4>Pending Approvals</h4>
          <div className="kpi-value">
            {dashboard.approvals.leave + dashboard.approvals.fnf}
          </div>
          <p className="kpi-meta">
            Leaves {dashboard.approvals.leave} · FNF {dashboard.approvals.fnf}
          </p>
          <Link to="leavemanagement" className="btn warning">
            Review Requests
          </Link>
        </div>

        <div className="kpi-card success">
          <h4>Payroll Status</h4>
          <div className="kpi-value small">
            {dashboard.salary.status}
          </div>
          <p className="kpi-meta">
            Month: {dashboard.salary.month || "N/A"}
          </p>
          <Link to="payroll" className="btn success">
            Payroll
          </Link>
        </div>

      </div>

      {/* ANALYTICS */}
      <div className="dash-analytics">

        <div className="card">
          <h3>Attendance Distribution</h3>
          <Doughnut data={attendanceChart} />
        </div>

        <div className="card">
          <h3>Monthly Cost Split</h3>
          <Doughnut data={costChart} />
        </div>

        <div className="card">
          <h3>Compliance Status</h3>
          <ul className="status-list">
            <li className="ok">PF: {dashboard.compliance.pf}</li>
            <li className="warn">ESI: {dashboard.compliance.esi}</li>
            <li className="info">Bonus: {dashboard.compliance.bonus}</li>
            <li className="ok">Gratuity: OK</li>
          </ul>
        </div>

      </div>

      {/* ACTION BAR */}
      <div className="dash-actions">
        <Link to="payroll" className="btn">Run Payroll</Link>
        <Link to="reports" className="btn">Reports</Link>
        <Link to="attendance" className="btn">Attendance</Link>
      </div>

    </div>
  );
};

export default Dashboard;
