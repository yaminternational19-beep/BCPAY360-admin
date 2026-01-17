import React from "react";

const Dashboard = () => {
  return (
    <div className="sr-page">
      <div className="sr-header">
        <h1>Software Reports Dashboard</h1>
        <p>Overview of all available reports and forms</p>
      </div>

      <div className="sr-cards-grid">
        <div className="sr-card">
          <div className="sr-card-icon">📊</div>
          <h3>Personnel Files</h3>
          <p>Employee records and personnel information</p>
        </div>
        <div className="sr-card">
          <div className="sr-card-icon">📝</div>
          <h3>Attendance Reports</h3>
          <p>Attendance tracking and analysis</p>
        </div>
        <div className="sr-card">
          <div className="sr-card-icon">📅</div>
          <h3>Leave Reports</h3>
          <p>Leave management and tracking</p>
        </div>
        <div className="sr-card">
          <div className="sr-card-icon">💰</div>
          <h3>Salary Reports</h3>
          <p>Salary structures and payroll</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
