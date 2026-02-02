import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Dashboard.css";
import { API_BASE } from "../utils/apiBase";

import {
  FaUsers,
  FaCalendarCheck,
  FaMoneyCheckAlt,
  FaArrowRight,
  FaClipboardList,
  FaUserFriends,
  FaFileContract,
  FaBuilding,
  FaSitemap,
  FaUmbrellaBeach,
  FaFileAlt,
  FaChartPie,
  FaCog
} from "react-icons/fa";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const PERIODS = ["TODAY", "WEEK", "MONTH", "YEAR"];

const Dashboard = () => {
  const [period, setPeriod] = useState("TODAY");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ===============================
     LOAD DASHBOARD
  =============================== */
  useEffect(() => {
    const controller = new AbortController();

    const loadDashboard = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${API_BASE}/api/dashboard?period=${period}`,
          {
            signal: controller.signal,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

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
  }, [period]);

  /* ===============================
     SAFE DERIVED DATA
  =============================== */
  const employeesBranches = data?.employees?.branches ?? [];
  const attendanceBranches = data?.attendance?.branches ?? [];

  /* ===============================
     CHART DATA
  =============================== */
  const attendanceChart = useMemo(() => {
    if (!attendanceBranches.length) return null;

    return {
      labels: attendanceBranches.map(b => b.branch_name),
      datasets: [
        {
          label: "Present",
          data: attendanceBranches.map(b => b.present ?? 0),
          backgroundColor: "rgba(16, 185, 129, 0.8)",
          borderRadius: 8,
        },
        {
          label: "Absent",
          data: attendanceBranches.map(b => b.absent ?? 0),
          backgroundColor: "rgba(239, 68, 68, 0.8)",
          borderRadius: 8,
        },
        {
          label: "Unmarked",
          data: attendanceBranches.map(b => b.unmarked ?? 0),
          backgroundColor: "rgba(148, 163, 184, 0.8)",
          borderRadius: 8,
        },
      ],
    };
  }, [attendanceBranches]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { font: { size: 12, weight: "600" } },
      },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  if (loading) return <div className="dash-loading">Loading dashboard…</div>;
  if (error) return <div className="dash-error">{error}</div>;
  if (!data) return null;

  const {
    company,
    logged_in,
    employees,
    attendance,
    leave_pending,
    salary
  } = data;

  /* ===============================
     RENDER
  =============================== */
  return (
    <div className="dashboard">

      {/* HEADER */}
      <div className="dash-header">
        <div>
          <h2>{company?.name}</h2>
          <span className="dash-sub">
            Logged in as <strong>{logged_in?.role}</strong>
          </span>
        </div>

        <div className="dash-period-toggle">
          {PERIODS.map(p => (
            <button
              key={p}
              className={period === p ? "active" : ""}
              onClick={() => setPeriod(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI ROW */}
      <div className="kpi-row">

        <div className="kpi-card">
          <h4>Total Employees</h4>
          <div className="metric-box">
            <span className="metric-value">
              {employees?.company_total?.total ?? 0}
            </span>
          </div>
          <p className="metric-sub">
            Active: {employees?.company_total?.active ?? 0} ·
            Inactive: {employees?.company_total?.inactive ?? 0}
          </p>
          <Link to="/employees" className="btn-go">
            View Employees <FaArrowRight />
          </Link>
        </div>

        <div className="kpi-card">
          <h4>Attendance</h4>
          <div className="metric-box">
            <span className="metric-value">
              {attendance?.company_total?.present ?? 0}
            </span>
          </div>
          <p className="metric-sub">
            Absent: {attendance?.company_total?.absent ?? 0} ·
            Unmarked: {attendance?.company_total?.unmarked ?? 0}
          </p>
          <Link to="/attendance" className="btn-go">
            Attendance <FaArrowRight />
          </Link>
        </div>

        <div className="kpi-card">
          <h4>Pending Leaves</h4>
          <div className="metric-box">
            <span className="metric-value">
              {leave_pending?.company_total ?? 0}
            </span>
          </div>
          <Link to="/leavemanagement" className="btn-go">
            Review <FaArrowRight />
          </Link>
        </div>

        <div className="kpi-card">
          <h4>Salary Payout</h4>
          <div className="metric-box">
            <span className="metric-value">
              ₹ {(salary?.company_total?.total_salary ?? 0).toLocaleString()}
            </span>
          </div>
          <p className="metric-sub">
            Employees Paid: {salary?.company_total?.employees_paid ?? 0}
          </p>
          <Link to="/payroll" className="btn-go">
            Payroll <FaArrowRight />
          </Link>
        </div>



      </div>

      {/* ORGANIZATION OVERVIEW */}
      <div className="org-overview-row">
        <Link to="/branches" className="org-card">
          <div className="org-icon branch"><FaBuilding /></div>
          <div className="org-info">
            <h4>Total Branches</h4>
            <span className="org-value">{data?.employees?.branches?.length || 0}</span>
          </div>
        </Link>
        <Link to="/departments" className="org-card">
          <div className="org-icon dept"><FaSitemap /></div>
          <div className="org-info">
            <h4>Departments</h4>
            <span className="org-value">{data?.employees?.branches?.departments?.length || 0}</span>
          </div>
        </Link>
        <Link to="/hr-management" className="org-card hr-card-accent">
          <div className="org-icon hr"><FaUserFriends /></div>
          <div className="org-info">
            <h4>HR Management</h4>
            <span className="org-value">HR Team</span>
          </div>
        </Link>
      </div>

      {/* BRANCH TABLE & CHART ROW */}
      <div className="dashboard-grid-row">
        {/* BRANCH TABLE */}
        <div className="board-card">
          <h3>Branch Overview</h3>
          <table className="branch-table">
            <thead>
              <tr>
                <th>Branch</th>
                <th>Employees</th>
                <th>Present</th>
                <th>Salary (₹)</th>
              </tr>
            </thead>
            <tbody>
              {employeesBranches.map((b) => {
                const attendanceRow =
                  attendanceBranches.find(a => a.branch_id === b.branch_id) || {};

                return (
                  <tr key={b.branch_id}>
                    <td>{b.branch_name}</td>
                    <td>{b.total ?? 0}</td>
                    <td>{attendanceRow.present ?? 0}</td>
                    <td>
                      ₹ {(salary?.company_total?.total_salary ?? 0).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* CHART */}
        <div className="analytics-card">
          <div className="chart-header">
            <h3>Attendance Distribution</h3>
            <span>{period}</span>
          </div>
          <div className="chart-container-inner">
            {attendanceChart && (
              <Bar data={attendanceChart} options={chartOptions} />
            )}
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="dash-quick-access">
        <h3 className="section-title">Quick Access</h3>
        <div className="dash-footer-upgraded">
          <Link to="/employees" className="dash-action-card-mini employees">
            <div className="action-icon-mini"><FaUserFriends /></div>
            <span>Employees</span>
          </Link>
          <Link to="/holidays" className="dash-action-card-mini holidays">
            <div className="action-icon-mini"><FaUmbrellaBeach /></div>
            <span>Holidays</span>
          </Link>
          <Link to="/payroll" className="dash-action-card-mini payroll">
            <div className="action-icon-mini"><FaMoneyCheckAlt /></div>
            <span>Payroll</span>
          </Link>
          <Link to="/reports/employee" className="dash-action-card-mini reports">
            <div className="action-icon-mini"><FaFileAlt /></div>
            <span>Employee Report</span>
          </Link>
          <Link to="/reports/salary" className="dash-action-card-mini salary-reports">
            <div className="action-icon-mini"><FaChartPie /></div>
            <span>Salary Reports</span>
          </Link>
          <Link to="/manage-content" className="dash-action-card-mini settings">
            <div className="action-icon-mini"><FaCog /></div>
            <span>Settings</span>
          </Link>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
