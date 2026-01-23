import { useEffect, useState, useCallback, useMemo } from "react";
import "../styles/EmployeePanel.css";
import EmployeeListComponent from "../components/EmployeeList";
import EmployeeForm from "../components/EmployeeForm";
import { useToast } from "../../../context/ToastContext";
import {
  listEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployeeById,
  activateEmployeeById,
  deleteEmployeeById,
} from "../../../api/employees.api";
import {
  getBranches,
  getDepartments,
  getDesignations,
  getShifts,
  getEmployeeTypes
} from "../../../api/master.api";
import { Search, Download, Filter, RotateCcw } from "lucide-react";

const EmployeeListPage = () => {
  const toast = useToast();
  const user = JSON.parse(localStorage.getItem("auth_user"));
  const isCompanyAdmin = user?.role === "COMPANY_ADMIN";

  // Data State
  const [employees, setEmployees] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [togglingIds, setTogglingIds] = useState(new Set());

  // Filter States
  const [search, setSearch] = useState("");
  const [branchId, setBranchId] = useState("");
  const [deptId, setDeptId] = useState("");
  const [desigId, setDesigId] = useState("");
  const [shiftId, setShiftId] = useState("");
  const [typeId, setTypeId] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState("employee_code");

  // Selection State (Restored for production level)
  const [selectedIds, setSelectedIds] = useState([]);

  // Pagination State
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Master Data Options
  const [branches, setBranches] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [employeeTypes, setEmployeeTypes] = useState([]);

  // Form State
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);

  /* ===================================================================================
     INITIAL LOAD
     =================================================================================== */
  useEffect(() => {
    getBranches()
      .then(res => setBranches(Array.isArray(res) ? res : res.data || []))
      .catch(err => console.error("Failed to load branches", err));
  }, []);

  /* ===================================================================================
     CASCADING LOGIC & RESET
     =================================================================================== */
  // Branch -> Depts, Shifts, Types
  useEffect(() => {
    if (!branchId) {
      setDepartments([]);
      setShifts([]);
      setEmployeeTypes([]);
      setDeptId("");
      setDesigId("");
      setShiftId("");
      setTypeId("");
      return;
    }
    // Explicitly reset children when branch changes
    setDeptId("");
    setDesigId("");
    setShiftId("");
    setTypeId("");

    Promise.all([
      getDepartments(branchId),
      getShifts(branchId),
      getEmployeeTypes(branchId)
    ]).then(([depts, shfts, types]) => {
      setDepartments(Array.isArray(depts) ? depts : []);
      setShifts(Array.isArray(shfts) ? shfts : []);
      setEmployeeTypes(Array.isArray(types) ? types : []);
    }).catch(err => console.error("Cascade Error Level 1:", err));
  }, [branchId]);

  // Dept -> Designations
  useEffect(() => {
    if (!deptId || !branchId) {
      setDesignations([]);
      setDesigId("");
      return;
    }
    // Explicitly reset designation when department changes
    setDesigId("");

    getDesignations(branchId, deptId)
      .then(res => setDesignations(Array.isArray(res) ? res : []))
      .catch(err => console.error("Designations Error:", err));
  }, [deptId, branchId]);

  /* ===================================================================================
     DATA FETCHING & PAGINATION SYNC
     =================================================================================== */
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const offset = (page - 1) * pageSize;
      const params = {
        limit: pageSize,
        offset,
        branch_id: branchId || undefined,
        department_id: deptId || undefined,
        designation_id: desigId || undefined,
        shift_id: shiftId || undefined,
        employee_type_id: typeId || undefined,
        search: search || undefined,
        status: status || undefined,
        sort_by: sortBy,
      };

      const res = await listEmployees(params);

      if (res && res.rows) {
        setEmployees(res.rows);
        setTotal(res.total || 0);
      } else if (Array.isArray(res)) {
        setEmployees(res);
        setTotal(res.length);
      } else {
        setEmployees([]);
        setTotal(0);
      }
    } catch (err) {
      toast.error("API Error: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [page, branchId, deptId, desigId, shiftId, typeId, search, status, sortBy, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Mandatory: Reset page AND selection when filters or search change
  useEffect(() => {
    setPage(1);
    setSelectedIds([]);
  }, [branchId, deptId, desigId, shiftId, typeId, search, status, sortBy]);

  // Mandatory: Clear selection when page changes
  useEffect(() => {
    setSelectedIds([]);
  }, [page]);

  /* ===================================================================================
     ACTION HANDLERS
     =================================================================================== */
  const handleClearFilters = () => {
    setSearch("");
    setBranchId("");
    setDeptId("");
    setDesigId("");
    setShiftId("");
    setTypeId("");
    setStatus("");
    setSortBy("employee_code");
    setPage(1);
    setSelectedIds([]);
  };

  const handleSave = async (payload) => {
    try {
      if (selected) {
        const id = selected.employee?.id || selected.id;
        await updateEmployeeById(id, payload);
        toast.success("Employee updated successfully");
      } else {
        await createEmployee(payload);
        toast.success("Employee created successfully");
      }
      setShowForm(false);
      setSelected(null);
      loadData();
    } catch (err) {
      toast.error(err.message || "Failed to save employee");
      throw err;
    }
  };

  const handleEdit = async (id) => {
    try {
      const fullEmp = await getEmployeeById(id);
      if (!fullEmp) return;
      setSelected(fullEmp);
      setShowForm(true);
    } catch (err) {
      toast.error("Failed to load details: " + err.message);
    }
  };

  const handleActivate = async (id) => {
    if (!window.confirm("Activate employee account?")) return;
    setTogglingIds(prev => new Set(prev).add(id));
    try {
      await activateEmployeeById(id);
      toast.success("Employee account activated");
      loadData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setTogglingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm("Deactivate employee account?")) return;
    setTogglingIds(prev => new Set(prev).add(id));
    try {
      await deleteEmployeeById(id);
      toast.success("Employee account deactivated");
      loadData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setTogglingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete employee permanently? This action is irreversible.")) return;
    setTogglingIds(prev => new Set(prev).add(id));
    try {
      await deleteEmployeeById(id, true);
      toast.success("Employee permanently deleted");
      loadData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setTogglingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const stats = useMemo(() => ({
    total: total,
    active: status === "" ? employees.filter(e => String(e.employee_status).toUpperCase() === "ACTIVE").length : (status === "ACTIVE" ? total : 0),
    inactive: status === "" ? employees.filter(e => String(e.employee_status).toUpperCase() !== "ACTIVE").length : (status === "INACTIVE" ? total : 0)
  }), [employees, total, status]);

  return (
    <div className="employee-panel">
      {/* HEADER */}
      <div className="employee-header">
        <h2>Employee Management</h2>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => { setSelected(null); setShowForm(true); }}>
            Add Employee
          </button>
          <div className="stat-mini"><span>Total</span><strong>{stats.total}</strong></div>
          <div className="stat-mini"><span>Active</span><strong>{stats.active}</strong></div>
          <div className="stat-mini"><span>Inactive</span><strong>{stats.inactive}</strong></div>
        </div>
      </div>

      <div className="employee-body">

        {/* BACKEND-DRIVEN FILTERS */}
        <div className="backend-filters-container">
          <div className="filters-header">
            <Filter size={16} />
            <span>Employee Filters</span>
          </div>

          <div className="filters-grid-new">
            <div className="filter-input-group">
              <Search size={14} className="search-ico" />
              <input
                type="text"
                placeholder="Search Emp Code / Name / Email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <select value={branchId} onChange={e => setBranchId(e.target.value)}>
              <option value="">All Branches</option>
              {branches.map(b => <option key={b.id} value={b.id}>{b.branch_name}</option>)}
            </select>

            <select value={deptId} onChange={e => setDeptId(e.target.value)} disabled={!branchId}>
              <option value="">All Departments</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.department_name}</option>)}
            </select>

            <select value={desigId} onChange={e => setDesigId(e.target.value)} disabled={!deptId}>
              <option value="">All Designations</option>
              {designations.map(d => <option key={d.id} value={d.id}>{d.designation_name}</option>)}
            </select>

            <select value={shiftId} onChange={e => setShiftId(e.target.value)} disabled={!branchId}>
              <option value="">All Shifts</option>
              {shifts.map(s => <option key={s.id} value={s.id}>{s.shift_name}</option>)}
            </select>

            <select value={typeId} onChange={e => setTypeId(e.target.value)} disabled={!branchId}>
              <option value="">All Employee Types</option>
              {employeeTypes.map(t => <option key={t.id} value={t.id}>{t.employee_type_name}</option>)}
            </select>

            <select value={status} onChange={e => setStatus(e.target.value)}>
              <option value="">All Status</option>
              <option value="ACTIVE">Active Only</option>
              <option value="INACTIVE">Inactive Only</option>
            </select>

            <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="employee_code">Sort: Emp Code</option>
              <option value="name">Sort: Name</option>
              <option value="salary">Sort: Salary</option>
            </select>

            <div className="filter-actions-new">
              <button className="btn-reset" onClick={handleClearFilters} title="Reset All Filters">
                <RotateCcw size={14} /> Clear
              </button>
              <button className="btn-export-new" onClick={handleClearFilters} title="Export Employees">
                <Download size={14} /> Export
              </button>
            </div>
          </div>
        </div>

        <EmployeeListComponent
          employees={employees}
          total={total}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          togglingIds={togglingIds}
          loading={loading}
          selectedIds={selectedIds}
          onSelectOne={(id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
          onSelectAll={(ids) => setSelectedIds(ids)}
          onEdit={handleEdit}
          onActivate={handleActivate}
          onDeactivate={handleDeactivate}
          onDelete={handleDelete}
        />
      </div>

      {showForm && (
        <EmployeeForm
          initial={selected}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setSelected(null); }}
        />
      )}
    </div>
  );
};

export default EmployeeListPage;
