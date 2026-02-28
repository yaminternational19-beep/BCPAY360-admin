import React, { useEffect, useMemo, useState } from "react";
import "../../../styles/AddHR.css";
import {
  getHRList,
  toggleHRStatus,
  deleteHR,
} from "../../../api/master.api";
import { useBranch } from "../../../hooks/useBranch";
import { useToast } from "../../../context/ToastContext";
import HRForm from "./HRForm";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { FaEdit, FaUserLock, FaPowerOff, FaTrash } from "react-icons/fa";

export default function HRList() {
  const toast = useToast();
  const user = JSON.parse(localStorage.getItem("auth_user"));
  const navigate = useNavigate();

  if (user?.role !== "COMPANY_ADMIN") {
    return <p className="hint">Access denied</p>;
  }

  // USE GLOBAL BRANCH CONTEXT
  const {
    branches,
    selectedBranch,
    changeBranch,
  } = useBranch();

  const [hrs, setHrs] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingHR, setEditingHR] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    status: "ALL",
  });

  /* =========================
     LOAD DATA
  ========================= */
  const loadHRs = async () => {
    try {
      const res = await getHRList();
      setHrs(res?.data || []);
    } catch (err) {
      toast.error("Failed to load HR profiles");
    }
  };

  useEffect(() => {
    loadHRs();
  }, []);

  /* =========================
     FILTERING
  ========================= */
  const filteredHRs = useMemo(() => {
    return hrs.filter((hr) => {
      // Filter by Global Selected Branch
      if (
        selectedBranch &&
        Number(hr.branch_id) !== Number(selectedBranch)
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
  }, [hrs, filters, selectedBranch]);

  /* =========================
     EXPORT
  ========================= */
  const exportToExcel = () => {
    if (!selectedIds.length) {
      return toast.info("Please select the HR profiles you want to export");
    }

    const dataToExport = filteredHRs.filter((hr) =>
      selectedIds.includes(hr.id)
    );

    if (!dataToExport.length) {
      return toast.info("No selected data matching current filters available to export");
    }

    const rows = dataToExport.map((hr) => ({
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

    XLSX.writeFile(workbook, "Selected_HR_List.xlsx");
    toast.success(`${dataToExport.length} HR records exported successfully`);
  };

  const handleToggle = async (hr) => {
    try {
      await toggleHRStatus(hr.id);
      toast.success(`HR ${hr.is_active ? "disabled" : "enabled"} successfully`);
      loadHRs();
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this HR profile? This action cannot be undone.")) return;
    try {
      await deleteHR(id);
      toast.success("HR profile deleted successfully");
      loadHRs();
    } catch (err) {
      toast.error("Deletion failed");
    }
  };

  const [selectedIds, setSelectedIds] = useState([]);

  /* =========================
     SELECTION LOGIC
  ========================= */
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredHRs.map((hr) => hr.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="add-hr-page">
      <div className="page-header">
        <h2>HR Management</h2>
        <div className="header-actions" style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button
            className="primary"
            style={{ width: "fit-content", whiteSpace: "nowrap" }}
            onClick={() => {
              setEditingHR(null);
              setShowForm(true);
            }}
          >
            Add HR
          </button>
          <button className="secondary" onClick={exportToExcel} style={{ width: "fit-content", whiteSpace: "nowrap" }}>
            Export Excel
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="filter-bar">
        <select
          value={selectedBranch === null ? "ALL" : selectedBranch}
          onChange={(e) => {
            const val = e.target.value;
            changeBranch(val === "ALL" ? null : Number(val));
          }}
        >
          {branches.length > 1 && (
            <option value="ALL">All Branches</option>
          )}
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
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      {/* HR TABLE */}
      <table className="table">
        <thead>
          <tr>
            <th className="th-checkbox">
              <input
                type="checkbox"
                checked={filteredHRs.length > 0 && selectedIds.length === filteredHRs.length}
                onChange={handleSelectAll}
              />
            </th>
            <th>HR Code</th>
            <th>Name</th>
            <th>Branch</th>
            <th>Joining Date</th>
            <th>Phone</th>
            <th className="th-actions">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredHRs.map((hr) => (
            <tr key={hr.id}>
              {/* Checkbox */}
              <td className="td-checkbox">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(hr.id)}
                  onChange={() => handleSelectRow(hr.id)}
                />
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
                  ? new Intl.DateTimeFormat("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }).format(new Date(hr.joining_date))
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

                <button onClick={() => handleToggle(hr)}>
                  <FaPowerOff /> {hr.is_active ? "Disable" : "Enable"}
                </button>

                <button
                  className="danger"
                  onClick={() => handleDelete(hr.id)}
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
