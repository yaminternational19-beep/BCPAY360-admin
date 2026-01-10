import "../../../styles/Attendance.css";


const DailyAttendanceTable = ({ rows = [], loading, onViewHistory }) => {
  if (loading) {
    return (
      <div className="attendance-table-wrapper">
        <p className="table-loading">Loading attendance...</p>
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="attendance-table-wrapper">
        <p className="table-empty">No attendance data found</p>
      </div>
    );
  }

  return (
  <div className="attendance-table-wrapper">
    <table className="attendance-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Profile</th>
          <th>Name</th>
          <th>Department</th>
          <th>Designation</th>
          <th>Shift</th>
          <th>Status</th>
          <th>Check In</th>
          <th>Check Out</th>
          <th>Late (min)</th>
          <th>Early Out (min)</th>
          <th>Overtime (min)</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {rows.map((row) => (
          <tr key={row.employee_id}>
            <td>{row.sl_no}</td>

            {/* Profile */}
            <td className="col-profile">
              <img
                src={row.photo || "/images/avatar-placeholder.png"}
                alt="profile"
                className="employee-avatar"
              />
            </td>

            {/* Name */}
            <td className="col-name">
              <div className="employee-info">
                <span className="employee-name">{row.name}</span>
                <span className="employee-code">{row.employee_code}</span>
              </div>
            </td>

            <td>{row.department}</td>
            <td>{row.designation}</td>

            {/* Shift */}
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

            {/* Status */}
            <td>
              <span className={`status-badge ${row.status.toLowerCase()}`}>
                {row.status}
              </span>
            </td>

            <td>{row.check_in_time || "-"}</td>
            <td>{row.check_out_time || "-"}</td>

            <td>{row.late_minutes || 0}</td>
            <td>{row.early_checkout_minutes || 0}</td>
            <td>{row.overtime_minutes || 0}</td>

            {/* Action */}
            <td>
              <button
                className="btn-history"
                onClick={() => onViewHistory(row.employee_id)}
              >
                View History
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

};

export default DailyAttendanceTable;
