import "../../../styles/Attendance.css";
// import ProfileAvatar from "../../../components/common/ProfileAvatar";

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

const HistoryAttendanceDrawer = ({ data, loading, onClose }) => {
  if (loading) {
    return (
      <div className="history-drawer">
        <p className="drawer-loading">Loading attendance history…</p>
      </div>
    );
  }

  if (!data) return null;

  const { employee, data: rows } = data;

  return (
    <div className="history-drawer">
      {/* ===========================
          HEADER
      =========================== */}
      <div className="history-header">


        <div className="employee-profile-card">
          <div className="profile-image-container">
            <img
              src={employee.profile_photo_url || employee.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=EFF6FF&color=3B82F6&bold=true`}
              alt={employee.name}
              className="employee-avatar large"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=F1F5F9&color=64748B&bold=true`;
              }}
            />
          </div>

          <div className="employee-details">
            <div className="name-row">
              <h3>{employee.name}</h3>
              <span className="status-indicator active">{employee.status}</span>
            </div>
            <p className="emp-code-main">{employee.code}</p>
            <div className="meta-grid">
              <div className="meta-item">
                <small>Department</small>
                <span>{employee.department}</span>
              </div>
              <div className="meta-item">
                <small>Designation</small>
                <span>{employee.designation}</span>
              </div>
              <div className="meta-item">
                <small>Current Shift</small>
                <span>{employee.shift}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===========================
          TABLE
      =========================== */}
      <div className="history-table-wrapper">
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
                  No attendance history available
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
