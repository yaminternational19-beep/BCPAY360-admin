import "../../../styles/Attendance.css";


const HistoryAttendanceDrawer = ({ data, loading, onClose }) => {
  if (loading) {
    return (
      <div className="history-drawer">
        <p className="drawer-loading">Loading history...</p>
      </div>
    );
  }

  if (!data) return null;

  const { employee, data: rows } = data;

  return (
    <div className="history-drawer">
      {/* Header */}
      <div className="history-header">
        <button className="btn-back" onClick={onClose}>
          ← Back
        </button>

        <div className="employee-profile">
          <img
            src={employee.photo || "/images/avatar-placeholder.png"}
            alt="profile"
            className="employee-avatar large"
          />
          <div className="employee-info">
            <h3>{employee.name}</h3>
            <p>{employee.code}</p>
            <p>
              {employee.department} · {employee.designation}
            </p>
            <p>Shift: {employee.shift}</p>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="history-table-wrapper">
        <table className="attendance-table">
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
            {rows.length ? (
              rows.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.date}</td>

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
                      className={`status-badge ${row.status.toLowerCase()}`}
                    >
                      {row.status}
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
                  No history available
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
