import { useEffect, useMemo, useState } from "react";
import "../styles/EmployeePanel.css";

import EmployeeList from "../components/EmployeeList";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeFilters from "../components/EmployeeFilters";

import {
  getEmployees,
  createEmployee,
  updateEmployee,
  // add these later when APIs are ready
  // activateEmployee,
  // deactivateEmployee,
  // deleteEmployee,
} from "../api/employees.api";

import { getDepartments } from "../api/master.api";

const EmployeePanel = () => {
  const user = JSON.parse(localStorage.getItem("auth_user"));

  const isCompanyAdmin = user?.role === "COMPANY_ADMIN";
  const hrDepartment = user?.department || null;

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);

  /* =========================
     LOAD EMPLOYEES (DB DATA)
  ========================= */
  const loadEmployees = async () => {
    try {
      const res = await getEmployees("?page=1&limit=50");
      setEmployees(res?.employees || []);
    } catch (err) {
      console.error("❌ Load employees failed:", err.message);
    }
  };

  /* =========================
     LOAD DEPARTMENTS
  ========================= */
  const loadDepartments = async () => {
    try {
      const res = await getDepartments();
      setDepartments(res || []);
    } catch (err) {
      console.error("❌ Load departments failed:", err.message);
    }
  };

  useEffect(() => {
    loadEmployees();
    loadDepartments();
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
    console.log("Activate employee:", id);
    // await activateEmployee(id);
    loadEmployees();
  };

  const handleDeactivate = async (id) => {
    console.log("Deactivate employee:", id);
    // await deactivateEmployee(id);
    loadEmployees();
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

        <EmployeeList
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
          departments={departments}
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

export default EmployeePanel;
