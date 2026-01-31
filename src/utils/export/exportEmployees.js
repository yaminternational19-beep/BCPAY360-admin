import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

/* ===================================================================================
   HELPER: FORMAT DATA
   =================================================================================== */
const formatEmployeeData = (employees) => {
    return employees.map((emp) => ({
        "ID": emp.employee_code || "-",
        "Name": emp.full_name || "-",
        "Email": emp.email || "-",
        "Phone": emp.phone || "-",
        "Branch": emp.branch_name || "-",
        "Department": emp.department_name || "-",
        "Designation": emp.designation_name || "-",
        "Role": emp.role_name || "-",
        "Status": emp.employee_status || "-",
        "Joining Date": emp.joining_date ? new Date(emp.joining_date).toLocaleDateString("en-GB") : "-",
        "Salary": emp.salary ? Number(emp.salary).toLocaleString("en-IN") : "-",
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
        emp.role_name || "-",
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
