import React, { useEffect, useMemo, useState } from "react";
import "../../../styles/AddHR.css";
import {
  getHRList,
  toggleHRStatus,
  deleteHR,
  getBranches,
  getDepartments,
} from "../../../api/master.api";
import HRForm from "./HRForm";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

export default function HRList() {
  const user = JSON.parse(localStorage.getItem("auth_user"));
  const navigate = useNavigate();

  if (user?.role !== "COMPANY_ADMIN") {
    return <p className="hint">Access denied</p>;
  }

  const [hrs, setHrs] = useState([]);
  const [branches, setBranches] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingHR, setEditingHR] = useState(null);

  const [filters, setFilters] = useState({
    branch_id: "",
    department_id: "",
    search: "",
    status: "ALL",
  });

  /* =========================
     LOAD DATA
  ========================= */
  const loadHRs = async () => {
    const data = await getHRList();
    setHrs(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadHRs();
    getBranches().then(setBranches);
  }, []);

  useEffect(() => {
    if (!filters.branch_id) {
      setDepartments([]);
      return;
    }
    getDepartments(filters.branch_id).then(setDepartments);
  }, [filters.branch_id]);

  /* =========================
     FILTERING (CLEAN)
  ========================= */
  const filteredHRs = useMemo(() => {
    return hrs.filter((hr) => {
      if (
        filters.branch_id &&
        Number(hr.branch_id) !== Number(filters.branch_id)
      )
        return false;

      if (
        filters.department_id &&
        Number(hr.department_id) !== Number(filters.department_id)
      )
        return false;

      if (
        filters.search &&
        !hr.emp_id.toLowerCase().includes(filters.search.toLowerCase())
      )
        return false;

      if (filters.status !== "ALL") {
        const active = filters.status === "ACTIVE";
        if (Boolean(hr.is_active) !== active) return false;
      }

      return true;
    });
  }, [hrs, filters]);

  /* =========================
     EXPORT
  ========================= */
  const exportToExcel = () => {
    const rows = filteredHRs.map((hr) => ({
      "Emp ID": hr.emp_id,
      Branch: hr.branch_name,
      Department: hr.department_name,
      Status: hr.is_active ? "Active" : "Inactive",
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "HRs");

    XLSX.writeFile(workbook, "HR_List.xlsx");
  };

  return (
    <div className="add-hr-page">
      <div className="page-header">
        <h2>HR Management</h2>
        <div className="header-actions">
          <button
            className="primary"
            onClick={() => {
              setEditingHR(null);
              setShowForm(true);
            }}
          >
            Add HR
          </button>
          <button className="secondary" onClick={exportToExcel}>
            Export Excel
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="filter-bar">
        <select
          value={filters.branch_id}
          onChange={(e) =>
            setFilters((p) => ({
              ...p,
              branch_id: e.target.value,
              department_id: "",
            }))
          }
        >
          <option value="">All Branches</option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.branch_name}
            </option>
          ))}
        </select>

        <select
          value={filters.department_id}
          disabled={!filters.branch_id}
          onChange={(e) =>
            setFilters((p) => ({ ...p, department_id: e.target.value }))
          }
        >
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.department_name}
            </option>
          ))}
        </select>

        <input
          placeholder="Search by Emp ID"
          value={filters.search}
          onChange={(e) =>
            setFilters((p) => ({ ...p, search: e.target.value }))
          }
        />

        <select
          value={filters.status}
          onChange={(e) =>
            setFilters((p) => ({ ...p, status: e.target.value }))
          }
        >
          <option value="ALL">All</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      {/* HR TABLE */}
      <table className="table">
        <thead>
          <tr>
            <th>Emp ID</th>
            <th>Branch</th>
            <th>Department</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredHRs.map((hr) => (
            <tr key={hr.id}>
              <td>{hr.emp_id}</td>
              <td>{hr.branch_name}</td>
              <td>{hr.department_name}</td>
              <td>{hr.is_active ? "Active" : "Inactive"}</td>
              <td className="row-actions">
                <button
                  onClick={() => {
                    setEditingHR(hr);
                    setShowForm(true);
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    navigate(`/admin/hr/${hr.id}/permissions`)
                  }
                >
                  Permissions
                </button>

                <button
                  onClick={async () => {
                    await toggleHRStatus(hr.id);
                    loadHRs();
                  }}
                >
                  {hr.is_active ? "Disable" : "Enable"}
                </button>

                <button
                  className="danger"
                  onClick={async () => {
                    if (!confirm("Delete this HR?")) return;
                    await deleteHR(hr.id);
                    loadHRs();
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {!filteredHRs.length && (
            <tr>
              <td colSpan={5} className="empty-state">
                No HRs found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* FORM MODAL */}
      {showForm && (
        <HRForm
          initialData={editingHR}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            loadHRs();
          }}
        />
      )}
    </div>
  );
}
