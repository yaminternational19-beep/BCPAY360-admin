import { Users, UserCheck, UserX, Clock, Calendar, HelpCircle, Palmtree } from "lucide-react";
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
      present = 0,      // CHECKED_OUT
      checked_in = 0,   // CHECKED_IN
      unmarked = 0
    } = summary;

    const totalPresent = present + checked_in;
    const absent = total - totalPresent - unmarked >= 0 ? total - totalPresent - unmarked : 0;

    return (
      <div className="stats-grid-premium">
        <div className="stat-card-premium total">
          <div className="stat-icon-wrapper">
            <Users size={20} />
          </div>
          <div className="stat-content-premium">
            <span className="stat-label-premium">Total</span>
            <span className="stat-value-premium">{total}</span>
          </div>
        </div>

        <div className="stat-card-premium active">
          <div className="stat-icon-wrapper">
            <UserCheck size={20} />
          </div>
          <div className="stat-content-premium">
            <span className="stat-label-premium">Present</span>
            <span className="stat-value-premium">{totalPresent}</span>
          </div>
        </div>

        <div className="stat-card-premium inactive">
          <div className="stat-icon-wrapper">
            <UserX size={20} />
          </div>
          <div className="stat-content-premium">
            <span className="stat-label-premium">Absent</span>
            <span className="stat-value-premium">{absent}</span>
          </div>
        </div>
        <div className="stat-card-premium warning">
          <div className="stat-icon-wrapper">
            <Clock size={20} />
          </div>
          <div className="stat-content-premium">
            <span className="stat-label-premium">Unmarked</span>
            <span className="stat-value-premium">{unmarked}</span>
          </div>
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
    <div className="stats-grid-premium">
      <div className="stat-card-premium total">
        <div className="stat-icon-wrapper">
          <Users size={20} />
        </div>
        <div className="stat-content-premium">
          <span className="stat-label-premium">Employees</span>
          <span className="stat-value-premium">{total_employees}</span>
        </div>
      </div>

      <div className="stat-card-premium active">
        <div className="stat-icon-wrapper">
          <UserCheck size={20} />
        </div>
        <div className="stat-content-premium">
          <span className="stat-label-premium">Present</span>
          <span className="stat-value-premium">{present}</span>
        </div>
      </div>

      <div className="stat-card-premium inactive">
        <div className="stat-icon-wrapper">
          <UserX size={20} />
        </div>
        <div className="stat-content-premium">
          <span className="stat-label-premium">Absent</span>
          <span className="stat-value-premium">{absent}</span>
        </div>
      </div>

      <div className="stat-card-premium purple">
        <div className="stat-icon-wrapper">
          <Palmtree size={20} />
        </div>
        <div className="stat-content-premium">
          <span className="stat-label-premium">Leave</span>
          <span className="stat-value-premium">{leave}</span>
        </div>
      </div>

      <div className="stat-card-premium orange">
        <div className="stat-icon-wrapper">
          <Clock size={20} />
        </div>
        <div className="stat-content-premium">
          <span className="stat-label-premium">Unmarked</span>
          <span className="stat-value-premium">{unmarked}</span>
        </div>
      </div>

      <div className="stat-card-premium warning">
        <div className="stat-icon-wrapper">
          <Calendar size={20} />
        </div>
        <div className="stat-content-premium">
          <span className="stat-label-premium">Holiday</span>
          <span className="stat-value-premium">{holiday}</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSummary;
