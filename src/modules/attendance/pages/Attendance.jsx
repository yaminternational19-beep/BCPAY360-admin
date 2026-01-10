import { useEffect, useState } from "react";
import "../../../styles/Attendance.css";

import AttendanceHeader from "../components/AttendanceHeader";
import AttendanceSummary from "../components/AttendanceSummary";
import DailyAttendanceTable from "../components/DailyAttendanceTable";
import MonthlyAttendanceTable from "../components/MonthlyAttendanceTable";
import HistoryAttendanceDrawer from "../components/HistoryAttendanceDrawer";

import {
  fetchDailyAttendance,
  fetchHistoryAttendance,
  fetchMonthlyAttendance
} from "../../../api/master.api";

/* EXPORT UTILS */
import { exportDailyExcel } from "../../../utils/export/exportDailyExcel";
import { exportDailyPDF } from "../../../utils/export/exportDailyPDF";
import { exportMonthlyExcel } from "../../../utils/export/exportMonthlyExcel";
import { exportMonthlyPDF } from "../../../utils/export/exportMonthlyPDF";
import { exportHistoryExcel } from "../../../utils/export/exportHistoryExcel";
import { exportHistoryPDF } from "../../../utils/export/exportHistoryPDF";

const Attendance = () => {
  const today = new Date().toISOString().slice(0, 10);

  const [viewType, setViewType] = useState("DAILY");
  const [attendanceMode, setAttendanceMode] = useState("DAILY");

  const [date, setDate] = useState(today);
  const [rows, setRows] = useState([]);

  const [monthRange, setMonthRange] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const [historyData, setHistoryData] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    departmentId: "",
    shiftId: "",
    status: ""
  });

  /* AUTO INIT MONTH */
  useEffect(() => {
    if (attendanceMode === "MONTHLY" && !monthRange) {
      const now = new Date();
      const y = now.getFullYear();
      const m = now.getMonth() + 1;
      const fromDate = `${y}-${String(m).padStart(2, "0")}-01`;
      const toDate = `${y}-${String(m).padStart(2, "0")}-${new Date(y, m, 0).getDate()}`;
      setMonthRange({ fromDate, toDate });
    }
  }, [attendanceMode, monthRange]);

  /* LOAD DAILY */
  useEffect(() => {
    if (viewType === "DAILY" && attendanceMode === "DAILY") {
      setLoading(true);
      fetchDailyAttendance({ date, ...filters })
        .then(res => {
          setRows(res.data);
          setSummary(res.summary);
        })
        .finally(() => setLoading(false));
    }
  }, [date, attendanceMode, filters, viewType]);

  /* LOAD MONTHLY */
  useEffect(() => {
    if (viewType === "DAILY" && attendanceMode === "MONTHLY" && monthRange) {
      setLoading(true);
      fetchMonthlyAttendance({ ...monthRange, ...filters })
        .then(res => setMonthlyData(res.data))
        .finally(() => setLoading(false));
    }
  }, [attendanceMode, monthRange, filters, viewType]);

  /* LOAD HISTORY */
  const loadHistoryAttendance = async (employeeId) => {
    const from = new Date(new Date().setMonth(new Date().getMonth() - 1))
      .toISOString()
      .slice(0, 10);

    const res = await fetchHistoryAttendance({
      employeeId,
      from,
      to: today
    });

    setHistoryData(res);
    setViewType("HISTORY");
  };

  /* EXPORT HANDLER (THIS MAKES DOWNLOAD WORK) */
  const handleExport = ({ type, context }) => {
    if (context === "DAILY") {
      type === "EXCEL"
        ? exportDailyExcel(rows, date)
        : exportDailyPDF(rows, date);
    }

    if (context === "MONTHLY") {
      type === "EXCEL"
        ? exportMonthlyExcel(monthlyData, monthRange.fromDate, monthRange.toDate)
        : exportMonthlyPDF(monthlyData, monthRange.fromDate, monthRange.toDate);
    }

    if (context === "HISTORY" && historyData?.data?.length) {
      const name = historyData.employee_name || "Employee";
      type === "EXCEL"
        ? exportHistoryExcel(historyData.data, name)
        : exportHistoryPDF(historyData.data, name);
    }
  };

  return (
    <div className="attendance-container">
      <AttendanceHeader
        viewType={viewType}
        attendanceMode={attendanceMode}
        date={date}
        monthRange={monthRange}
        filters={filters}
        onDateChange={setDate}
        onMonthChange={setMonthRange}
        onFilterChange={setFilters}
        onExport={handleExport}
        onBack={() => {
          setViewType("DAILY");
          setHistoryData(null);
        }}
        onModeChange={(mode) => {
          setAttendanceMode(mode);
          setSummary(null);
          if (mode === "DAILY") setMonthlyData([]);
          if (mode === "MONTHLY") setRows([]);
        }}
      />

      {viewType === "DAILY" && attendanceMode === "DAILY" && (
        <>
          <AttendanceSummary summary={summary} loading={loading} />
          <DailyAttendanceTable
            rows={rows}
            loading={loading}
            onViewHistory={loadHistoryAttendance}
          />
        </>
      )}

      {viewType === "DAILY" && attendanceMode === "MONTHLY" && (
        <MonthlyAttendanceTable data={monthlyData} loading={loading} />
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
