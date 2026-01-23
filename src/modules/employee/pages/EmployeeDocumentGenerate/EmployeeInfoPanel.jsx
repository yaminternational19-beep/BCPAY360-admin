import React, { useEffect, useState } from "react";
import { getEmployeeSummary } from "../../../../api/employees.api";

const EmployeeInfoPanel = ({ employeeId }) => {
    const [data, setData] = useState(null);

    useEffect(() => {
  if (!employeeId) return;

  getEmployeeSummary(employeeId)
    .then((res) => {
      console.log("EMPLOYEE SUMMARY RESPONSE:", res);

      if (!res.success) {
        throw new Error("Employee summary failed");
      }

      setData(res); // res already has employee, attendance, payroll
    })
    .catch((err) => {
      console.error("Employee summary error", err);
    });
}, [employeeId]);



    if (!data) {
        return <div className="doc-panel right">Loading employee details…</div>;
    }

    const { employee, attendance, leaves, payroll, scope } = data;

    const formatDate = (d) =>
        d ? new Date(d).toLocaleDateString("en-GB") : "-";

    return (
        <div className="doc-panel right">
            <h3>Employee Snapshot</h3>
            <small style={{ opacity: 0.6 }}>Scope: {scope}</small>

            {/* BASIC INFO */}
            <section className="info-section">
                <h4>Basic Info</h4>

                <div className="info-item"><label>Name</label><span>{employee.full_name}</span></div>
                <div className="info-item"><label>Employee Code</label><span>{employee.employee_code}</span></div>
                <div className="info-item"><label>Status</label><span>{employee.employee_status}</span></div>
                <div className="info-item"><label>Joining Date</label><span>{formatDate(employee.joining_date)}</span></div>
                <div className="info-item"><label>Confirmation Date</label><span>{formatDate(employee.confirmation_date)}</span></div>
            </section>

            {/* ORGANIZATION */}
            <section className="info-section">
                <h4>Organization</h4>

                <div className="info-item"><label>Branch</label><span>{employee.branch_name}</span></div>
                <div className="info-item"><label>Department</label><span>{employee.department_name}</span></div>
                <div className="info-item"><label>Designation</label><span>{employee.designation_name}</span></div>
            </section>

            {/* CONTACT */}
            <section className="info-section">
                <h4>Contact</h4>

                <div className="info-item"><label>Email</label><span>{employee.email}</span></div>
                <div className="info-item"><label>Phone</label><span>{employee.phone}</span></div>
            </section>

            {/* PERSONAL */}
            <section className="info-section">
                <h4>Personal</h4>

                <div className="info-item"><label>Gender</label><span>{employee.gender}</span></div>
                <div className="info-item"><label>DOB</label><span>{formatDate(employee.dob)}</span></div>
                <div className="info-item"><label>Marital Status</label><span>{employee.marital_status}</span></div>
                <div className="info-item"><label>Aadhaar</label><span>{employee.aadhaar_number || "-"}</span></div>
                <div className="info-item"><label>PAN</label><span>{employee.pan_number || "-"}</span></div>
                <div className="info-item"><label>UAN</label><span>{employee.uan_number || "-"}</span></div>
                <div className="info-item"><label>ESIC</label><span>{employee.esic_number || "-"}</span></div>
            </section>

            {/* ATTENDANCE */}
            <section className="info-section">
                <h4>Attendance Summary</h4>

                <div className="info-item"><label>Total Days</label><span>{attendance.total_days}</span></div>
                <div className="info-item"><label>Present</label><span>{attendance.present_days}</span></div>
                <div className="info-item"><label>Absent</label><span>{attendance.absent_days}</span></div>
                <div className="info-item"><label>Late</label><span>{attendance.late_days}</span></div>
                <div className="info-item"><label>OT Minutes</label><span>{attendance.overtime_minutes}</span></div>
            </section>

            {/* LEAVES */}
            <section className="info-section">
                <h4>Approved Leaves</h4>

                {leaves.length === 0 ? (
                    <div className="info-item"><span>No approved leaves</span></div>
                ) : (
                    leaves.map((l, i) => (
                        <div className="info-item" key={i}>
                            <label>{l.leave_name}</label>
                            <span>{l.total_days} days</span>
                        </div>
                    ))
                )}
            </section>

            {/* PAYROLL */}
            <section className="info-section">
                <h4>Payroll</h4>

                <div className="info-item"><label>Base Salary</label><span>₹{Number(payroll.base_salary).toLocaleString()}</span></div>
                <div className="info-item"><label>CTC (Annual)</label><span>₹{Number(employee.ctc_annual).toLocaleString()}</span></div>
                <div className="info-item"><label>Gross Salary</label><span>₹{Number(payroll.gross_salary).toLocaleString()}</span></div>
                <div className="info-item"><label>Net Salary</label><span>₹{Number(payroll.net_salary).toLocaleString()}</span></div>
                <div className="info-item"><label>PF Amount</label><span>₹{Number(payroll.pf_amount).toLocaleString()}</span></div>
                <div className="info-item"><label>Incentive</label><span>₹{Number(payroll.incentive).toLocaleString()}</span></div>
                <div className="info-item"><label>Deductions</label><span>₹{Number(payroll.other_deductions).toLocaleString()}</span></div>
                <div className="info-item"><label>Payment Status</label><span>{payroll.payment_status}</span></div>
                <div className="info-item"><label>Pay Period</label><span>{payroll.pay_month}/{payroll.pay_year}</span></div>
            </section>
        </div>
    );
};

export default EmployeeInfoPanel;
