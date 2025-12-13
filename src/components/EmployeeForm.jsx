import React, { useEffect, useState } from "react";
import "../styles/EmployeeForm.css";

/* =========================
   CONSTANTS
========================= */
const DEPARTMENT_ROLES = {
  HR: ["HR Manager", "HR Executive"],
  Finance: ["Accountant", "Finance Executive"],
  IT: ["Developer", "Team Lead"],
  Sales: ["Sales Executive", "Sales Manager"],
  Operations: ["Operations Executive"],
  Marketing: ["Marketing Executive"],
  Support: ["Support Engineer"],
};

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  department: "HR",
  role: "HR Executive",
  joiningDate: "",
  salary: "",
  pan: "",
};

/* =========================
   COMPONENT
========================= */
const EmployeeForm = ({ initial, onClose, onSave }) => {
  const [form, setForm] = useState(EMPTY_FORM);

  /* Load edit data */
  useEffect(() => {
    if (initial) setForm(initial);
    else setForm(EMPTY_FORM);
  }, [initial]);

  const handleChange = (key, value) => {
    setForm(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleDepartmentChange = (dept) => {
    setForm(prev => ({
      ...prev,
      department: dept,
      role: DEPARTMENT_ROLES[dept][0], // auto-fix role
    }));
  };

  const submit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      return alert("Employee name is required");
    }

    if (!form.email.trim()) {
      return alert("Email is required");
    }

    onSave({
      ...form,
      salary: Number(form.salary) || 0,
      joiningDate:
        form.joiningDate || new Date().toISOString().slice(0, 10),
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        {/* HEADER */}
        <div className="modal-header">
          <h3>{form.id ? "Edit Employee" : "Add Employee"}</h3>
          <button onClick={onClose}>✕</button>
        </div>

        {/* FORM */}
        <form className="emp-form" onSubmit={submit}>
          <div className="row">
            <label>
              Name
              <input
                value={form.name}
                onChange={e => handleChange("name", e.target.value)}
                required
              />
            </label>

            <label>
              Email
              <input
                type="email"
                value={form.email}
                onChange={e => handleChange("email", e.target.value)}
                required
              />
            </label>
          </div>

          <div className="row">
            <label>
              Phone
              <input
                value={form.phone}
                onChange={e => handleChange("phone", e.target.value)}
              />
            </label>

            <label>
              PAN
              <input
                value={form.pan}
                onChange={e => handleChange("pan", e.target.value)}
              />
            </label>
          </div>

          <div className="row">
            <label>
              Department
              <select
                value={form.department}
                onChange={e => handleDepartmentChange(e.target.value)}
              >
                {Object.keys(DEPARTMENT_ROLES).map(dep => (
                  <option key={dep} value={dep}>
                    {dep}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Role
              <select
                value={form.role}
                onChange={e => handleChange("role", e.target.value)}
              >
                {DEPARTMENT_ROLES[form.department].map(role => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="row">
            <label>
              Joining Date
              <input
                type="date"
                value={form.joiningDate}
                onChange={e =>
                  handleChange("joiningDate", e.target.value)
                }
              />
            </label>

            <label>
              Salary (₹)
              <input
                type="number"
                value={form.salary}
                onChange={e => handleChange("salary", e.target.value)}
              />
            </label>
          </div>

          {/* ACTIONS */}
          <div className="form-actions">
            <button type="submit" className="btn primary">
              Save
            </button>
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
