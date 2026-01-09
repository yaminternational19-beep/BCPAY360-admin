import { useEffect, useState } from "react";
import "../../../styles/Attendance.css";


import AttendanceHeader from "../components/AttendanceHeader";
import AttendanceSummary from "../components/AttendanceSummary";
import DailyAttendanceTable from "../components/DailyAttendanceTable";
import HistoryAttendanceDrawer from "../components/HistoryAttendanceDrawer";

import {
  fetchDailyAttendance,
  fetchHistoryAttendance
} from "../../../api/master.api";

const Attendance = () => {
  const today = new Date().toISOString().slice(0, 10);

  const [viewType, setViewType] = useState("DAILY"); // DAILY | HISTORY
  const [date, setDate] = useState(today);

  const [summary, setSummary] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [historyData, setHistoryData] = useState(null);
  const [attendanceMode, setAttendanceMode] = useState("DAILY");
// DAILY | MONTHLY

const [monthlyData, setMonthlyData] = useState([]);
const [monthRange, setMonthRange] = useState(null);




  const [filters, setFilters] = useState({
    search: "",
    departmentId: "",
    shiftId: "",
    status: ""
  });
     const loadDailyAttendance = async (selectedDate) => {
  try {
    setLoading(true);

    const res = await fetchDailyAttendance({
      date: selectedDate,
      ...filters
    });

    setSummary(res.summary);
    setRows(res.data);
  } catch (err) {
    console.error("Failed to load daily attendance", err);
  } finally {
    setLoading(false);
  }
};



  /* ===========================
     LOAD HISTORY ATTENDANCE
  =========================== */
 const loadHistoryAttendance = async (employeeId) => {
  try {
    if (!employeeId) return;

    setLoading(true);

    const to = today;
    const fromDate = new Date();
    fromDate.setMonth(fromDate.getMonth() - 1);
    const from = fromDate.toISOString().slice(0, 10);

    const res = await fetchHistoryAttendance({
      employeeId,
      from,
      to
    });

    setHistoryData(res);          // ⬅️ see fix #2
    setViewType("HISTORY");
  } catch (err) {
    console.error("Failed to load history attendance", err);
  } finally {
    setLoading(false);
  }
};

  


  /* ===========================
     EFFECT: LOAD DAILY
  =========================== */
  useEffect(() => {
    if (viewType === "DAILY") {
      loadDailyAttendance(date);
    }
  }, [date, viewType]);

  return (
    <div className="attendance-container">
      <AttendanceHeader
        viewType={viewType}
        date={date}
        onDateChange={setDate}
        onBack={() => {
          setViewType("DAILY");
          setSelectedEmployee(null);
          setHistoryData(null);
        }}
        filters={filters}
        onFilterChange={setFilters}
      />


      {viewType === "DAILY" && (
        <>
          <AttendanceSummary summary={summary} loading={loading} />

          <DailyAttendanceTable
            rows={rows}
            loading={loading}
            onViewHistory={(employeeId) => {
              setSelectedEmployee(employeeId);
              loadHistoryAttendance(employeeId);
            }}
          />
        </>
      )}

      {viewType === "HISTORY" && historyData && (
        <HistoryAttendanceDrawer
          data={historyData}
          loading={loading}
          onClose={() => {
            setViewType("DAILY");
            setHistoryData(null);
          }}
        />
      )}
    </div>
  );
};

export default Attendance;
