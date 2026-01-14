import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPayrollEmployees, generatePayrollBatch } from "../../../api/master.api.js";
import "./payroll.css";

const PayrollList = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState([]);

  // 🔹 TEMP: hardcode month/year (later from filter UI)
  const month = 1;
  const year = 2026;

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await getPayrollEmployees({ month, year });

        const normalized = data.map((e) => ({
          id: e.employee_id,
          emp_code: e.employee_code,
          name: e.full_name,
          email: e.email,
          department: e.department_name,
          designation: e.designation_name,
          contact_number: e.phone,
          joining_date: e.joining_date?.split("T")[0],
          uan_number: e.uan_number,
          bank_name: e.bank_name,
          account_number: e.account_number,
          base_salary: Number(e.base_salary || 0),

          present_days: Number(e.present_days || 0),
          late_days: Number(e.late_days || 0),
          leaves: Number(e.leave_days || 0), // backend-ready
          overtime_hours: Number(e.ot_hours || 0),

          // editable
          incentive: 0,
          deductions: 0,
        }));

        setEmployees(normalized);
      } catch (err) {
        console.error("Failed to load payroll employees", err);
        alert("Failed to load payroll employees");
      }
    };

    loadEmployees();
  }, []);

  const toggleAll = (checked) => {
    setSelected(checked ? employees.map((e) => e.id) : []);
  };

  const toggleOne = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
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
  if (!selected.length) {
    alert("Select at least one employee");
    return;
  }

  const payload = {
    pay_month: month,
    pay_year: year,
    employees: employees
      .filter((e) => selected.includes(e.id))
      .map((e) => ({
        employee_id: e.id,
        base_salary: e.base_salary,
        present_days: e.present_days,
        late_days: e.late_days,
        leave_days: e.leaves,
        ot_hours: e.overtime_hours,
        incentive: e.incentive,
        other_deductions: e.deductions,
        pf_applicable: e.uan_number ? 1 : 0,
      })),
  };

  try {
    const res = await generatePayrollBatch(payload);

    // ✅ Optional UX message (recommended)
    if (res?.ignored > 0) {
      alert(`${res.ignored} employee(s) were already processed and skipped`);
    }

    // ✅ Always go to confirm
    navigate("/payroll/confirm");

  } catch (err) {
    console.error(err);
    alert("Failed to generate payroll");
  }
};




  return (
    <div className="payroll-container">
      <h2>Payroll Processing</h2>

      <table className="payroll-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selected.length === employees.length && employees.length > 0}
                onChange={(e) => toggleAll(e.target.checked)}
              />
            </th>
            <th>Sl</th>
            <th>Emp Code</th>
            <th>Name</th>
            <th>Dept</th>
            <th>Desg</th>
            <th>Contact</th>
            <th>Join Date</th>
            <th>UAN</th>
            <th>Salary</th>
            <th>Present</th>
            <th>Late</th>
            <th>Leaves</th>
            <th>OT</th>
            <th>Incentive</th>
            <th>Deductions</th>
            <th>PF</th>
            <th>Bank</th>
            <th>Account</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((e, i) => (
            <tr key={e.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selected.includes(e.id)}
                  onChange={() => toggleOne(e.id)}
                />
              </td>
              <td>{i + 1}</td>
              <td>{e.emp_code}</td>
              <td>{e.name}</td>
              <td>{e.department}</td>
              <td>{e.designation}</td>
              <td>{e.contact_number}</td>
              <td>{e.joining_date}</td>
              <td>{e.uan_number || "-"}</td>
              <td>{e.base_salary}</td>
              <td>{e.present_days}</td>
              <td>{e.late_days}</td>
              <td>{e.leaves}</td>
              <td>{e.overtime_hours}</td>

              {/* Editable */}
              <td>
                <input
                  type="number"
                  value={e.incentive}
                  onChange={(ev) =>
                    updateEditable(e.id, "incentive", ev.target.value)
                  }
                />
              </td>

              <td>
                <input
                  type="number"
                  value={e.deductions}
                  onChange={(ev) =>
                    updateEditable(e.id, "deductions", ev.target.value)
                  }
                />
              </td>

              <td>{e.uan_number ? "Applicable" : "NA"}</td>
              <td>{e.bank_name || "-"}</td>
              <td>{e.account_number || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="payroll-footer">
        <button className="primary" onClick={generatePay}>
          Generate Pay (Selected)
        </button>
      </div>
    </div>
  );
};

export default PayrollList;
