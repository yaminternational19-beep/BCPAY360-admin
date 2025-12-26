import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import { API_BASE } from "../utils/apiBase";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const navigate = useNavigate();
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

  if (loading) return <p style={{ padding: 20 }}>Loading dashboard...</p>;
  if (!dashboard) return <p style={{ padding: 20 }}>No data available</p>;

  const chartData = {
    labels: ["Present", "Absent", "Late", "Leave"],
    datasets: [
      {
        data: [
          dashboard.attendance.present,
          dashboard.attendance.absent,
          dashboard.attendance.late,
          dashboard.approvals.leave,
        ],
        backgroundColor: ["#2563eb", "#ef4444", "#f59e0b", "#22c55e"],
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="dash-wrap">
      <h2 className="dash-title">HR & Payroll Dashboard</h2>

      {/* KPI ROW */}
      <div className="dash-kpis">
        <div className="kpi-card">
          <h4>Total Employees</h4>
          <div className="kpi-main">{dashboard.employees.total}</div>
          <span className="kpi-sub">
            {dashboard.employees.inactive} Inactive
          </span>
          <button onClick={() => navigate("/admin/employees")}>
            View All
          </button>
        </div>

        <div className="kpi-card">
          <h4>Today's Attendance</h4>
          <div className="kpi-line">
            Present: {dashboard.attendance.present}
          </div>
          <div className="kpi-sub">
            Absent: {dashboard.attendance.absent} | Late:{" "}
            {dashboard.attendance.late} | OT: {dashboard.attendance.ot}
          </div>
          <button onClick={() => navigate("/admin/attendance")}>
            View Details
          </button>
        </div>

        <div className="kpi-card warning">
          <h4>Pending Approvals</h4>
          <div className="kpi-line">
            Leaves: {dashboard.approvals.leave}
          </div>
          <div className="kpi-sub">
            F&F: {dashboard.approvals.fnf}
          </div>
          <button className="orange">Review</button>
        </div>

        <div className="kpi-card success">
          <h4>Salary Process</h4>
          <div className="kpi-main green">
            {dashboard.salary.status}
          </div>
          <button onClick={() => navigate("/admin/payroll")}>
            View Status
          </button>
        </div>
      </div>

      {/* MIDDLE */}
      <div className="dash-grid-2">
        <div className="card">
          <h3>Compliance Alerts</h3>
          <ul className="alerts">
            <li className="alert red">ESI Due</li>
            <li className="alert amber">PF Pending</li>
            <li className="alert blue">Bonus Calculation</li>
            <li className="alert green">Gratuity Reminder</li>
          </ul>
        </div>

        <div className="card">
          <h3>Monthly Cost Summary</h3>
          <div className="cost-row">
            <span>Total Payroll</span>
            <b>₹ {dashboard.cost.payroll}</b>
          </div>
          <div className="cost-row">
            <span>Overtime Cost</span>
            <b>₹ {dashboard.cost.overtime}</b>
          </div>
          <div className="cost-row">
            <span>ESI / PF Cost</span>
            <b>₹ {dashboard.cost.esiPf}</b>
          </div>
        </div>
      </div>

      {/* CHART */}
      <div className="card full">
        <h3>Attendance & Leave Reports</h3>
        <Bar data={chartData} />
      </div>

      {/* ACTIONS */}
      <div className="dash-actions">
        <button onClick={() => navigate("/admin/payroll")}>
          Generate Payroll
        </button>
        <button onClick={() => navigate("/admin/employees")}>
          Employee List
        </button>
        <button onClick={() => navigate("/admin/attendance")}>
          Attendance Reports
        </button>
        <button onClick={() => navigate("/admin/reports")}>
          Statutory Forms
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
