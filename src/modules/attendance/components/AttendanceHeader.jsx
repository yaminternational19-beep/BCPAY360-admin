import "../../../styles/Attendance.css";

const AttendanceHeader = ({
  viewType,
  attendanceMode,
  onModeChange,
  date,
  onDateChange,
  onBack,
  filters = {
    search: "",
    departmentId: "",
    shiftId: "",
    status: ""
  },
  onFilterChange
}) => {
  return (
    <div className="attendance-header">
      {/* LEFT */}
      <div className="attendance-header-left">
        {viewType === "HISTORY" && (
          <button className="btn-back" onClick={onBack}>
            ← Back
          </button>
        )}
        <h2>Attendance</h2>
      </div>

      {/* RIGHT */}
      <div className="attendance-header-right">
        {/* MODE TOGGLE */}
        <div className="attendance-mode-toggle">
          <button
            className={`mode-btn ${attendanceMode === "DAILY" ? "active" : ""}`}
            onClick={() => onModeChange("DAILY")}
          >
            Daily
          </button>
          <button
            className={`mode-btn ${attendanceMode === "MONTHLY" ? "active" : ""}`}
            onClick={() => onModeChange("MONTHLY")}
          >
            Monthly
          </button>
        </div>

        {/* FILTERS (Daily only) */}
        {viewType === "DAILY" && attendanceMode === "DAILY" && (
          <div className="attendance-filters">
            <input
              type="text"
              placeholder="Search by name / code"
              value={filters.search || ""}
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

            <select
              value={filters.departmentId || ""}
              onChange={(e) =>
                onFilterChange({ ...filters, departmentId: e.target.value })
              }
              className="filter-select"
            >
              <option value="">All Departments</option>
            </select>

            <select
              value={filters.shiftId || ""}
              onChange={(e) =>
                onFilterChange({ ...filters, shiftId: e.target.value })
              }
              className="filter-select"
            >
              <option value="">All Shifts</option>
            </select>

            <select
              value={filters.status || ""}
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

            <button
              className="btn-reset"
              onClick={() =>
                onFilterChange({
                  search: "",
                  departmentId: "",
                  shiftId: "",
                  status: ""
                })
              }
            >
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceHeader;
