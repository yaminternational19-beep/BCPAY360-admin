import { useEffect, useMemo, useState } from "react";
import "../../../styles/EmployeePanel.css";

import EmployeeListComponent from "../components/EmployeeList";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeFilters from "../components/EmployeeFilters";

import {
  listEmployees,
  getEmployee,
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

      // Handle both flat array and { rows, total } object responses
      const rawEmployees = Array.isArray(res) ? res : (res?.rows || []);

      const normalized = rawEmployees.map(e => ({
        id: e.id,

        employee_code: e.employee_code,
        full_name: e.full_name,
        email: e.email || "",
        phone: e.phone || "-",

        department: e.department_name || "-",
        designation: e.designation_name || "-",
        branch: e.branch_name || "-",
        company: e.company_name || "-",

        joining_date: e.joining_date || null,
        salary: e.salary || 0,

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
  const handleEdit = async (id) => {
    try {
      // 1. Fetch full employee details (including profile/documents)
      const fullEmp = await getEmployee(id);
      if (!fullEmp) return;

      setSelected(fullEmp);
      setShowForm(true);
    } catch (err) {
      alert("Failed to load employee details: " + err.message);
    }
  };

  const handleActivate = async (id) => {
    const emp = employees.find((e) => e.id === id);
    if (!emp) return;

    if (!window.confirm(`Activate ${emp.full_name}?`)) return;

    try {
      // Optimistic update
      setEmployees((prev) =>
        prev.map((e) =>
          e.id === id ? { ...e, is_active: 1 } : e
        )
      );

      // Send nested status update
      await toggleEmployeeStatus(id, "ACTIVE");

      await loadEmployees();
    } catch (err) {
      await loadEmployees();
      alert(err.message || "Failed to activate employee");
    }
  };

  const handleDeactivate = async (id) => {
    const emp = employees.find((e) => e.id === id);
    if (!emp) return;

    if (!window.confirm(`Deactivate ${emp.full_name}?`)) return;

    try {
      // Optimistic update
      setEmployees((prev) =>
        prev.map((e) =>
          e.id === id ? { ...e, is_active: 0 } : e
        )
      );

      // Send nested status update
      await toggleEmployeeStatus(id, "INACTIVE");

      await loadEmployees();
    } catch (err) {
      await loadEmployees();
      alert(err.message || "Failed to deactivate employee");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await deleteEmployee(id);
      loadEmployees();
    } catch (err) {
      alert(err.message || "Failed to delete employee");
    }
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
