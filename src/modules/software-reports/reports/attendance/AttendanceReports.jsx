import React, { useState, useMemo } from "react";
import PageHeader from "../../../../components/ui/PageHeader";
import SummaryCards from "../../../../components/ui/SummaryCards";
import FiltersBar from "../../../../components/ui/FiltersBar";
import DataTable from "../../../../components/ui/DataTable";
import StatusBadge from "../../../../components/ui/StatusBadge";
import { FaClock, FaCheckCircle, FaTimesCircle, FaChartPie, FaCalendarAlt, FaSearch } from "react-icons/fa";
import "../../../../styles/shared/modern-ui.css";

const AttendanceReports = () => {
  const [filters, setFilters] = useState({
    search: "",
    branch: "",
    department: "",
    month: "January",
    year: new Date().getFullYear().toString(),
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
      branch: "Head Office",
      present: 22,
      absent: 2,
      halfDay: 1,
      leaves: 4,
      percentage: 92,
    },
    {
      empCode: "EMP-002",
      name: "Jane Smith",
      branch: "Branch A",
      present: 24,
      absent: 0,
      halfDay: 1,
      leaves: 2,
      percentage: 96,
    },
    {
      empCode: "EMP-003",
      name: "Mike Johnson",
      branch: "Branch B",
      present: 20,
      absent: 3,
      halfDay: 2,
      leaves: 2,
      percentage: 87,
    },
  ];

  const filteredReports = useMemo(() => {
    return mockReports.filter(r =>
      r.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      r.empCode.toLowerCase().includes(filters.search.toLowerCase())
    );
  }, [filters.search]);

  const stats = useMemo(() => {
    const avg = Math.round(mockReports.reduce((a, b) => a + b.percentage, 0) / mockReports.length);
    return [
      {
        label: "Average Attendance",
        value: `${avg}%`,
        icon: <FaChartPie />,
        color: "blue"
      },
      {
        label: "Total Present Days",
        value: mockReports.reduce((a, b) => a + b.present, 0),
        icon: <FaCheckCircle />,
        color: "green"
      },
      {
        label: "Total Absences",
        value: mockReports.reduce((a, b) => a + b.absent, 0),
        icon: <FaTimesCircle />,
        color: "orange"
      }
    ];
  }, []);

  const columns = [
    {
      header: "Emp Code",
      render: (r) => <span className="emp-code">{r.empCode}</span>
    },
    { header: "Name", key: "name" },
    { header: "Branch", key: "branch" },
    { header: "Present", key: "present" },
    { header: "Absent", key: "absent" },
    { header: "Half Day", key: "halfDay" },
    { header: "Leaves", key: "leaves" },
    {
      header: "Attendance %",
      render: (r) => (
        <StatusBadge
          type={r.percentage > 90 ? "success" : r.percentage > 80 ? "info" : "warning"}
          label={`${r.percentage}%`}
        />
      )
    }
  ];

  return (
    <div className="page-container fade-in">
      <PageHeader
        title="Attendance Reports"
        subtitle="Track employee attendance statistics, present days, and leave balances."
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
          name="branch"
          value={filters.branch}
          onChange={(e) => handleFilterChange("branch", e.target.value)}
          className="filter-select-modern"
        >
          <option value="">All Branches</option>
          <option value="Head Office">Head Office</option>
          <option value="Branch A">Branch A</option>
          <option value="Branch B">Branch B</option>
        </select>

        <select
          name="department"
          value={filters.department}
          onChange={(e) => handleFilterChange("department", e.target.value)}
          className="filter-select-modern"
        >
          <option value="">All Departments</option>
          <option value="HR">HR</option>
          <option value="Finance">Finance</option>
          <option value="Operations">Operations</option>
        </select>

        <select
          name="month"
          value={filters.month}
          onChange={(e) => handleFilterChange("month", e.target.value)}
          className="filter-select-modern"
        >
          {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
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
            title: "Performance data not loaded",
            subtitle: "Select filters and apply to view attendance analysis.",
            icon: <FaCalendarAlt />
          }}
        />
      </div>
    </div>
  );
};

export default AttendanceReports;
