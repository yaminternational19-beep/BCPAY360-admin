import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Dashboard.css";
import { API_BASE } from "../utils/apiBase";
import {
  FaUsers,
  FaCalendarCheck,
  FaCheckCircle,
  FaMoneyCheckAlt,
  FaArrowRight,
  FaShieldAlt,
  FaFileInvoiceDollar,
  FaChartBar,
  FaUserFriends,
  FaClipboardList,
  FaFileContract
} from "react-icons/fa";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

        if (!res.ok) throw new Error("Failed to load dashboard from server");

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

  const trendChart = useMemo(() => {
    if (!data) return null;

    // Static trend labels as per reference request
    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    return {
      labels,
      datasets: [
        {
          label: "Present",
          data: [150, 180, 160, 215, 190, 80, 20],
          backgroundColor: "#3b82f6",
          borderRadius: 6,
        },
        {
          label: "Absent",
          data: [10, 5, 8, 18, 5, 2, 0],
          backgroundColor: "#f97316",
          borderRadius: 6,
        },
        {
          label: "Late",
          data: [5, 2, 4, 6, 8, 1, 0],
          backgroundColor: "#10b981",
          borderRadius: 6,
        },
        {
          label: "Leave",
          data: [2, 1, 3, 5, 4, 0, 0],
          backgroundColor: "#6366f1",
          borderRadius: 6,
        },
      ],
    };
  }, [data]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom", labels: { usePointStyle: true, padding: 20, font: { weight: '600' } } },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "#f1f5f9" }, ticks: { callback: (v) => `${v >= 1000 ? v / 1000 + "k" : v}` } },
    },
  };

  if (loading) return <div className="dash-loading">Initializing System Dashboard...</div>;
  if (error) return <div className="dash-error">Error: {error}</div>;
  if (!data) return <div className="dash-empty">No dashboard telemetry available.</div>;

  const { employees, attendance, approvals, payroll, cost, compliance } = data;

  return (
    <div className="dashboard">

      {/* KPI ROW */}
      <div className="kpi-row">
        <div className="kpi-card">
          <h4>Total Employees</h4>
          <div className="metric-box">
            <span className="metric-value">{employees.total}</span>
            <span className={`status-indicator success`}>{employees.inactive} Inactive</span>
          </div>
          <Link to="employees" className="btn-go">
            View All <FaArrowRight />
          </Link>
        </div>

        <div className="kpi-card">
          <h4>Today's Attendance</h4>
          <div className="metric-box" style={{ background: "#eff6ff" }}>
            <div className="multi-stat">
              <p className="metric-sub">Present: <strong>{attendance.present}</strong></p>
              <p className="metric-sub">Absent: <strong>{attendance.absent}</strong></p>
              <p className="metric-sub">Late: <strong>{attendance.late}</strong> OT: <strong>{attendance.overtime}</strong></p>
            </div>
          </div>
          <Link to="attendance" className="btn-go">
            View Details <FaArrowRight />
          </Link>
        </div>

        <div className="kpi-card">
          <h4>Pending Approvals</h4>
          <div className="metric-box" style={{ background: "#fff7ed" }}>
            <div className="multi-stat">
              <p className="metric-sub">Leaves: <strong>{approvals.leave}</strong></p>
              <p className="metric-sub">F&F: <strong>2</strong></p>
            </div>
          </div>
          <Link to="leavemanagement" className="btn-go" style={{ background: "#f97316" }}>
            Review <FaArrowRight />
          </Link>
        </div>

        <div className="kpi-card">
          <h4>Salary Process</h4>
          <div className="status-indicator running">Running</div>
          <Link to="payroll" className="btn-go">
            View Status <FaArrowRight />
          </Link>
        </div>
      </div>

      {/* DATA BOARDS */}
      <div className="dash-row-grid">
        <div className="board-card">
          <div className="board-header">
            <h3>Compliance Alerts</h3>
            <div style={{ display: "flex", gap: "8px" }}>
              <span className="dot" style={{ background: "#cbd5e1", width: "8px", height: "8px", borderRadius: "50%" }}></span>
              <span className="dot" style={{ background: "#cbd5e1", width: "8px", height: "8px", borderRadius: "50%" }}></span>
              <span className="dot" style={{ background: "#cbd5e1", width: "8px", height: "8px", borderRadius: "50%" }}></span>
            </div>
          </div>
          <div className="compliance-grid">
            <div className="alert-item due">
              <span className="status-dot dot-red"></span> ESI Due
            </div>
            <div className="alert-item info">
              <span className="status-dot dot-orange"></span> PF Pending
            </div>
            <div className="alert-item pending">
              <span className="status-dot dot-green"></span> PF Pending
            </div>
            <div className="alert-item info">
              <span className="status-dot dot-orange"></span> Bonus Calculation
            </div>
            <div className="alert-item pending">
              <span className="status-dot dot-green"></span> Bonus Calculation
            </div>
            <div className="alert-item pending">
              <span className="status-dot dot-green"></span> Gratuity Reminder
            </div>
          </div>
        </div>

        <div className="board-card">
          <div className="board-header">
            <h3>Monthly Cost Summary</h3>
            <div style={{ display: "flex", gap: "8px" }}>
              <span className="dot" style={{ background: "#cbd5e1", width: "8px", height: "8px", borderRadius: "50%" }}></span>
              <span className="dot" style={{ background: "#cbd5e1", width: "8px", height: "8px", borderRadius: "50%" }}></span>
              <span className="dot" style={{ background: "#cbd5e1", width: "8px", height: "8px", borderRadius: "50%" }}></span>
            </div>
          </div>
          <div className="cost-summary">
            <div className="cost-item">
              <span className="cost-label">Total Payroll</span>
              <span className="cost-value">₹ {(cost.payroll / 100000).toFixed(2)} L</span>
            </div>
            <div className="cost-item">
              <span className="cost-label">Overtime Cost</span>
              <span className="cost-value">₹ {cost.overtime.toLocaleString()}</span>
            </div>
            <div className="cost-item">
              <span className="cost-label">ESI / PF Cost</span>
              <span className="cost-value">₹ {cost.pf.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ANALYTICS CHART */}
      <div className="analytics-card">
        <div className="chart-header">
          <h3>Attendance & Leave Reports</h3>
          <span>Last 7 Days</span>
        </div>
        <div style={{ height: "300px", position: "relative" }}>
          {trendChart && <Bar data={trendChart} options={chartOptions} />}
        </div>
      </div>

      {/* QUICK ACTION FOOTER */}
      <div className="dash-footer">
        <Link to="payroll" className="action-btn primary">
          <div className="icon-wrap">
            <FaMoneyCheckAlt /> Generate Payroll
          </div>
          <FaArrowRight fontSize={12} />
        </Link>
        <Link to="employees" className="action-btn">
          <div className="icon-wrap">
            <FaUserFriends style={{ color: "#2563eb" }} /> Employee List
          </div>
          <FaArrowRight fontSize={12} style={{ color: "#cbd5e1" }} />
        </Link>
        <Link to="attendance" className="action-btn">
          <div className="icon-wrap">
            <FaClipboardList style={{ color: "#10b981" }} /> Attendance Reports
          </div>
          <FaArrowRight fontSize={12} style={{ color: "#cbd5e1" }} />
        </Link>
        <Link to="complianceforms" className="action-btn">
          <div className="icon-wrap">
            <FaFileContract style={{ color: "#6366f1" }} /> Statutory Forms
          </div>
          <FaArrowRight fontSize={12} style={{ color: "#cbd5e1" }} />
        </Link>
      </div>

    </div>
  );
};

export default Dashboard;
