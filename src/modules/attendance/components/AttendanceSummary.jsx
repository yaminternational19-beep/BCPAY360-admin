import "../../../styles/Attendance.css";

const AttendanceSummary = ({ summary, loading }) => {
  if (loading) {
    return (
      <div className="attendance-summary">
        <div className="summary-card">Loading...</div>
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  /* ===========================
     DAILY SUMMARY (existing)
  =========================== */
  if ("checked_in" in summary) {
    const {
      total = 0,
      present = 0,
      checked_in = 0,
      unmarked = 0
    } = summary;

    const absent = total - present - checked_in - unmarked;

    return (
      <div className="attendance-summary">
        <div className="summary-card total">
          <p className="label">Total</p>
          <p className="value">{total}</p>
        </div>

        <div className="summary-card checked-in">
          <p className="label">Present</p>
          <p className="value">{checked_in}</p>
        </div>

       

        <div className="summary-card absent">
          <p className="label">Absent</p>
          <p className="value">{absent >= 0 ? absent : 0}</p>
        </div>

        <div className="summary-card leave">
          <p className="label">Leave</p>
          <p className="value">0</p>
        </div>

         <div className="summary-card unmarked">
          <p className="label">Unmarked</p>
          <p className="value">{unmarked}</p>
        </div>
      </div>
    );
  }

  /* ===========================
     MONTHLY SUMMARY (NEW)
  =========================== */
  const {
    total_employees = 0,
    present = 0,
    absent = 0,
    leave = 0,
    unmarked = 0,
    holiday = 0
  } = summary;

  return (
    <div className="attendance-summary">
      <div className="summary-card total">
        <p className="label">Employees</p>
        <p className="value">{total_employees}</p>
      </div>

      <div className="summary-card present">
        <p className="label">Present</p>
        <p className="value">{present}</p>
      </div>

      <div className="summary-card absent">
        <p className="label">Absent</p>
        <p className="value">{absent}</p>
      </div>

      <div className="summary-card leave">
        <p className="label">Leave</p>
        <p className="value">{leave}</p>
      </div>

      <div className="summary-card unmarked">
        <p className="label">Unmarked</p>
        <p className="value">{unmarked}</p>
      </div>

      <div className="summary-card holiday">
        <p className="label">Holiday</p>
        <p className="value">{holiday}</p>
      </div>
    </div>
  );
};

export default AttendanceSummary;
