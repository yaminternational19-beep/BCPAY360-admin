import React, { useState, useMemo } from "react";
import PageHeader from "../../../../components/ui/PageHeader";
import SummaryCards from "../../../../components/ui/SummaryCards";
import FiltersBar from "../../../../components/ui/FiltersBar";
import DataTable from "../../../../components/ui/DataTable";
import { FaMoneyBillWave, FaWallet, FaHandHoldingUsd, FaFileInvoiceDollar, FaSearch } from "react-icons/fa";
import "../../../../styles/shared/modern-ui.css";

const SalaryReports = () => {
  const [filters, setFilters] = useState({
    search: "",
    month: "January",
    year: new Date().getFullYear().toString(),
    reportType: "Payslip",
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
      month: "January",
      basicSalary: 50000,
      allowances: 10000,
      deductions: 5000,
      netSalary: 55000,
      reportType: "Payslip",
    },
    {
      empCode: "EMP-002",
      name: "Jane Smith",
      month: "January",
      basicSalary: 45000,
      allowances: 8000,
      deductions: 4500,
      netSalary: 48500,
      reportType: "Payslip",
    },
    {
      empCode: "EMP-003",
      name: "Mike Johnson",
      month: "January",
      basicSalary: 55000,
      allowances: 12000,
      deductions: 6000,
      netSalary: 61000,
      reportType: "Payslip",
    },
  ];

  const filteredReports = useMemo(() => {
    return mockReports.filter(r =>
      r.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      r.empCode.toLowerCase().includes(filters.search.toLowerCase())
    );
  }, [filters.search]);

  const stats = useMemo(() => {
    const total = mockReports.reduce((a, b) => a + b.netSalary, 0);
    const avg = Math.round(total / mockReports.length);
    return [
      {
        label: "Total Payroll",
        value: `₹${total.toLocaleString()}`,
        icon: <FaWallet />,
        color: "blue"
      },
      {
        label: "Average Net",
        value: `₹${avg.toLocaleString()}`,
        icon: <FaHandHoldingUsd />,
        color: "green"
      },
      {
        label: "Total Deductions",
        value: `₹${mockReports.reduce((a, b) => a + b.deductions, 0).toLocaleString()}`,
        icon: <FaMoneyBillWave />,
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
    { header: "Month", key: "month" },
    {
      header: "Basic Salary",
      render: (r) => `₹${r.basicSalary.toLocaleString()}`
    },
    {
      header: "Allowances",
      render: (r) => `₹${r.allowances.toLocaleString()}`
    },
    {
      header: "Deductions",
      render: (r) => `₹${r.deductions.toLocaleString()}`
    },
    {
      header: "Net Salary",
      className: "font-bold text-blue-600",
      render: (r) => `₹${r.netSalary.toLocaleString()}`
    }
  ];

  return (
    <div className="page-container fade-in">
      <PageHeader
        title="Salary Reports"
        subtitle="Manage payroll, bonuses, and statutory deductions for all employees."
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
          <option value="Payslip">Payslip</option>
          <option value="Bonus">Bonus</option>
          <option value="Arrears">Arrears</option>
          <option value="Advance">Advance</option>
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
            title: "Payroll data not calculated",
            subtitle: "Use the filters to search for specific employee payroll data.",
            icon: <FaFileInvoiceDollar />
          }}
        />
      </div>
    </div>
  );
};

export default SalaryReports;
