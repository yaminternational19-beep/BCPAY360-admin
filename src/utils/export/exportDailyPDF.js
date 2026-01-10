import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportDailyPDF = (rows, date) => {
  if (!rows?.length) return;

  const doc = new jsPDF("landscape");

  doc.text(`Daily Attendance - ${date}`, 14, 20);

  autoTable(doc, {
    startY: 30,
    head: [[
      "Emp Code",
      "Name",
      "Dept",
      "Designation",
      "Shift",
      "Status",
      "Check In",
      "Check Out"
    ]],
    body: rows.map(r => [
      r.employee_code,
      r.name,
      r.department,
      r.designation,
      r.shift_name,
      r.status,
      r.check_in_time || "-",
      r.check_out_time || "-"
    ]),
    styles: { fontSize: 9 }
  });

  doc.save(`Daily_Attendance_${date}.pdf`);
};
