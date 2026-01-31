import { useState, useEffect } from "react";
import "../../../styles/Attendance.css";
import ExportActions from "./ExportActions";
import MonthlyAttendanceForm from "./MonthlyAttendanceForm";
import { getDepartments, getShifts } from "../../../api/master.api";
import { useBranch } from "../../../hooks/useBranch"; // Import Hook

const AttendanceHeader = ({
  viewType,          // DAILY | HISTORY
  attendanceMode,    // DAILY | MONTHLY
  onModeChange,

  /* DAILY */
  date,
  onDateChange,

  /* MONTHLY */
  monthRange,
  onMonthChange,

  /* EXPORT */
  onExport,

  /* COMMON */
  onBack,


  /* FILTERS */
  filters,
  onFilterChange,
  isExportDisabled = false
}) => {
  const { branches: branchList, selectedBranch, changeBranch, isSingleBranch } = useBranch();
  const [departmentList, setDepartmentList] = useState([]);
  const [shiftList, setShiftList] = useState([]);

  // Sync selected branch to filters
  useEffect(() => {
    if (selectedBranch) {
      onFilterChange({ ...filters, branchId: selectedBranch });
    }
  }, [selectedBranch]);

  // Sync filter changes back to hook (if user changed it manually)
  useEffect(() => {
    if (filters.branchId && filters.branchId !== selectedBranch) {
      changeBranch(filters.branchId);
    }
  }, [filters.branchId, selectedBranch, changeBranch]);

  // Fetch Departments & Shifts when branch changes
  useEffect(() => {
    if (filters.branchId) {
      const fetchData = async () => {
        try {
          const [deptRes, shiftRes] = await Promise.all([
            getDepartments(filters.branchId),
            getShifts(filters.branchId)
          ]);
          setDepartmentList(deptRes?.data || deptRes || []);
          setShiftList(shiftRes?.data || shiftRes || []);
        } catch (error) {
          console.error("Failed to fetch branch details:", error);
        }
      };
      fetchData();
    } else {
      setDepartmentList([]);
      setShiftList([]);
    }
  }, [filters.branchId]);

  const handleBranchChange = (e) => {
    const branchId = e.target.value;
    onFilterChange({
      ...filters,
      branchId: branchId,
      departmentId: "", // Reset child filters
      shiftId: ""
    });
  };

  const handleReset = () => {
    onFilterChange({
      search: "",
      branchId: "",
      departmentId: "",
      shiftId: "",
      status: ""
    });
  };

  return (
    <div className="attendance-header">
      {/* 1. FILTERS & BACK (START) */}
      <div className="attendance-header-main">
        {viewType === "HISTORY" && (
          <button className="btn-back" onClick={onBack}>
            ← Back
          </button>
        )}

        {/* DAILY FILTERS */}
        {viewType === "DAILY" && attendanceMode === "DAILY" && (
          <div className="attendance-filters">
            <input
              type="text"
              placeholder="Search name / code"
              value={filters.search}
              onChange={(e) =>
                onFilterChange({ ...filters, search: e.target.value })
              }
              className="filter-input"
            />

            <input
              type="date"
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
              className="filter-input"
            />

            {/* Hide Branch Selector if Single Branch Mode */}
            {!isSingleBranch && (
              <select
                value={filters.branchId}
                onChange={handleBranchChange}
                className="filter-select"
              >
                <option value="">All Branches</option>
                {branchList.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.branch_name}
                  </option>
                ))}
              </select>
            )}

            <select
              value={filters.departmentId}
              onChange={(e) =>
                onFilterChange({ ...filters, departmentId: e.target.value })
              }
              className="filter-select"
              disabled={!filters.branchId}
            >
              <option value="">
                {filters.branchId ? "All Departments" : "Select Branch First"}
              </option>
              {departmentList.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.department_name}
                </option>
              ))}
            </select>

            <select
              value={filters.shiftId}
              onChange={(e) =>
                onFilterChange({ ...filters, shiftId: e.target.value })
              }
              className="filter-select"
              disabled={!filters.branchId}
            >
              <option value="">
                {filters.branchId ? "All Shifts" : "Select Branch First"}
              </option>
              {shiftList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.shift_name}
                </option>
              ))}
            </select>

            <select
              value={filters.status}
              onChange={(e) =>
                onFilterChange({ ...filters, status: e.target.value })
              }
              className="filter-select"
            >
              <option value="">All Status</option>
              <option value="PRESENT">Present</option>
              <option value="CHECKED_IN">Checked In</option>
              <option value="UNMARKED">Unmarked</option>
              <option value="ABSENT">Absent</option>
            </select>

            <button className="btn-reset" onClick={handleReset}>
              Reset
            </button>

            <div className="header-divider" />
            <ExportActions context="DAILY" onExport={onExport} disabled={isExportDisabled} />
          </div>
        )}

        {/* MONTHLY FILTERS */}
        {viewType === "DAILY" && attendanceMode === "MONTHLY" && (
          <div className="attendance-filters">
            <input
              type="text"
              placeholder="Search name / code"
              value={filters.search}
              onChange={(e) =>
                onFilterChange({ ...filters, search: e.target.value })
              }
              className="filter-input"
            />

            <MonthlyAttendanceForm value={monthRange} onChange={onMonthChange} />

            {/* Hide Branch Selector if Single Branch Mode */}
            {!isSingleBranch && (
              <select
                value={filters.branchId}
                onChange={handleBranchChange}
                className="filter-select"
              >
                <option value="">All Branches</option>
                {branchList.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.branch_name}
                  </option>
                ))}
              </select>
            )}

            <select
              value={filters.departmentId}
              onChange={(e) =>
                onFilterChange({ ...filters, departmentId: e.target.value })
              }
              className="filter-select"
              disabled={!filters.branchId}
            >
              <option value="">
                {filters.branchId ? "All Departments" : "Select Branch First"}
              </option>
              {departmentList.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.department_name}
                </option>
              ))}
            </select>

            <select
              value={filters.shiftId}
              onChange={(e) =>
                onFilterChange({ ...filters, shiftId: e.target.value })
              }
              className="filter-select"
              disabled={!filters.branchId}
            >
              <option value="">
                {filters.branchId ? "All Shifts" : "Select Branch First"}
              </option>
              {shiftList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.shift_name}
                </option>
              ))}
            </select>

            <button className="btn-reset" onClick={handleReset}>
              Reset
            </button>

            <div className="header-divider" />
            <ExportActions context="MONTHLY" onExport={onExport} disabled={isExportDisabled} />
          </div>
        )}

        {/* HISTORY VIEW */}
        {viewType === "HISTORY" && (
          <div className="attendance-filters">
            <ExportActions context="HISTORY" onExport={onExport} />
          </div>
        )}
      </div>

      {/* 2. MODE TOGGLE (LAST - END) */}
      {viewType === "DAILY" && (
        <div className="attendance-mode-toggle">
          <button
            className={`mode-btn ${attendanceMode === "DAILY" ? "active" : ""}`}
            onClick={() => onModeChange("DAILY")}
          >
            Daily
          </button>
          <button
            className={`mode-btn ${attendanceMode === "MONTHLY" ? "active" : ""
              }`}
            onClick={() => onModeChange("MONTHLY")}
          >
            Monthly
          </button>
        </div>
      )}
    </div>
  );
};

export default AttendanceHeader;
