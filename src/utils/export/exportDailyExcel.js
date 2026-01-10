import * as XLSX from "xlsx";

export const exportDailyExcel = (rows, date) => {
  if (!rows?.length) return;

  const data = rows.map(r => ({
    EmployeeCode: r.employee_code,
    Name: r.name,
    Department: r.department,
    Designation: r.designation,
    Shift: r.shift_name,
    Status: r.status,
    CheckIn: r.check_in_time || "-",
    CheckOut: r.check_out_time || "-",
    LateMinutes: r.late_minutes,
    EarlyOutMinutes: r.early_checkout_minutes,
    OvertimeMinutes: r.overtime_minutes
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Daily Attendance");

  XLSX.writeFile(wb, `Daily_Attendance_${date}.xlsx`);
};
