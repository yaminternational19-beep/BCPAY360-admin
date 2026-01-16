import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  getPayrollEmployees,
  generatePayrollBatch
} from "../../../api/master.api.js";
import "./payroll.css";

const PayrollList = () => {
  const navigate = useNavigate();

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

  // Calculate summary metrics from filtered employees
  const summaryMetrics = useMemo(() => {
    const filtered = filteredEmployees;
    const paidCount = filtered.filter(e => e.payment_status === "SUCCESS").length;
    const unpaidCount = filtered.filter(e => e.payment_status === "PENDING").length;
    const totalSalaryPaid = filtered
      .filter(e => e.payment_status === "SUCCESS")
      .reduce((sum, e) => sum + (e.net_salary || 0), 0);

    return {
      totalEmployees: filtered.length,
      paid: paidCount,
      unpaid: unpaidCount,
      totalSalaryPaid: totalSalaryPaid
    };
  }, [filteredEmployees]);

  const loadEmployees = async () => {
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
      alert("Failed to load payroll employees");
    }
  };

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

  const clearFilters = () => {
    setSearchQuery("");
    setFilterBranch("");
    setFilterDepartment("");
    setFilterDesignation("");
  };

  const generatePay = async () => {
    if (!selected.length) {
      alert("Select at least one pending employee");
      return;
    }

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

  return (
    <div className="payroll-container">
      <h2>Payroll Processing</h2>

      {/* 6 SUMMARY PANELS */}
      <div className="payroll-summary-grid">
        <div className="summary-card">
          <h4>Total Employees</h4>
          <p className="summary-value">{summaryMetrics.totalEmployees}</p>
        </div>
        <div className="summary-card">
          <h4>Paid Employees</h4>
          <p className="summary-value success">{summaryMetrics.paid}</p>
        </div>
        <div className="summary-card">
          <h4>Unpaid / Pending</h4>
          <p className="summary-value pending">{summaryMetrics.unpaid}</p>
        </div>
        <div className="summary-card">
          <h4>Not Generated</h4>
          <p className="summary-value">{summary.not_generated}</p>
        </div>
        <div className="summary-card">
          <h4>Total Salary Paid</h4>
          <p className="summary-value">₹{summaryMetrics.totalSalaryPaid.toLocaleString('en-IN')}</p>
        </div>
        <div className="summary-card">
          <h4>Selected Period</h4>
          <p className="summary-value">{month}/{year}</p>
        </div>
      </div>

      {/* UNIFIED FILTER BAR */}
      <div className="payroll-filter-bar">
        <input
          type="text"
          placeholder="Search by employee code or name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="filter-input"
        />

        <select
          value={filterBranch}
          onChange={(e) => setFilterBranch(e.target.value)}
          className="filter-select"
        >
          <option value="">All Branches</option>
          {branches.map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>

        <select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className="filter-select"
        >
          <option value="">All Departments</option>
          {departments.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <select
          value={filterDesignation}
          onChange={(e) => setFilterDesignation(e.target.value)}
          className="filter-select"
        >
          <option value="">All Designations</option>
          {designations.map(dsg => (
            <option key={dsg} value={dsg}>{dsg}</option>
          ))}
        </select>

        <button onClick={clearFilters} className="secondary">
          Clear Filters
        </button>
      </div>

      {/* TABLE */}
      <div className="table-wrapper">
        <table className="payroll-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={(e) => toggleAll(e.target.checked)}
                />
              </th>
              <th>Emp Code</th>
              <th>Name</th>
              <th>Dept</th>
              <th>Desg</th>
              <th>UAN</th>
              <th>Base Salary</th>
              <th>Working</th>
              <th>Present</th>
              <th>Late</th>
              <th>Leaves</th>
              <th>Absent</th>
              <th>OT</th>
              <th>Incentive</th>
              <th>Deductions</th>
              <th>PF</th>
              <th>Bank</th>
              <th>Account</th>
              <th>IFSC</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan="20" style={{ textAlign: "center", padding: "20px" }}>
                  No employees found matching the filters
                </td>
              </tr>
            ) : (
              filteredEmployees.map((e) => (
                <tr
                  key={e.id}
                  className={e.payment_status === "SUCCESS" ? "row-paid" : ""}
                >
                  <td>
                    <input
                      type="checkbox"
                      disabled={e.payment_status === "SUCCESS"}
                      checked={selected.includes(e.id)}
                      onChange={() => toggleOne(e.id)}
                    />
                  </td>

                  <td>{e.emp_code}</td>
                  <td>{e.name}</td>
                  <td>{e.department}</td>
                  <td>{e.designation}</td>
                  <td>{e.uan_number || "-"}</td>
                  <td>{e.base_salary}</td>
                  <td>{e.working_days}</td>
                  <td>{e.present_days}</td>
                  <td>{e.late_days}</td>
                  <td>{e.leave_days}</td>
                  <td>{e.absent_days}</td>
                  <td>{e.ot_hours}</td>

                  <td>
                    <input
                      type="number"
                      disabled={e.payment_status === "SUCCESS"}
                      value={e.incentive}
                      onChange={(ev) =>
                        updateEditable(e.id, "incentive", ev.target.value)
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      disabled={e.payment_status === "SUCCESS"}
                      value={e.deductions}
                      onChange={(ev) =>
                        updateEditable(e.id, "deductions", ev.target.value)
                      }
                    />
                  </td>

                  <td>
                    {e.uan_number && e.uan_number !== "-" ? "Yes" : "No"}
                  </td>

                  <td>{e.bank_name || "-"}</td>
                  <td>{e.account_number || "-"}</td>
                  <td>{e.ifsc_code || "-"}</td>

                  <td>
                    <span
                      className={`status ${
                        e.payment_status === "SUCCESS" ? "paid" : "pending"
                      }`}
                    >
                      {e.payment_status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="payroll-footer">
        <button 
          className="primary" 
          onClick={generatePay}
          disabled={selected.length === 0}
        >
          Generate Payroll ({selected.length} selected)
        </button>
      </div>
    </div>
  );
};

export default PayrollList;
