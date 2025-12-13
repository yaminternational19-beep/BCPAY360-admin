import React, { useMemo } from "react";
import "../styles/Dashboard.css";

/* =======================
   Charts
======================= */
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

import { makeEmployees } from "../utils/mockData.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

/* =======================
   CONSTANTS
======================= */
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const WORKING_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const DEPARTMENTS = ["HR","Finance","IT","Sales","Operations","Marketing","Support"];

/* =======================
   ATTENDANCE ENGINE
======================= */
function generateAttendance(employees) {
  const weekly = {};
  const deptWise = {};
  const heatmap = {};
  const lateArrivals = {};

  DAYS.forEach(d => {
    weekly[d] = 0;
    heatmap[d] = {};
    DEPARTMENTS.forEach(dep => (heatmap[d][dep] = 0));
  });

  DEPARTMENTS.forEach(dep => {
    deptWise[dep] = 0;
    lateArrivals[dep] = 0;
  });

  employees.forEach(emp => {
    DAYS.forEach(day => {
      if (!WORKING_DAYS.includes(day)) return;

      const present = Math.random() < 0.9;
      if (!present) return;

      weekly[day]++;
      deptWise[emp.department]++;
      heatmap[day][emp.department]++;

      const arrivalMinutes = Math.floor(Math.random() * 90) + 540; // 9:00–10:30
      if (arrivalMinutes > 615) lateArrivals[emp.department]++;
    });
  });

  return { weekly, deptWise, heatmap, lateArrivals };
}

/* =======================
   DASHBOARD
======================= */
const Dashboard = () => {
  const employees = useMemo(() => makeEmployees(1000), []);
  const attendance = useMemo(
    () => generateAttendance(employees),
    [employees]
  );

  /* =======================
     KPIs
  ======================= */
  const totalSalary = employees.reduce((s, e) => s + e.salary, 0);
  const processedSalary = Math.floor(totalSalary * 0.85);
  const pendingSalary = totalSalary - processedSalary;

  const today = new Date().getDay();
  const todayKey = DAYS[today === 0 ? 6 : today - 1];

  const presentToday = WORKING_DAYS.includes(todayKey)
    ? attendance.weekly[todayKey]
    : 0;

  const absentToday = employees.length - presentToday;
  const onLeave = Math.floor(employees.length * 0.05);

  /* =======================
     CHARTS
  ======================= */
  const weeklyChart = {
    labels: DAYS,
    datasets: [{
      label: "Attendance",
      data: DAYS.map(d => attendance.weekly[d]),
      backgroundColor: "#38bdf8",
      borderRadius: 10,
    }],
  };

  const deptChart = {
    labels: DEPARTMENTS,
    datasets: [{
      label: "Department Attendance",
      data: DEPARTMENTS.map(d => attendance.deptWise[d]),
      backgroundColor: "#22c55e",
      borderRadius: 10,
    }],
  };

  const lateChart = {
    labels: DEPARTMENTS,
    datasets: [{
      label: "Late Arrivals",
      data: DEPARTMENTS.map(d => attendance.lateArrivals[d]),
      backgroundColor: "#facc15",
      borderRadius: 10,
    }],
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">HR Dashboard</h2>

      {/* ================= KPI GRID (8 BOXES) ================= */}
      <div className="stats-grid four-col">
        <KPI title="Total Employees" value={employees.length} />
        <KPI title="Present Today" value={presentToday} />
        <KPI title="Absent Today" value={absentToday} />
        <KPI title="On Leave" value={onLeave} />

        <KPI title="Total Salary" value={`₹${totalSalary.toLocaleString()}`} />
        <KPI title="Salary Processed" value={`₹${processedSalary.toLocaleString()}`} type="success" />
        <KPI title="Salary Pending" value={`₹${pendingSalary.toLocaleString()}`} type="warning" />
        <KPI title="Departments" value={DEPARTMENTS.length} />
      </div>

      {/* ================= SPLIT SECTION ================= */}
      <div className="split-section">
        {/* LEFT – ATTENDANCE */}
        <section className="chart-section">
          <h3>Weekly Attendance (Mon–Sun)</h3>
          <Bar data={weeklyChart} />
        </section>

        {/* RIGHT – ARRIVAL TIMINGS */}
        <section className="chart-section">
          <h3>Late Arrivals by Department</h3>
          <Bar data={lateChart} />
        </section>
      </div>

      {/* ================= DEPARTMENT + HEATMAP ================= */}
      <div className="split-section">
        <section className="chart-section">
          <h3>Department-wise Attendance</h3>
          <Bar data={deptChart} />
        </section>

        <section className="chart-section heatmap">
          <h3>Attendance Heatmap</h3>
          {DAYS.map(day => (
            <div key={day} className="heatmap-row">
              <span>{day}</span>
              {DEPARTMENTS.map(dep => (
                <div
                  key={dep}
                  className="heatmap-cell"
                  style={{
                    opacity:
                      attendance.heatmap[day][dep] /
                      employees.length
                  }}
                />
              ))}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

/* =======================
   KPI
======================= */
const KPI = ({ title, value, type }) => (
  <div className={`stat-card ${type || ""}`}>
    <h3>{title}</h3>
    <p>{value}</p>
  </div>
);

export default Dashboard;
