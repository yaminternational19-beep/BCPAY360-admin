import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "../styles/EmployeeView.css";
import { makeEmployees } from "../utils/mockData.js";

/* ⚠️ TEMP: using dummy source (no backend yet) */
const employees = makeEmployees(1000);

/* =========================
   REPORT SECTION
========================= */
const Section = ({ title, items, onView, onDownload }) => (
  <div className="section">
    <h3>{title}</h3>
    <ul>
      {items.map((r, i) => (
        <li key={i}>
          <span>{r.title}</span>

          <div className="report-actions">
            <button onClick={() => onView(r)}>View</button>
            <button onClick={() => onDownload(r)}>Download</button>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

const EmployeeView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const employee = useMemo(
    () => employees.find(e => e.id === id),
    [id]
  );

  if (!employee) {
    return <div className="employee-view">Employee not found</div>;
  }

  const { biodata, reports } = employee;

  /* =========================
     PDF HELPERS
  ========================= */

  const downloadBiodata = () => {
    const doc = new jsPDF();

    doc.text("Employee Bio Data", 14, 16);

    doc.text(`Name: ${employee.name}`, 14, 30);
    doc.text(`Employee ID: ${employee.id}`, 14, 38);
    doc.text(`Gender: ${biodata.gender}`, 14, 46);
    doc.text(`DOB: ${biodata.dob}`, 14, 54);
    doc.text(`Blood Group: ${biodata.bloodGroup}`, 14, 62);
    doc.text(`PAN: ${employee.pan}`, 14, 70);
    doc.text(`Aadhaar: ${employee.aadhaar}`, 14, 78);
    doc.text(`Department: ${employee.department}`, 14, 86);
    doc.text(`Role: ${employee.role}`, 14, 94);

    /* Photo */
    try {
      doc.addImage(employee.avatar, "PNG", 150, 30, 30, 30);
    } catch {
      /* ignore image errors in dummy env */
    }

    doc.save(`${employee.id}_Biodata.pdf`);
  };

  const downloadAttendance = () => {
    const doc = new jsPDF();
    doc.text("Attendance Report", 14, 16);
    doc.text(`Employee: ${employee.name}`, 14, 26);
    doc.text(`Employee ID: ${employee.id}`, 14, 34);

    let y = 48;
    for (let d = 1; d <= 15; d++) {
      const status = Math.random() > 0.15 ? "Present" : "Absent";
      doc.text(`Day ${d}: ${status}`, 14, y);
      y += 8;
    }

    doc.save(`${employee.id}_Attendance.pdf`);
  };

  const downloadPayslip = () => {
    const doc = new jsPDF();
    const deductions = 2500;

    doc.text("Pay Slip", 14, 16);
    doc.text(`Employee: ${employee.name}`, 14, 30);
    doc.text(`Employee ID: ${employee.id}`, 14, 38);
    doc.text(`Basic Salary: ₹${employee.salary}`, 14, 46);
    doc.text(`Deductions: ₹${deductions}`, 14, 54);
    doc.text(`Net Pay: ₹${employee.salary - deductions}`, 14, 62);

    doc.save(`${employee.id}_Payslip.pdf`);
  };

  const downloadEmptyForm = (title) => {
    const doc = new jsPDF();
    doc.text(title, 14, 20);
    doc.text("This is a statutory form template.", 14, 36);
    doc.save(`${title.replace(/\s+/g, "_")}.pdf`);
  };

  const handleDownload = (report) => {
    if (report.title === "Bio Data") return downloadBiodata();
    if (report.title.toLowerCase().includes("attendance")) return downloadAttendance();
    if (report.title.toLowerCase().includes("pay")) return downloadPayslip();
    return downloadEmptyForm(report.title);
  };

  const handleView = (report) => {
    alert(`Preview not enabled yet for: ${report.title}`);
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="employee-view">
      {/* HEADER */}
      <div className="view-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="profile">
          <img src={employee.avatar} alt={employee.name} />
          <div>
            <h2>{employee.name}</h2>
            <p>{employee.id} · {employee.role}</p>
            <p>{employee.department}</p>
          </div>
        </div>
      </div>

      {/* BASIC INFO */}
      <div className="card">
        <h3>Basic Information</h3>
        <div className="grid">
          <div><strong>Email:</strong> {employee.email}</div>
          <div><strong>Phone:</strong> {employee.phone}</div>
          <div><strong>Joining Date:</strong> {employee.joiningDate}</div>
          <div><strong>Salary:</strong> ₹{employee.salary.toLocaleString()}</div>
          <div><strong>Status:</strong> {employee.active ? "Active" : "Inactive"}</div>
        </div>
      </div>

      {/* BIO DATA */}
      <div className="card">
        <h3>Bio Data</h3>
        <div className="grid">
          <div><strong>Gender:</strong> {biodata.gender}</div>
          <div><strong>DOB:</strong> {biodata.dob}</div>
          <div><strong>Blood Group:</strong> {biodata.bloodGroup}</div>
          <div><strong>Marital Status:</strong> {biodata.maritalStatus}</div>
          <div><strong>Qualification:</strong> {biodata.qualification}</div>
          <div><strong>Address:</strong> {biodata.address}</div>
          <div><strong>PAN:</strong> {employee.pan}</div>
          <div><strong>Aadhaar:</strong> {employee.aadhaar}</div>
        </div>
      </div>

      {/* REPORTS */}
      <Section title="Personnel Reports" items={reports.personnel} onView={handleView} onDownload={handleDownload} />
      <Section title="Attendance Reports" items={reports.attendance} onView={handleView} onDownload={handleDownload} />
      <Section title="Leave Reports" items={reports.leave} onView={handleView} onDownload={handleDownload} />
      <Section title="Salary Reports" items={reports.salary} onView={handleView} onDownload={handleDownload} />
      <Section title="PF Reports" items={reports.pf} onView={handleView} onDownload={handleDownload} />
      <Section title="ESI Reports" items={reports.esi} onView={handleView} onDownload={handleDownload} />
      <Section title="Factory Act Reports" items={reports.factoryAct} onView={handleView} onDownload={handleDownload} />
    </div>
  );
};

export default EmployeeView;
