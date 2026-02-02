import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  getPayrollBatch,
  confirmPayrollBatch
} from "../../../api/master.api";
import PageHeader from "../../../components/ui/PageHeader";
import DataTable from "../../../components/ui/DataTable";
import { FaArrowLeft, FaSync, FaMoneyBillWave, FaCheckCircle } from "react-icons/fa";
import "./payroll.css";
import "../../../styles/shared/modern-ui.css";

const PayrollConfirm = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [payMonth, setPayMonth] = useState(
    Number(searchParams.get("month")) || new Date().getMonth() + 1
  );
  const payYear = Number(searchParams.get("year")) || new Date().getFullYear();

  const [loading, setLoading] = useState(true);
  const [batch, setBatch] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState([]);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");

  const loadBatch = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPayrollBatch({
        pay_month: payMonth,
        pay_year: payYear
      });

      setBatch(data.batch);
      setEmployees(data.employees || []);
      setSelected((data.employees || []).map(e => e.employee_id));

    } catch (err) {
      setError("Failed to load payroll batch: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [payMonth, payYear]);

  useEffect(() => {
    setSearchParams({ month: payMonth, year: payYear }, { replace: true });
    loadBatch();
  }, [payMonth, payYear, loadBatch]);

  const toggleAll = (checked) => {
    setSelected(checked ? employees.map(e => e.employee_id) : []);
  };

  const toggleOne = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const columns = [
    {
      header: (
        <input
          type="checkbox"
          checked={selected.length === employees.length && employees.length > 0}
          onChange={(e) => toggleAll(e.target.checked)}
        />
      ),
      render: (e) => (
        <input
          type="checkbox"
          checked={selected.includes(e.employee_id)}
          onChange={() => toggleOne(e.employee_id)}
        />
      )
    },
    { header: "Emp Code", key: "employee_code" },
    { header: "Name", key: "full_name" },
    { header: "Bank Name", key: "bank_name" },
    { header: "Account No", key: "account_number" },
    { header: "IFSC", key: "ifsc_code" },
    { header: "Base Salary", render: (e) => `₹${Number(e.base_salary).toLocaleString()}` },
    { header: "Incentive", render: (e) => `₹${Number(e.incentive).toLocaleString()}` },
    { header: "PF Amount", render: (e) => `₹${Number(e.pf_amount || 0).toLocaleString()}` },
    { header: "Deductions", render: (e) => `₹${Number(e.other_deductions).toLocaleString()}` },
    { header: "Gross", render: (e) => `₹${Number(e.gross_salary || 0).toLocaleString()}` },
    { header: "Net Salary", render: (e) => `₹${Number(e.net_salary).toLocaleString()}` },
    {
      header: "Status",
      render: (e) => (
        <span className={`status-badge ${e.payment_status.toLowerCase()}`}>
          {e.payment_status}
        </span>
      )
    }
  ];

  const handleConfirm = async () => {
    if (confirming || employees.length === 0) return;

    setConfirming(true);
    setError("");

    try {
      await confirmPayrollBatch({
        payMonth,
        payYear,
        employeeIds: selected,
        action: "CONFIRM"
      });

      alert("Salary processed successfully");
      await loadBatch();

    } catch (err) {
      setError(err.message || "Payroll confirmation failed");
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="page-container fade-in">
      <PageHeader
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <button onClick={() => navigate(-1)} className="btn-action view">
              <FaArrowLeft />
            </button>
            <span>Confirm Payroll</span>
          </div>
        }
        subtitle="Send salary for the selected month."
        actions={
          <div className="payroll-selectors">
            <select
              value={payMonth}
              onChange={(e) => setPayMonth(Number(e.target.value))}
              className="filter-select-modern"
            >
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>
            <button className="btn-primary" onClick={loadBatch} disabled={loading}>
              <FaSync /> Refresh
            </button>
          </div>
        }
      />

      <div className="payroll-table-section">
        <DataTable
          columns={columns}
          data={employees}
          emptyState={{
            title: "No employees in this batch",
            subtitle: "Try selecting a different month.",
            icon: <FaMoneyBillWave />
          }}
        />
      </div>

      <div className="payroll-footer-action slide-up">
        <button onClick={() => navigate("/payroll")} className="btn-secondary">
          Back to Payroll
        </button>
        <button
          className="btn-primary btn-large"
          onClick={handleConfirm}
          disabled={confirming || selected.length === 0}
        >
          {confirming ? "Processing..." : `Send Salary (${selected.length})`}
        </button>
      </div>
    </div>
  );
};

export default PayrollConfirm;
