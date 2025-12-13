import React, { useEffect, useState } from "react";
import "../styles/EmployeeForm.css";

const empty = {
  name: "", email: "", phone: "", department: "HR", role: "Employee", joiningDate: "", salary: "", pan: ""
};

const EmployeeForm = ({ initial, onClose, onSave }) => {
  const [form, setForm] = useState(initial || empty);

  useEffect(()=> {
    setForm(initial || empty);
  }, [initial]);

  const handleChange = (k,v) => setForm(prev => ({...prev, [k]: v}));

  const submit = (e) => {
    e.preventDefault();
    // basic validation
    if (!form.name || !form.email) return alert("Name and email required");
    onSave({
      ...form,
      salary: Number(form.salary) || 0,
      joiningDate: form.joiningDate || new Date().toISOString().slice(0,10)
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h3>{form.id ? "Edit Employee" : "Add Employee"}</h3>
          <button onClick={onClose}>✕</button>
        </div>
        <form className="emp-form" onSubmit={submit}>
          <div className="row">
            <label>Name<input value={form.name} onChange={e=>handleChange("name", e.target.value)} /></label>
            <label>Email<input value={form.email} onChange={e=>handleChange("email", e.target.value)} /></label>
          </div>
          <div className="row">
            <label>Phone<input value={form.phone} onChange={e=>handleChange("phone", e.target.value)} /></label>
            <label>PAN<input value={form.pan} onChange={e=>handleChange("pan", e.target.value)} /></label>
          </div>
          <div className="row">
            <label>Department
              <select value={form.department} onChange={e=>handleChange("department", e.target.value)}>
                <option>HR</option><option>Finance</option><option>IT</option><option>Sales</option><option>Operations</option><option>Marketing</option><option>Support</option>
              </select>
            </label>
            <label>Role
              <select value={form.role} onChange={e=>handleChange("role", e.target.value)}>
                <option>Employee</option><option>Admin</option><option>HR Manager</option><option>Team Lead</option><option>Accountant</option><option>Developer</option>
              </select>
            </label>
          </div>
          <div className="row">
            <label>Joining Date<input type="date" value={form.joiningDate} onChange={e=>handleChange("joiningDate", e.target.value)} /></label>
            <label>Salary (₹)<input type="number" value={form.salary} onChange={e=>handleChange("salary", e.target.value)} /></label>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn primary">Save</button>
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
