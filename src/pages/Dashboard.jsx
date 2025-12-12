import React from "react";
import "../styles/Dashboard.css";

const Dashboard = () => {
  // Dummy data (replace later with backend API)
  const stats = {
    totalEmployees: 42,
    presentToday: 37,
    leaveRequests: 5,
    salaryProcessed: "₹4,20,000",
    salaryPending: "₹55,000",
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard Overview</h2>

      <div className="stats-grid">

        <div className="stat-card">
          <h3>Total Employees</h3>
          <p>{stats.totalEmployees}</p>
        </div>

        <div className="stat-card">
          <h3>Present Today</h3>
          <p>{stats.presentToday}</p>
        </div>

        <div className="stat-card">
          <h3>Pending Leave Requests</h3>
          <p>{stats.leaveRequests}</p>
        </div>

        <div className="stat-card">
          <h3>Salary Processed</h3>
          <p>{stats.salaryProcessed}</p>
        </div>

        <div className="stat-card">
          <h3>Salary Pending</h3>
          <p>{stats.salaryPending}</p>
        </div>

      </div>

      <div className="chart-placeholder">
        <p>Attendance Summary (Weekly / Monthly Chart Here)</p>
      </div>
    </div>
  );
};

export default Dashboard;
