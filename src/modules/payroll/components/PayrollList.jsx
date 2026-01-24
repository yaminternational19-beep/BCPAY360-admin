import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  getPayrollEmployees,
  generatePayrollBatch
} from "../../../api/master.api.js";
import PageHeader from "../../../components/ui/PageHeader";
import SummaryCards from "../../../components/ui/SummaryCards";
import FiltersBar from "../../../components/ui/FiltersBar";
import DataTable from "../../../components/ui/DataTable";
import StatusBadge from "../../../components/ui/StatusBadge";
import { FaUsers, FaCheckCircle, FaHourglassHalf, FaExclamationCircle, FaWallet, FaCalendarAlt, FaMoneyBillWave, FaSync } from "react-icons/fa";
import "./payroll.css";
import "../../../styles/shared/modern-ui.css";

const PayrollList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const month = 1;
  const year = 2026;

  const [summary, setSummary] = useState({
    total: 0,
    paid: 0,
    pending: 0,
    not_generated: 0
  });

  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState([]);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBranch, setFilterBranch] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterDesignation, setFilterDesignation] = useState("");

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const res = await getPayrollEmployees({ month, year });
      setSummary(res.summary);

      const normalized = res.employees
        .sort((a, b) => {
          if (a.payment_status === b.payment_status) return 0;
          return a.payment_status === "PENDING" ? -1 : 1;
        })
        .map((e) => ({
          id: e.employee_id,
          emp_code: e.employee_code,
          name: e.full_name,
          department: e.department_name,
          designation: e.designation_name,
          branch: e.branch_name,

          uan_number: e.uan_number,
          base_salary: Number(e.base_salary),
          net_salary: Number(e.net_salary || 0),

          working_days: Number(e.working_days),
          present_days: Number(e.present_days),
          late_days: Number(e.late_days),
          leave_days: Number(e.leave_days),
          absent_days: Number(e.absent_days),
          ot_hours: Number(e.ot_hours),

          bank_name: e.bank_name,
          account_number: e.account_number,
          ifsc_code: e.ifsc_code,

          payment_status: e.payment_status,

          // editable
          incentive: 0,
          deductions: 0
        }));

      setEmployees(normalized);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  // Derive unique filter options
  const branches = useMemo(
    () => [...new Set(employees.map(e => e.branch).filter(Boolean))],
    [employees]
  );

  const departments = useMemo(
    () => [...new Set(employees.map(e => e.department).filter(Boolean))],
    [employees]
  );

  const designations = useMemo(
    () => [...new Set(employees.map(e => e.designation).filter(Boolean))],
    [employees]
  );

  // Filter employees based on all criteria
  const filteredEmployees = useMemo(() => {
    return employees.filter(e => {
      const matchesSearch =
        e.emp_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.name?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesBranch = !filterBranch || e.branch === filterBranch;
      const matchesDept = !filterDepartment || e.department === filterDepartment;
      const matchesDesg = !filterDesignation || e.designation === filterDesignation;

      return matchesSearch && matchesBranch && matchesDept && matchesDesg;
    });
  }, [employees, searchQuery, filterBranch, filterDepartment, filterDesignation]);

  // Summary mapping for SummaryCards
  const summaryCards = useMemo(() => {
    const paidCount = filteredEmployees.filter(e => e.payment_status === "SUCCESS").length;
    const pendingCount = filteredEmployees.filter(e => e.payment_status === "PENDING").length;
    const totalSalaryPaid = filteredEmployees
      .filter(e => e.payment_status === "SUCCESS")
      .reduce((sum, e) => sum + (e.net_salary || 0), 0);

    return [
      {
        label: "Total Employees",
        value: filteredEmployees.length,
        icon: <FaUsers />,
        color: "blue"
      },
      {
        label: "Paid Staff",
        value: paidCount,
        icon: <FaCheckCircle />,
        color: "green"
      },
      {
        label: "Pending Pay",
        value: pendingCount,
        icon: <FaHourglassHalf />,
        color: "orange"
      },
      {
        label: "Not Generated",
        value: summary.not_generated,
        icon: <FaExclamationCircle />,
        color: "orange"
      },
      {
        label: "Total Disbursed",
        value: `₹${totalSalaryPaid.toLocaleString('en-IN')}`,
        icon: <FaWallet />,
        color: "blue"
      },
      {
        label: "Period",
        value: `${month}/${year}`,
        icon: <FaCalendarAlt />,
        color: "blue"
      }
    ];
  }, [filteredEmployees, summary.not_generated]);

  const toggleAll = (checked) => {
    if (!checked) {
      setSelected([]);
      return;
    }

    const selectable = filteredEmployees
      .filter((e) => e.payment_status !== "SUCCESS")
      .map((e) => e.id);

    setSelected(selectable);
  };

  const toggleOne = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const updateEditable = (id, key, value) => {
    setEmployees((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, [key]: Number(value) || 0 } : e
      )
    );
  };

  const generatePay = async () => {
    if (!selected.length) return;

    const payload = {
      pay_month: month,
      pay_year: year,
      employees: employees
        .filter(
          (e) =>
            selected.includes(e.id) &&
            e.payment_status !== "SUCCESS"
        )
        .map((e) => ({
          employee_id: e.id,
          base_salary: e.base_salary,
          present_days: e.present_days,
          late_days: e.late_days,
          leave_days: e.leave_days,
          ot_hours: e.ot_hours,
          incentive: e.incentive,
          other_deductions: e.deductions,
          pf_applicable:
            e.uan_number && e.uan_number !== "-" ? 1 : 0
        }))
    };

    try {
      await generatePayrollBatch(payload);
      navigate("/payroll/confirm");
    } catch (err) {
      console.error(err);
      alert("Failed to generate payroll");
    }
  };

  const columns = [
    {
      header: (
        <input
          type="checkbox"
          onChange={(e) => toggleAll(e.target.checked)}
          checked={selected.length > 0 && selected.length === filteredEmployees.filter(e => e.payment_status !== "SUCCESS").length}
        />
      ),
      render: (e) => (
        <input
          type="checkbox"
          disabled={e.payment_status === "SUCCESS"}
          checked={selected.includes(e.id)}
          onChange={() => toggleOne(e.id)}
        />
      ),
      className: "sticky-col"
    },
    { header: "Emp Code", render: (e) => <span className="emp-code-cell">{e.emp_code}</span>, className: "sticky-col-2" },
    { header: "Name", key: "name", className: "name-cell" },
    { header: "Dept", key: "department" },
    { header: "UAN", render: (e) => e.uan_number || "-", className: "muted-cell" },
    { header: "Base Salary", render: (e) => `₹${Number(e.base_salary).toLocaleString()}`, className: "weight-semibold" },
    { header: "Working", key: "working_days" },
    { header: "Present", key: "present_days" },
    { header: "Absent", key: "absent_days" },
    { header: "OT (hrs)", key: "ot_hours" },
    {
      header: "Incentive",
      render: (e) => (
        <input
          type="number"
          className="table-input"
          disabled={e.payment_status === "SUCCESS"}
          value={e.incentive}
          onChange={(ev) => updateEditable(e.id, "incentive", ev.target.value)}
        />
      )
    },
    {
      header: "Deductions",
      render: (e) => (
        <input
          type="number"
          className="table-input"
          disabled={e.payment_status === "SUCCESS"}
          value={e.deductions}
          onChange={(ev) => updateEditable(e.id, "deductions", ev.target.value)}
        />
      )
    },
    {
      header: "Status",
      render: (e) => (
        <StatusBadge
          type={e.payment_status === "SUCCESS" ? "success" : "warning"}
          label={e.payment_status}
        />
      )
    }
  ];

  return (
    <div className="page-container fade-in">
      <PageHeader
        title="Payroll Processing"
        subtitle="Review attendance data, apply incentives/deductions and generate monthly disbursements."
        actions={
          <button className="btn-primary" onClick={loadEmployees}>
            <FaSync className={loading ? "animate-spin" : ""} /> Refresh Data
          </button>
        }
      />

      <SummaryCards cards={summaryCards} />

      <FiltersBar
        search={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Search by code or name..."
      >
        <select
          value={filterBranch}
          onChange={(e) => setFilterBranch(e.target.value)}
          className="filter-select-modern"
        >
          <option value="">All Branches</option>
          {branches.map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>

        <select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className="filter-select-modern"
        >
          <option value="">All Departments</option>
          {departments.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <select
          value={filterDesignation}
          onChange={(e) => setFilterDesignation(e.target.value)}
          className="filter-select-modern"
        >
          <option value="">All Designations</option>
          {designations.map(dsg => (
            <option key={dsg} value={dsg}>{dsg}</option>
          ))}
        </select>

        <button onClick={() => { setSearchQuery(""); setFilterBranch(""); setFilterDepartment(""); setFilterDesignation(""); }} className="btn-export">
          Clear Filters
        </button>
      </FiltersBar>

      <div className="payroll-table-section">
        <DataTable
          columns={columns}
          data={filteredEmployees}
          emptyState={{
            title: "No employees found",
            subtitle: "Try adjusting your search or filters to find specific records.",
            icon: <FaMoneyBillWave />
          }}
        />
      </div>

      {selected.length > 0 && (
        <div className="payroll-footer-action slide-up">
          <div className="footer-info">
            <span><strong>{selected.length}</strong> employees selected for processing</span>
          </div>
          <button className="btn-primary btn-large" onClick={generatePay}>
            Generate Payroll Batch
          </button>
        </div>
      )}
    </div>
  );
};

export default PayrollList;
