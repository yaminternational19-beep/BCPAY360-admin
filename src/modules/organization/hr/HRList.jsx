import React, { useEffect, useMemo, useState } from "react";
import "../../../styles/AddHR.css";
import {
  getHRList,
  toggleHRStatus,
  deleteHR,
  getBranches,
} from "../../../api/master.api";
import HRForm from "./HRForm";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { FaEdit, FaUserLock, FaPowerOff, FaTrash } from "react-icons/fa";

export default function HRList() {
  const user = JSON.parse(localStorage.getItem("auth_user"));
  const navigate = useNavigate();

  if (user?.role !== "COMPANY_ADMIN") {
    return <p className="hint">Access denied</p>;
  }

  const [hrs, setHrs] = useState([]);
  const [branches, setBranches] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingHR, setEditingHR] = useState(null);

  const [filters, setFilters] = useState({
    branch_id: "",
    search: "",
    status: "ALL",
  });

  /* =========================
     LOAD DATA
  ========================= */
  const loadHRs = async () => {
    const res = await getHRList();
    setHrs(res?.data || []);
  };

  useEffect(() => {
    loadHRs();
    getBranches().then(setBranches);
  }, []);

  /* =========================
     FILTERING
  ========================= */
  const filteredHRs = useMemo(() => {
    return hrs.filter((hr) => {
      if (
        filters.branch_id &&
        Number(hr.branch_id) !== Number(filters.branch_id)
      ) {
        return false;
      }

      if (filters.search) {
        const s = filters.search.toLowerCase();
        const match =
          hr.hr_code?.toLowerCase().includes(s) ||
          hr.full_name?.toLowerCase().includes(s) ||
          hr.email?.toLowerCase().includes(s) ||
          hr.phone?.includes(s);

        if (!match) return false;
      }

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
      "HR Code": hr.hr_code,
      "Full Name": hr.full_name,
      Email: hr.email,
      Phone: hr.phone,
      Branch: hr.branch_name,
      Status: hr.is_active ? "Active" : "Inactive",
      "Joining Date": hr.joining_date,
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
            setFilters((p) => ({ ...p, branch_id: e.target.value }))
          }
        >
          <option value="">All Branches</option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.branch_name}
            </option>
          ))}
        </select>

        <input
          placeholder="Search HR code / name / email / phone"
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
            <th>
              <input type="checkbox" disabled />
            </th>
            <th>HR Code</th>
            <th>Name</th>
            <th>Branch</th>
            <th>Joining Date</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredHRs.map((hr) => (
            <tr key={hr.id}>
              {/* Checkbox */}
              <td>
                <input type="checkbox" />
              </td>

              {/* HR Code */}
              <td>
                {hr.hr_code || <span className="muted">—</span>}
              </td>

              {/* Name */}
              <td>{hr.full_name}</td>

              {/* Branch */}
              <td>{hr.branch_name}</td>

              {/* Joining Date */}
              <td>
                {hr.joining_date
                  ? new Date(hr.joining_date).toLocaleDateString()
                  : "—"}
              </td>

              {/* Phone */}
              <td>{hr.phone}</td>

              {/* Actions */}
              <td className="row-actions">
                <button
                  onClick={() => {
                    setEditingHR(hr);
                    setShowForm(true);
                  }}
                >
                  <FaEdit /> Edit
                </button>

                <button
  onClick={() => navigate(`/hr-management/${hr.id}/permissions`)}

>
  <FaUserLock /> Permissions
</button>


                <button
                  onClick={async () => {
                    await toggleHRStatus(hr.id);
                    loadHRs();
                  }}
                >
                  <FaPowerOff /> {hr.is_active ? "Disable" : "Enable"}
                </button>

                <button
                  className="danger"
                  onClick={async () => {
                    if (!confirm("Delete this HR?")) return;
                    await deleteHR(hr.id);
                    loadHRs();
                  }}
                >
                  <FaTrash /> Delete
                </button>
              </td>
            </tr>
          ))}

          {!filteredHRs.length && (
            <tr>
              <td colSpan={7} className="empty-state">
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
