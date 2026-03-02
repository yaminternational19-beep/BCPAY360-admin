import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

/* ===================================================================================
   HELPER: FORMAT DATA
   =================================================================================== */
const formatEmployeeData = (employees) => {
    return employees.map((emp) => ({
        "Emp ID": emp.employee_code || "-",
        "Full Name": emp.full_name || "-",
        "Email": emp.email || "-",
        "Phone": emp.phone || "-",
        "Branch": emp.branch_name || "-",
        "Department": emp.department_name || "-",
        "Designation": emp.designation_name || "-",
        "Joining Date": emp.joining_date ? new Date(emp.joining_date).toLocaleDateString("en-GB") : "-",
        "Salary": emp.salary ? `INR ${Number(emp.salary).toLocaleString("en-IN")}` : "-",
        "Status": emp.employee_status || "-",
    }));
};

const formatLeaveRequestData = (requests) => {
    return requests.map((req) => ({
        "Emp ID": req.employee_code || "-",
        "Full Name": req.full_name || "-",
        "Email": req.email || "-",
        "Phone": req.phone || "-",
        "Branch": req.branch_name || "-",
        "Department": req.department_name || "-",
        "Designation": req.designation_name || "-",
        "Dates": `${new Date(req.from_date).toLocaleDateString("en-GB")} - ${new Date(req.to_date).toLocaleDateString("en-GB")}`,
        "Duration": `${req.total_days} Day(s)`,
        "Applied On": new Date(req.applied_at).toLocaleDateString("en-GB"),
        "Reason": req.reason || "-",
        "Status": req.status || "PENDING",
    }));
};

const formatAttendanceData = (attendanceRecords) => {
    return attendanceRecords.map((r) => ({
        "Emp ID": r.employee_code || "-",
        "Full Name": r.full_name || "-",
        "Date": new Date(r.attendance_date).toLocaleDateString("en-GB"),
        "CheckIn": r.check_in_time || "-",
        "CheckOut": r.check_out_time || "-",
        "LateMins": r.late_minutes || 0,
        "EarlyOutMins": r.early_checkout_minutes || 0,
        "OvertimeMins": r.overtime_minutes || 0,
        "TotalHours": r.working_hours || "-",
        "Status": r.attendance_status || "-",
    }));
};

/* ===================================================================================
   EXCEL EXPORT
   =================================================================================== */
export const exportEmployeesExcel = (employees, filename = "Employees_Export") => {
    if (!employees || !employees.length) {
        alert("No data to export");
        return;
    }

    const formattedData = formatEmployeeData(employees);
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");

    // Auto-width for columns (approximate)
    const cols = Object.keys(formattedData[0]).map(key => ({ wch: Math.max(key.length, 15) }));
    worksheet["!cols"] = cols;

    const dateStr = new Date().toISOString().split("T")[0];
    XLSX.writeFile(workbook, `${filename}_${dateStr}.xlsx`);
};

export const exportLeaveRequestsExcel = (requests, filename = "Leave_Requests_Export") => {
    if (!requests || !requests.length) {
        alert("No data to export");
        return;
    }

    const formattedData = formatLeaveRequestData(requests);
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Leave Requests");

    // Auto-width for columns (approximate)
    const cols = Object.keys(formattedData[0]).map(key => ({ wch: Math.max(key.length, 15) }));
    worksheet["!cols"] = cols;

    const dateStr = new Date().toISOString().split("T")[0];
    XLSX.writeFile(workbook, `${filename}_${dateStr}.xlsx`);
};

export const exportAttendanceExcel = (attendanceRecords, filename = "Attendance_Export") => {
    if (!attendanceRecords || !attendanceRecords.length) {
        alert("No data to export");
        return;
    }

    const formattedData = formatAttendanceData(attendanceRecords);
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

    // Auto-width for columns (approximate)
    const cols = Object.keys(formattedData[0]).map(key => ({ wch: Math.max(key.length, 15) }));
    worksheet["!cols"] = cols;

    const dateStr = new Date().toISOString().split("T")[0];
    XLSX.writeFile(workbook, `${filename}_${dateStr}.xlsx`);
};

/* ===================================================================================
   PDF EXPORT
   =================================================================================== */
export const exportEmployeesPDF = (employees, filename = "Employees_Export") => {
    if (!employees || !employees.length) {
        alert("No data to export");
        return;
    }

    const doc = new jsPDF("l", "mm", "a4"); // Landscape
    const dateStr = new Date().toISOString().split("T")[0];

    // Title
    doc.setFontSize(16);
    doc.text("Employee List Report", 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${dateStr}`, 14, 22);

    const tableColumn = [
        "ID", "Name", "Email", "Phone", "Branch", "Dept", "Role", "Status"
    ];

    const tableRows = employees.map(emp => [
        emp.employee_code || "-",
        emp.full_name || "-",
        emp.email || "-",
        emp.phone || "-",
        emp.branch_name || "-",
        emp.department_name || "-",
        emp.designation_name || "-", // Changed from role_name to designation_name for consistency with Excel
        emp.employee_status || "-"
    ]);

    autoTable(doc, {
        startY: 25,
        head: [tableColumn],
        body: tableRows,
        theme: "grid",
        headStyles: { fillColor: [41, 128, 185], textColor: 255 }, // Blue header
        styles: { fontSize: 8, cellPadding: 2 },
    });

    doc.save(`${filename}_${dateStr}.pdf`);
};
