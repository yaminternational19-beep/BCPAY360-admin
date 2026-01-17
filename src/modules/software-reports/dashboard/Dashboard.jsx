import React from "react";

const Dashboard = () => {
  const stats = [
    { label: "Total Forms", value: "24", icon: "📋" },
    { label: "Active Reports", value: "12", icon: "📊" },
    { label: "Generated Files", value: "0", icon: "📁" },
    { label: "Pending Tasks", value: "0", icon: "⏳" },
  ];

  return (
    <div className="sr-page">
      <div className="sr-header">
        <h1>Software Reports Dashboard</h1>
        <p>Government compliance forms and reporting system</p>
      </div>

      <div className="sr-stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="sr-stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="sr-section">
        <h2>Quick Access</h2>
        <div className="sr-quick-links">
          <div className="quick-link">
            <span>📋 Government Forms</span>
            <p>PF, ESI, Factory Act & other compliance forms</p>
          </div>
          <div className="quick-link">
            <span>📊 Reports</span>
            <p>Employee, attendance, salary & statutory reports</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
