import React, { useState, useMemo } from "react";
import PageHeader from "../../../../components/ui/PageHeader";
import SummaryCards from "../../../../components/ui/SummaryCards";
import FiltersBar from "../../../../components/ui/FiltersBar";
import DataTable from "../../../../components/ui/DataTable";
import StatusBadge from "../../../../components/ui/StatusBadge";
import { FaUmbrellaBeach, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaSearch, FaFileInvoice } from "react-icons/fa";
import "../../../../styles/shared/modern-ui.css";

const LeaveReports = () => {
  const [filters, setFilters] = useState({
    search: "",
    year: new Date().getFullYear().toString(),
    leaveType: "",
    status: "",
  });

  const [showTable, setShowTable] = useState(false);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    setShowTable(true);
  };

  const mockReports = [
    {
      empCode: "EMP-001",
      name: "John Doe",
      leaveType: "Casual Leave",
      year: 2024,
      approved: 3,
      pending: 1,
      rejected: 0,
      balance: 6,
      status: "Active",
    },
    {
      empCode: "EMP-002",
      name: "Jane Smith",
      leaveType: "Sick Leave",
      year: 2024,
      approved: 2,
      pending: 0,
      rejected: 1,
      balance: 8,
      status: "Active",
    },
    {
      empCode: "EMP-003",
      name: "Mike Johnson",
      leaveType: "Earned Leave",
      year: 2024,
      approved: 5,
      pending: 2,
      rejected: 0,
      balance: 3,
      status: "Active",
    },
  ];

  const filteredReports = useMemo(() => {
    return mockReports.filter(r =>
      r.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      r.empCode.toLowerCase().includes(filters.search.toLowerCase())
    );
  }, [filters.search]);

  const stats = useMemo(() => {
    return [
      {
        label: "Total Approved",
        value: mockReports.reduce((a, b) => a + b.approved, 0),
        icon: <FaCheckCircle />,
        color: "green"
      },
      {
        label: "Total Pending",
        value: mockReports.reduce((a, b) => a + b.pending, 0),
        icon: <FaHourglassHalf />,
        color: "orange"
      },
      {
        label: "Total Rejected",
        value: mockReports.reduce((a, b) => a + b.rejected, 0),
        icon: <FaTimesCircle />,
        color: "blue"
      }
    ];
  }, []);

  const columns = [
    {
      header: "Emp Code",
      render: (r) => <span className="emp-code">{r.empCode}</span>
    },
    { header: "Name", key: "name" },
    { header: "Leave Type", key: "leaveType" },
    { header: "Approved", key: "approved" },
    { header: "Pending", key: "pending" },
    { header: "Rejected", key: "rejected" },
    { header: "Balance", key: "balance" },
    {
      header: "Status",
      render: (r) => (
        <StatusBadge
          type={r.status === "Active" ? "success" : "neutral"}
          label={r.status}
        />
      )
    }
  ];

  return (
    <div className="page-container fade-in">
      <PageHeader
        title="Leave Reports"
        subtitle="Manage employee leave balances, application history, and approval status."
        actions={
          <button className="btn-primary" onClick={handleApplyFilters}>
            Apply Filters
          </button>
        }
      />

      {showTable && <SummaryCards cards={stats} />}

      <FiltersBar
        search={filters.search}
        onSearchChange={(val) => handleFilterChange("search", val)}
      >
        <select
          name="leaveType"
          value={filters.leaveType}
          onChange={(e) => handleFilterChange("leaveType", e.target.value)}
          className="filter-select-modern"
        >
          <option value="">All Leave Types</option>
          <option value="Casual Leave">Casual Leave</option>
          <option value="Sick Leave">Sick Leave</option>
          <option value="Earned Leave">Earned Leave</option>
          <option value="Maternity Leave">Maternity Leave</option>
        </select>

        <select
          name="status"
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="filter-select-modern"
        >
          <option value="">All Status</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
        </select>

        <select
          name="year"
          value={filters.year}
          onChange={(e) => handleFilterChange("year", e.target.value)}
          className="filter-select-modern"
        >
          <option value="2024">2024</option>
          <option value="2025">2025</option>
        </select>
      </FiltersBar>

      <div className="table-section">
        <DataTable
          columns={columns}
          data={showTable ? filteredReports : []}
          emptyState={{
            title: "No leave records found",
            subtitle: "Try searching for a specific employee code or change filters.",
            icon: <FaUmbrellaBeach />
          }}
        />
      </div>
    </div>
  );
};

export default LeaveReports;
