import { useEffect, useMemo, useState } from "react";
import "../../../styles/EmployeePanel.css";

import EmployeeListComponent from "../components/EmployeeList";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeFilters from "../components/EmployeeFilters";

import {
  listEmployees,
  createEmployee,
  updateEmployee,
  toggleEmployeeStatus,
} from "../../../api/employees.api";




const EmployeeList = () => {
  const user = JSON.parse(localStorage.getItem("auth_user"));

  const isCompanyAdmin = user?.role === "COMPANY_ADMIN";
  const hrDepartment = user?.department || null;

  const [employees, setEmployees] = useState([]);

  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);

  /* =========================
     LOAD EMPLOYEES (DB DATA)
  ========================= */
const loadEmployees = async () => {
    try {
      const res = await listEmployees({ page: 1, limit: 50 });

      const normalized = (Array.isArray(res) ? res : []).map(e => ({
        id: e.id,

        employee_code: e.employee_code,
        full_name: e.full_name,
        email: e.email || "",
        phone: e.phone || "-",               // backend not sending yet

        department: e.department_name || "-",
        designation: e.designation_name || "-",
        branch: e.branch_name || "-",
        company: e.company_name || "-",

        joining_date: e.joining_date || null, // backend not sending yet
        salary: e.salary || 0,                 // backend not sending yet

        is_active: e.employee_status === "ACTIVE" ? 1 : 0,
      }));

      setEmployees(normalized);
    } catch (err) {
      console.error("❌ Load employees failed:", err.message);
    }
  };



  useEffect(() => {
    loadEmployees();
  }, []);

  /* =========================
     ROLE-BASED VISIBILITY
  ========================= */
  const visibleEmployees = useMemo(() => {
    if (isCompanyAdmin) return employees;

    // HR → only their department
    return employees.filter(
      (e) => e.department === hrDepartment
    );
  }, [employees, isCompanyAdmin, hrDepartment]);

  /* =========================
     CREATE / UPDATE
  ========================= */
  const handleSave = async (payload) => {
    try {
      if (selected) {
        await updateEmployee(selected.id, payload); // DB ID
      } else {
        await createEmployee(payload);
      }

      setShowForm(false);
      setSelected(null);
      loadEmployees();
    } catch (err) {
      alert(err.message);
    }
  };

  /* =========================
     ACTION HANDLERS
  ========================= */
  const handleEdit = (id) => {
    const emp = employees.find((e) => e.id === id);
    if (!emp) return;

    setSelected(emp);
    setShowForm(true);
  };

  const handleActivate = async (id) => {
    const emp = employees.find((e) => e.id === id);
    if (!emp) return;

    // Confirm action
    if (!window.confirm(`Activate ${emp.full_name}?`)) return;

    try {
      // Optimistic update - update UI immediately
      setEmployees((prev) =>
        prev.map((e) =>
          e.id === id ? { ...e, is_active: 1 } : e
        )
      );

      // Update in database
      await updateEmployee(id, { is_active: 1 });

      // Reload to ensure sync with server
      await loadEmployees();
    } catch (err) {
      // Revert on error
      await loadEmployees();
      alert(err.message || "Failed to activate employee");
    }
  };

  const handleDeactivate = async (id) => {
    const emp = employees.find((e) => e.id === id);
    if (!emp) return;

    // Confirm action
    if (!window.confirm(`Deactivate ${emp.full_name}? This will set their status to inactive.`)) return;

    try {
      // Optimistic update - update UI immediately
      setEmployees((prev) =>
        prev.map((e) =>
          e.id === id ? { ...e, is_active: 0 } : e
        )
      );

      // Update in database
      await updateEmployee(id, { is_active: 0 });

      // Reload to ensure sync with server
      await loadEmployees();
    } catch (err) {
      // Revert on error
      await loadEmployees();
      alert(err.message || "Failed to deactivate employee");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    console.log("Delete employee:", id);
    // await deleteEmployee(id);
    loadEmployees();
  };

  /* =========================
     STATS (DB FIELDS)
  ========================= */
  const stats = useMemo(
    () => ({
      total: visibleEmployees.length,
      active: visibleEmployees.filter(
        (e) => Number(e.is_active) === 1
      ).length,
      inactive: visibleEmployees.filter(
        (e) => Number(e.is_active) === 0
      ).length,
    }),
    [visibleEmployees]
  );

  return (
    <div className="employee-panel">
      {/* HEADER */}
      <div className="employee-header">
        <h2>Employee Management</h2>

        <div className="header-actions">
          <button
            className="btn"
            onClick={() => {
              setSelected(null);
              setShowForm(true);
            }}
          >
            Add Employee
          </button>

          <div className="stat-mini">
            <span>Total</span>
            <strong>{stats.total}</strong>
          </div>

          <div className="stat-mini">
            <span>Active</span>
            <strong>{stats.active}</strong>
          </div>

          <div className="stat-mini">
            <span>Inactive</span>
            <strong>{stats.inactive}</strong>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="employee-body">
        <EmployeeFilters />

        <EmployeeListComponent
          employees={visibleEmployees}
          onEdit={handleEdit}
          onActivate={handleActivate}
          onDeactivate={handleDeactivate}
          onDelete={handleDelete}
          isAdmin={isCompanyAdmin}
        />
      </div>

      {/* FORM */}
      {showForm && (
        <EmployeeForm
          initial={selected}

          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setSelected(null);
          }}
        />
      )}
    </div>
  );
};

export default EmployeeList;
