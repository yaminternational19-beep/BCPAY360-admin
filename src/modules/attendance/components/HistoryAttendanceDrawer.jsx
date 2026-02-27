import "../../../styles/Attendance.css";
import MonthlyAttendanceForm from "./MonthlyAttendanceForm";
import { X } from "lucide-react";

const statusLabelMap = {
  PRESENT: "Present",
  ABSENT: "Absent",
  CHECKED_IN: "Checked In",
  UNMARKED: "Unmarked",
  LEAVE: "Leave",
  H: "Holiday",
  "-": "N/A"
};

const getStatusClass = (status) => {
  if (!status) return "neutral";
  if (status === "-") return "neutral";
  if (status === "H") return "holiday";
  return status.toLowerCase();
};

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
};

const HistoryAttendanceDrawer = ({ data, loading, onRefresh, onClose }) => {
  if (!data && !loading) return null;

  const employee = data?.employee || {};
  const rows = data?.data || [];

  return (
    <div className={`history-drawer ${loading ? 'opacity-50' : ''}`}>
      {/* ===========================
          HEADER SECTION
      =========================== */}
      <div className="history-header-new">
        <div className="profile-section">
          <div className="profile-avatar-wrapper">
            <img
              src={employee.profile_photo_url || employee.profile_photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name || "User")}&background=EFF6FF&color=3B82F6&bold=true`}
              alt={employee.name}
              className="employee-avatar-large"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name || "User")}&background=F1F5F9&color=64748B&bold=true`;
              }}
            />
            <span className={`status-pill-floating ${employee.status?.toUpperCase() === "ACTIVE" ? "pill-active" : "pill-inactive"}`}>
              {employee.status}
            </span>
          </div>

          <div className="profile-info-main">
            <h2>{employee.name}</h2>
            <span className="code-badge">{employee.code}</span>
            <div className="quick-meta">
              <span><strong>Dept:</strong> {employee.department}</span>
              <span><strong>Shift:</strong> {employee.shift}</span>
            </div>
          </div>
        </div>

        <div className="history-controls">
          <div className="filter-card">
            <div className="filter-card-label">View History For</div>
            <MonthlyAttendanceForm
              onChange={(range) => {
                if (onRefresh) {
                  onRefresh(range.fromDate, range.toDate);
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* ===========================
          TABLE
      =========================== */}
      <div className="history-table-wrapper">
        {loading && <div className="drawer-table-overlay">Loading...</div>}
        <table className="attendance-table sticky-header">
          <thead>
            <tr>
              <th>Date</th>
              <th>Shift</th>
              <th>Status</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Late (min)</th>
              <th>Early Out (min)</th>
              <th>Overtime (min)</th>
            </tr>
          </thead>

          <tbody>
            {rows?.length ? (
              rows.map((row, idx) => (
                <tr key={idx}>
                  <td title={row.date}>
                    {formatDate(row.date)}
                  </td>

                  <td>
                    <div className="shift-cell">
                      <span>{row.shift_name}</span>
                      {row.shift_start_time && row.shift_end_time && (
                        <small>
                          {row.shift_start_time} – {row.shift_end_time}
                        </small>
                      )}
                    </div>
                  </td>

                  <td>
                    <span
                      className={`status-badge ${getStatusClass(row.status)}`}
                      title={statusLabelMap[row.status] || row.status}
                    >
                      {statusLabelMap[row.status] || row.status}
                    </span>
                  </td>

                  <td>{row.check_in_time || "-"}</td>
                  <td>{row.check_out_time || "-"}</td>

                  <td>{row.late_minutes || 0}</td>
                  <td>{row.early_checkout_minutes || 0}</td>
                  <td>{row.overtime_minutes || 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="table-empty">
                  No attendance history available for this period
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryAttendanceDrawer;
