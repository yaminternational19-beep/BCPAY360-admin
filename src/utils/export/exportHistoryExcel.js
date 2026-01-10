import * as XLSX from "xlsx";

export const exportHistoryExcel = (records, employeeName) => {
  if (!records || !records.length) return;

  const rows = records.map(r => ({
    Date: r.attendance_date,
    Status: r.status,
    CheckIn: r.check_in_time || "-",
    CheckOut: r.check_out_time || "-"
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Attendance History");

  const safeName = employeeName?.replace(/\s+/g, "_") || "Employee";

  XLSX.writeFile(
    wb,
    `${safeName}_Attendance_History.xlsx`
  );
};
