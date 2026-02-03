import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  getPayrollEmployees,
  generatePayrollBatch,
  getDepartments
} from "../../../api/master.api.js";
import PageHeader from "../../../components/ui/PageHeader";
import SummaryCards from "../../../components/ui/SummaryCards";
import FiltersBar from "../../../components/ui/FiltersBar";
import DataTable from "../../../components/ui/DataTable";
import StatusBadge from "../../../components/ui/StatusBadge";
import { FaUsers, FaCheckCircle, FaHourglassHalf, FaExclamationCircle, FaWallet, FaCalendarAlt, FaMoneyBillWave, FaSync } from "react-icons/fa";
import "./payroll.css";
import "../../../styles/shared/modern-ui.css";
import { useBranch } from "../../../hooks/useBranch"; // Import Hook

const PayrollList = () => {
  const navigate = useNavigate();
  const { branches: branchList, selectedBranch, changeBranch, isSingleBranch } = useBranch();
  const [loading, setLoading] = useState(false);

  const [payMonth, setPayMonth] = useState(new Date().getMonth() + 1);
  const [payYear, setPayYear] = useState(new Date().getFullYear());

  const [summary, setSummary] = useState({
    total: 0,
    paid: 0,
    pending: 0,
    not_generated: 0
  });

  const [employees, setEmployees] = useState([]);
  const [batch, setBatch] = useState(null);
  const [selected, setSelected] = useState([]);
  const [payrollData, setPayrollData] = useState({});

  // Master Data state
  const [departmentList, setDepartmentList] = useState([]);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartmentId, setFilterDepartmentId] = useState("");

  const loadEmployees = async () => {
    setLoading(true);
    setSelected([]); // Reset selection on fetch
    try {
      const res = await getPayrollEmployees({ month: payMonth, year: payYear });
      setSummary(res.summary);
      setBatch(res.batch || null);

      const normalized = res.employees || [];

      setEmployees(normalized);

      // Initialize keyed payroll data
      const initialData = {};
      normalized.forEach(e => {
        initialData[e.employee_id] = {
          incentive: Number(e.incentive || 0),
          bonus: Number(e.bonus || 0),
          other_deductions: Number(e.other_deductions || 0),
          pf_applicable: e.pf_applicable ?? 0
        };
      });
      setPayrollData(initialData);
    } catch (err) {
      alert("Failed to load employees: " + err.message);
    } finally {
      setLoading(false);
    }
  };


  // Fetch departments when branch filter changes
  useEffect(() => {
    if (selectedBranch) {
      (async () => {
        try {
          const depts = await getDepartments(selectedBranch);
          setDepartmentList(depts || []);
        } catch (err) {
          alert("Failed to fetch departments: " + err.message);
          setDepartmentList([]);
        }
      })();
    } else {
      setDepartmentList([]);
    }
    setFilterDepartmentId("");
  }, [selectedBranch]);

  useEffect(() => {
    loadEmployees();
  }, [payMonth, payYear]); // Re-fetch employees on month/year change

  // Filter employees based on all criteria
  const filteredEmployees = useMemo(() => {
    return employees.filter(e => {
      const matchesSearch =
        e.employee_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.full_name?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesBranch = !selectedBranch || String(e.branch_id) === String(selectedBranch);
      const matchesDept = !filterDepartmentId || String(e.department_id) === String(filterDepartmentId);

      return matchesSearch && matchesBranch && matchesDept;
    });
  }, [employees, searchQuery, selectedBranch, filterDepartmentId]);

  // Summary mapping for SummaryCards
  const summaryCards = useMemo(() => {
    return [
      {
        label: "Total Employees",
        value: summary.total,
        icon: <FaUsers />,
        color: "blue"
      },
      {
        label: "Paid Staff",
        value: summary.paid,
        icon: <FaCheckCircle />,
        color: "green"
      },
      {
        label: "Pending Pay",
        value: summary.pending,
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
        label: "Period",
        value: `${payMonth}/${payYear}`,
        icon: <FaCalendarAlt />,
        color: "blue"
      }
    ];
  }, [summary, batch, payMonth, payYear]);

  const isLocked = batch && batch.status !== "DRAFT";

  const toggleAll = (checked) => {
    if (!checked || isLocked) {
      setSelected([]);
      return;
    }

    const selectable = filteredEmployees
      .filter(e => e.payment_status !== "SUCCESS")
      .map((e) => e.employee_id);

    setSelected(selectable);
  };

  const toggleOne = (id) => {
    const emp = employees.find(e => e.employee_id === id);
    if (isLocked || emp?.payment_status === "SUCCESS") return;

    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const updateEditable = (id, key, value) => {
    setPayrollData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [key]: key === "pf_applicable" ? value : (Number(value) || 0)
      }
    }));
  };

  const generatePay = async () => {
    if (!selected.length || isLocked) return;

    const payload = {
      pay_month: payMonth,
      pay_year: payYear,
      employees: employees
        .filter(
          (e) =>
            selected.includes(e.employee_id)
        )
        .map((e) => {
          const data = payrollData[e.employee_id] || {};
          return {
            employee_id: e.employee_id,
            base_salary: Number(e.base_salary),
            incentive: data.incentive || 0,
            bonus: data.bonus || 0,
            other_deductions: data.other_deductions || 0,
            pf_applicable: data.pf_applicable || 0
          };
        })
    };

    try {
      await generatePayrollBatch(payload);
      navigate(`/payroll/confirm?month=${payMonth}&year=${payYear}`);
    } catch (err) {
      alert("Failed to generate payroll: " + err.message);
    }
  };

  const columns = [
    {
      header: (
        <input
          type="checkbox"
          disabled={isLocked}
          onChange={(e) => toggleAll(e.target.checked)}
          checked={
            (() => {
              const selectable = filteredEmployees.filter(e => e.payment_status !== "SUCCESS");
              return selectable.length > 0 && selected.length === selectable.length && !isLocked;
            })()
          }
        />
      ),
      render: (e) => (
        <input
          type="checkbox"
          disabled={isLocked || e.payment_status === "SUCCESS"}
          checked={selected.includes(e.employee_id)}
          onChange={() => toggleOne(e.employee_id)}
        />
      ),
      className: "sticky-col"
    },
    { header: "Emp Code", render: (e) => <span className="emp-code-cell">{e.employee_code}</span>, className: "sticky-col-2" },
    { header: "Name", key: "full_name", className: "name-cell" },
    { header: "Dept", key: "department_name" },
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
          disabled={isLocked || e.payment_status === "SUCCESS"}
          value={payrollData[e.employee_id]?.incentive || 0}
          onChange={(ev) => updateEditable(e.employee_id, "incentive", ev.target.value)}
        />
      )
    },
    {
      header: "Bonus",
      render: (e) => (
        <input
          type="number"
          className="table-input"
          disabled={isLocked || e.payment_status === "SUCCESS"}
          value={payrollData[e.employee_id]?.bonus || 0}
          onChange={(ev) => updateEditable(e.employee_id, "bonus", ev.target.value)}
        />
      )
    },
    {
      header: "Deductions",
      render: (e) => (
        <input
          type="number"
          className="table-input"
          disabled={isLocked || e.payment_status === "SUCCESS"}
          value={payrollData[e.employee_id]?.other_deductions || 0}
          onChange={(ev) => updateEditable(e.employee_id, "other_deductions", ev.target.value)}
        />
      )
    },
    {
      header: "PF?",
      render: (e) => (
        <input
          type="checkbox"
          disabled={isLocked || e.payment_status === "SUCCESS"}
          checked={payrollData[e.employee_id]?.pf_applicable === 1}
          onChange={(ev) => updateEditable(e.employee_id, "pf_applicable", ev.target.checked ? 1 : 0)}
        />
      )
    },
    {
      header: "Status",
      render: (e) => (
        <StatusBadge
          type={e.payment_status === "SUCCESS" ? "success" : e.payment_status === "PENDING" ? "warning" : "neutral"}
          label={e.payment_status || "NOT_GENERATED"}
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
          <div className="payroll-selectors">
            <select
              value={payMonth}
              onChange={(e) => setPayMonth(Number(e.target.value))}
              className="filter-select-modern"
            >
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
            <select
              value={payYear}
              onChange={(e) => setPayYear(Number(e.target.value))}
              className="filter-select-modern"
            >
              {[2024, 2025, 2026].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <button className="btn-primary" onClick={loadEmployees}>
              <FaSync className={loading ? "animate-spin" : ""} /> Fetch Data
            </button>
          </div>
        }
      />

      <SummaryCards cards={summaryCards} />

      <FiltersBar
        search={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Search by code or name..."
      >
        <button
          className="btn-confirm-salary"
          onClick={() => navigate(`/payroll/confirm?month=${payMonth}&year=${payYear}`)}
        >
          <FaCheckCircle /> Confirm / Send Salary
        </button>

        {!isSingleBranch && (
          <select
            value={selectedBranch === null ? "ALL" : selectedBranch}
            onChange={(e) => {
              const val = e.target.value;
              changeBranch(val === "ALL" ? null : Number(val));
            }}
            className="filter-select-modern"
          >
            {branchList.length > 1 && <option value="ALL">All Branches</option>}
            {branchList.map(b => (
              <option key={b.id} value={b.id}>{b.branch_name}</option>
            ))}
          </select>
        )}

        <select
          value={filterDepartmentId}
          onChange={(e) => setFilterDepartmentId(e.target.value)}
          className="filter-select-modern"
          disabled={!selectedBranch}
        >
          <option value="">{selectedBranch ? "All Departments" : "Select Branch First"}</option>
          {departmentList.map(d => (
            <option key={d.id} value={d.id}>{d.department_name}</option>
          ))}
        </select>

        <button onClick={() => { setSearchQuery(""); setFilterDepartmentId(""); }} className="btn-export">
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
          <button className="btn-primary btn-large" onClick={generatePay} disabled={isLocked}>
            {isLocked ? "Payroll Locked" : "Generate Payroll Batch (Draft)"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PayrollList;