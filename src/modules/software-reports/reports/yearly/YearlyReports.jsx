import React, { useState, useMemo } from "react";
import PageHeader from "../../../../components/ui/PageHeader";
import SummaryCards from "../../../../components/ui/SummaryCards";
import FiltersBar from "../../../../components/ui/FiltersBar";
import DataTable from "../../../../components/ui/DataTable";
import StatusBadge from "../../../../components/ui/StatusBadge";
import { FaCalendarCheck, FaLayerGroup, FaCoins, FaSearch, FaHistory } from "react-icons/fa";
import "../../../../styles/shared/modern-ui.css";

const YearlyReports = () => {
  const [filters, setFilters] = useState({
    search: "",
    year: new Date().getFullYear().toString(),
    reportType: "Annual Summary",
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
      totalSalary: 660000,
      totalAttendance: 264,
      totalLeaves: 10,
      totalDeduction: 60000,
      yearlySummary: "Completed",
    },
    {
      empCode: "EMP-002",
      name: "Jane Smith",
      totalSalary: 582000,
      totalAttendance: 270,
      totalLeaves: 5,
      totalDeduction: 54000,
      yearlySummary: "Completed",
    },
    {
      empCode: "EMP-003",
      name: "Mike Johnson",
      totalSalary: 732000,
      totalAttendance: 261,
      totalLeaves: 14,
      totalDeduction: 72000,
      yearlySummary: "Completed",
    },
  ];

  const filteredReports = useMemo(() => {
    return mockReports.filter(r =>
      r.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      r.empCode.toLowerCase().includes(filters.search.toLowerCase())
    );
  }, [filters.search]);

  const stats = useMemo(() => {
    const totalPayroll = mockReports.reduce((a, b) => a + b.totalSalary, 0);
    const avgAttendance = Math.round(mockReports.reduce((a, b) => a + b.totalAttendance, 0) / mockReports.length);
    return [
      {
        label: "Annual Payroll",
        value: `₹${totalPayroll.toLocaleString()}`,
        icon: <FaCoins />,
        color: "green"
      },
      {
        label: "Avg Attendance",
        value: `${avgAttendance} Days`,
        icon: <FaCalendarCheck />,
        color: "blue"
      },
      {
        label: "Total Employees",
        value: mockReports.length,
        icon: <FaLayerGroup />,
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
    {
      header: "Total Salary",
      className: "font-semibold",
      render: (r) => `₹${r.totalSalary.toLocaleString()}`
    },
    { header: "Attendance Days", key: "totalAttendance" },
    { header: "Total Leaves", key: "totalLeaves" },
    {
      header: "Deductions",
      render: (r) => `₹${r.totalDeduction.toLocaleString()}`
    },
    {
      header: "Status",
      render: (r) => (
        <StatusBadge
          type="success"
          label={r.yearlySummary}
        />
      )
    }
  ];

  return (
    <div className="page-container fade-in">
      <PageHeader
        title="Yearly Reports"
        subtitle="Annual performance summaries, salary increments, and attendance reviews."
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
          name="reportType"
          value={filters.reportType}
          onChange={(e) => handleFilterChange("reportType", e.target.value)}
          className="filter-select-modern"
        >
          <option value="Annual Summary">Annual Summary</option>
          <option value="Employee Summary">Employee Summary</option>
          <option value="Department Summary">Department Summary</option>
          <option value="Financial Summary">Financial Summary</option>
        </select>

        <select
          name="year"
          value={filters.year}
          onChange={(e) => handleFilterChange("year", e.target.value)}
          className="filter-select-modern"
        >
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
        </select>
      </FiltersBar>

      <div className="table-section">
        <DataTable
          columns={columns}
          data={showTable ? filteredReports : []}
          emptyState={{
            title: "Yearly data not aggregated",
            subtitle: "Select a fiscal year to view consolidated employee reports.",
            icon: <FaHistory />
          }}
        />
      </div>
    </div>
  );
};

export default YearlyReports;
