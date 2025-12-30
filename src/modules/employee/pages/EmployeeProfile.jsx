import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "../../../styles/EmployeeView.css";
import { getEmployee } from "../../../api/employees.api";

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);

  /* =========================
     FETCH EMPLOYEE
  ========================= */
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const data = await getEmployee(id);
        setEmployee(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load employee details");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  /* =========================
     STATES
  ========================= */
  if (loading) {
    return <div className="employee-view">Loading employee...</div>;
  }

  if (error) {
    return <div className="employee-view error">{error}</div>;
  }

  if (!employee) {
    return <div className="employee-view">Employee not found</div>;
  }

  /* =========================
     PDF HELPERS (SAFE)
  ========================= */
  const downloadEmptyForm = (title) => {
    const doc = new jsPDF();
    doc.text(title, 14, 20);
    doc.text("This document will be available soon.", 14, 36);
    doc.save(`${title.replace(/\s+/g, "_")}.pdf`);
  };

  /* =========================
     VIEW HANDLER
  ========================= */
  const handleView = (report) => {
    setPreview(report);
  };

  return (
    <div className="employee-view">
      {/* HEADER */}
      <div className="view-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="profile">
          <div className="avatar">
            {employee.full_name?.charAt(0)}
          </div>
          <div>
            <h2>{employee.full_name}</h2>
            <p>
              {employee.employee_code} · {employee.designation_name}
            </p>
            <p>{employee.department_name}</p>
          </div>
        </div>
      </div>

      {/* BASIC INFO */}
      <div className="card">
        <h3>Basic Information</h3>
        <div className="grid">
          <div><strong>Email:</strong> {employee.email || "—"}</div>
          <div><strong>Phone:</strong> {employee.country_code}{employee.phone}</div>
          <div><strong>Joining Date:</strong> {employee.joining_date}</div>
          <div><strong>Salary:</strong> ₹{Number(employee.salary).toLocaleString()}</div>
          <div><strong>Status:</strong> {employee.is_active ? "Active" : "Inactive"}</div>
        </div>
      </div>

      {/* REPORT PLACEHOLDER */}
      <div className="card">
        <h3>Reports</h3>
        <p>Document preview & downloads will be enabled once backend integration is complete.</p>

        <button onClick={() => handleView({ title: "Employee Bio Data" })}>
          View Sample Report
        </button>
      </div>

      {/* MODAL PREVIEW */}
      {preview && (
        <div className="modal-backdrop" onClick={() => setPreview(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>{preview.title}</h3>
            <p>This is a preview placeholder.</p>

            <div className="modal-actions">
              <button onClick={() => downloadEmptyForm(preview.title)}>
                Download
              </button>
              <button onClick={() => setPreview(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeProfile;
