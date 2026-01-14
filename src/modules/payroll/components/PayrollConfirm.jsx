import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getLatestPayrollBatch,
  confirmPayrollBatch
} from "../../../api/master.api";
import "./payroll.css";

const PayrollConfirm = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [batch, setBatch] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");

  /* -------------------------------
     LOAD LATEST PAYROLL BATCH
  -------------------------------- */
  const loadBatch = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getLatestPayrollBatch();
      setBatch(data.batch);
      setEmployees(data.employees);

    } catch (err) {
      console.error("LOAD PAYROLL ERROR:", err);
      setError("Failed to load payroll batch");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBatch();
  }, [loadBatch]);

  /* -------------------------------
     DERIVED STATE
  -------------------------------- */
  const pendingEmployees = employees.filter(
    (e) => e.payment_status === "PENDING"
  );

  /* -------------------------------
     CONFIRM PAYROLL
  -------------------------------- */
  const handleConfirm = async () => {
    if (!batch?.id || confirming || pendingEmployees.length === 0) return;

    setConfirming(true);
    setError("");

    try {
      await confirmPayrollBatch(batch.id);

      // Reload updated state
      await loadBatch();

    } catch (err) {
      console.error("CONFIRM PAYROLL ERROR:", err);
      setError(err.message || "Payroll confirmation failed");
    } finally {
      setConfirming(false);
    }
  };

  /* -------------------------------
     RENDER STATES
  -------------------------------- */
  if (loading) return <p>Loading payroll batch…</p>;
  if (error) return <p className="error">{error}</p>;
  if (!batch) return <p>No payroll batch found.</p>;

  return (
    <div className="payroll-confirm">
      <h2>
        Payroll Confirmation – {batch.pay_month}/{batch.pay_year}
      </h2>

      <p>
        Batch Status: <b>{batch.status}</b> | Pending Salaries:{" "}
        <b>{pendingEmployees.length}</b>
      </p>

      <table className="payroll-table">
        <thead>
          <tr>
            <th>Emp Code</th>
            <th>Name</th>
            <th>Email</th>
            <th>Basic</th>
            <th>Incentive</th>
            <th>Deductions</th>
            <th>PF</th>
            <th>Net Salary</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {pendingEmployees.map((e) => (
            <tr key={e.payroll_entry_id}>
              <td>{e.employee_code}</td>
              <td>{e.full_name}</td>
              <td>{e.email}</td>
              <td>₹{Number(e.base_salary).toLocaleString()}</td>
              <td>₹{Number(e.incentive).toLocaleString()}</td>
              <td>₹{Number(e.other_deductions).toLocaleString()}</td>
              <td>
                {e.pf_applicable
                  ? `₹${Number(e.pf_amount).toLocaleString()}`
                  : "NA"}
              </td>
              <td>
                <b>₹{Number(e.net_salary).toLocaleString()}</b>
              </td>
              <td>{e.payment_status}</td>
            </tr>
          ))}

          {pendingEmployees.length === 0 && (
            <tr>
              <td colSpan="9" style={{ textAlign: "center" }}>
                ✅ All salaries have been processed
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ACTIONS */}
      {pendingEmployees.length > 0 && batch.status !== "LOCKED" && (
        <button
          className="primary"
          onClick={handleConfirm}
          disabled={confirming}
        >
          {confirming
            ? "Processing..."
            : `Confirm & Send Salary (${pendingEmployees.length})`}
        </button>
      )}

      {batch.status === "CONFIRMED" && (
        <div className="success-box">
          <h3>✅ Payroll Completed</h3>
          <p>All pending salaries have been processed.</p>

          <button onClick={() => navigate("/payroll")}>
            Back to Payroll
          </button>
        </div>
      )}
    </div>
  );
};

export default PayrollConfirm;
