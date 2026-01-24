import React, { useState, useMemo } from "react";
import PageHeader from "../../../../components/ui/PageHeader";
import SummaryCards from "../../../../components/ui/SummaryCards";
import FiltersBar from "../../../../components/ui/FiltersBar";
import DataTable from "../../../../components/ui/DataTable";
import { FaShieldAlt, FaPiggyBank, FaHandHoldingHeart, FaSearch } from "react-icons/fa";
import "../../../../styles/shared/modern-ui.css";

const StatutoryReports = () => {
  const [filters, setFilters] = useState({
    search: "",
    reportType: "PF",
    month: "January",
    year: new Date().getFullYear().toString(),
    branch: "",
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
      reportType: "PF",
      empContribution: 1800,
      companyContribution: 1800,
      totalContribution: 3600,
    },
    {
      empCode: "EMP-002",
      name: "Jane Smith",
      reportType: "ESI",
      empContribution: 75,
      companyContribution: 325,
      totalContribution: 400,
    },
    {
      empCode: "EMP-003",
      name: "Mike Johnson",
      reportType: "Gratuity",
      empContribution: 0,
      companyContribution: 45000,
      totalContribution: 45000,
    },
  ];

  const filteredReports = useMemo(() => {
    return mockReports.filter(r =>
      (r.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        r.empCode.toLowerCase().includes(filters.search.toLowerCase())) &&
      (filters.reportType === "All" || r.reportType === filters.reportType)
    );
  }, [filters.search, filters.reportType]);

  const stats = useMemo(() => {
    return [
      {
        label: "Total Contributions",
        value: `₹${mockReports.reduce((a, b) => a + (b.totalContribution || 0), 0).toLocaleString()}`,
        icon: <FaPiggyBank />,
        color: "blue"
      },
      {
        label: "Company Share",
        value: `₹${mockReports.reduce((a, b) => a + (b.companyContribution || 0), 0).toLocaleString()}`,
        icon: <FaShieldAlt />,
        color: "green"
      },
      {
        label: "Active Policies",
        value: mockReports.length,
        icon: <FaHandHoldingHeart />,
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
    { header: "Type", key: "reportType" },
    {
      header: "Emp Contribution",
      render: (r) => `₹${(r.empContribution || 0).toLocaleString()}`
    },
    {
      header: "Company Contribution",
      render: (r) => `₹${(r.companyContribution || 0).toLocaleString()}`
    },
    {
      header: "Total",
      className: "font-bold text-green-600",
      render: (r) => `₹${(r.totalContribution || 0).toLocaleString()}`
    }
  ];

  return (
    <div className="page-container fade-in">
      <PageHeader
        title="Statutory Reports"
        subtitle="Compliance reporting for PF, ESI, TDS, and other statutory requirements."
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
          <option value="All">All Types</option>
          <option value="PF">PF Contribution</option>
          <option value="ESI">ESI Contribution</option>
          <option value="Gratuity">Gratuity</option>
          <option value="FullFinal">Full & Final</option>
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
            title: "Compliance data unavailable",
            subtitle: "Select a report type and period to view statutory summaries.",
            icon: <FaShieldAlt />
          }}
        />
      </div>
    </div>
  );
};

export default StatutoryReports;
