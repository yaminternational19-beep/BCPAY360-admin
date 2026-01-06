import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Briefcase,
  MapPin,
  CreditCard,
  FileText,
  Calendar,
  Mail,
  Phone,
  Building2,
  CheckCircle2,
  XCircle,
  Download,
  Eye,
  Trash2
} from "lucide-react";
import "../../../styles/EmployeeView.css";
import { getEmployeeById, getEmployeeDocuments, deleteEmployeeById, activateEmployeeById } from "../../../api/employees.api";

import { useToast } from "../../../context/ToastContext";

const EmployeeProfile = () => {
  const { id } = useParams(); // URL param is numeric ID
  const navigate = useNavigate();
  const toast = useToast();

  const [data, setData] = useState({
    employee: null,
    profile: null,
    documents: []
  });
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchEmployeeData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Bio-Data by ID
        const empRes = await getEmployeeById(id);

        if (!empRes) {
          if (isMounted) {
            setError("Employee not found");
            toast.error("Employee not found");
          }
          return;
        }

        const employeeObj = empRes.employee || empRes;
        const employeeCode = employeeObj.employee_code;

        // 2. Fetch Documents by Code (if code exists)
        let docsRes = [];
        if (employeeCode) {
          try {
            docsRes = await getEmployeeDocuments(employeeCode);
          } catch (docErr) {
            console.warn("Failed to fetch documents:", docErr.message);
            // Don't fail the whole page if only docs fail
          }
        }

        if (isMounted) {
          setData({
            employee: employeeObj || null,
            profile: empRes.profile || null,
            documents: Array.isArray(docsRes) ? docsRes : []
          });
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Unable to load employee details");
          toast.error(err.message || "Unable to load employee details");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchEmployeeData();
    return () => { isMounted = false; };
  }, [id, toast]);

  const handleDeactivate = async () => {
    const message = `Deactivate employee?\nThis will disable the employee account.`;
    if (!window.confirm(message)) return;

    setToggling(true);
    try {
      await deleteEmployeeById(id); // Soft deactivate
      setData(prev => ({
        ...prev,
        employee: { ...prev.employee, employee_status: 'INACTIVE' }
      }));
      toast.success("Employee deactivated successfully");
    } catch (err) {
      toast.error(err.message || "Failed to deactivate employee");
    } finally {
      setToggling(false);
    }
  };

  const handleActivate = async () => {
    if (!window.confirm(`Activate employee? \nThis will re-enable the employee account.`)) return;

    setToggling(true);
    try {
      await activateEmployeeById(id);
      setData(prev => ({
        ...prev,
        employee: { ...prev.employee, employee_status: 'ACTIVE' }
      }));
      toast.success("Employee activated successfully");
    } catch (err) {
      toast.error(err.message || "Failed to activate employee");
    } finally {
      setToggling(false);
    }
  };

  const handleDeleteEmployee = async () => {
    const message = `Delete employee permanently?\nThis action will permanently remove the employee.\nThis cannot be undone.`;
    if (!window.confirm(message)) return;

    try {
      await deleteEmployeeById(id, true); // Permanent delete
      toast.success("Employee deleted permanently");
      navigate('/admin/employees');
    } catch (err) {
      toast.error(err.message || "Failed to delete employee");
    }
  };

  if (loading) {
    return (
      <div className="employee-view-loading">
        <div className="spinner"></div>
        <p>Fetching employee records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="employee-view-error">
        <XCircle size={48} color="#ef4444" />
        <h2>Error</h2>
        <p>{error}</p>
        <button className="back-link" onClick={() => navigate(-1)} style={{ margin: '20px auto' }}>
          <ArrowLeft size={16} /> Back to List
        </button>
      </div>
    );
  }

  const { employee, profile, documents } = data;

  if (!employee) {
    return (
      <div className="employee-view-error">
        <XCircle size={48} color="#ef4444" />
        <h2>Not Found</h2>
        <p>The requested employee record could not be found.</p>
        <button className="back-link" onClick={() => navigate(-1)} style={{ margin: '20px auto' }}>
          <ArrowLeft size={16} /> Back to List
        </button>
      </div>
    );
  }

  return (
    <div className="employee-view-container">
      {/* Top Header */}
      <div className="view-header-new">
        <button className="back-link" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Back to Employee List
        </button>

        <div className="header-main">
          <div className="profile-hero">
            <div className="avatar-large">
              {employee.full_name?.charAt(0).toUpperCase() || <User />}
            </div>
            <div className="hero-info">
              <h1>{employee.full_name}</h1>
              <div className="hero-badges">
                <span className="badge code">{employee.employee_code}</span>
                <span className={`badge status ${(employee.employee_status || '').toLowerCase()}`}>
                  {(employee.employee_status || '').toUpperCase() === 'ACTIVE' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                  {employee.employee_status || 'UNKNOWN'}
                </span>
              </div>
            </div>
          </div>
          <div className="header-actions-main">
            <div className="header-stats">
              <div className="stat-item">
                <span className="label">Department</span>
                <span className="value">{employee.department?.name || ""}</span>
              </div>
              <div className="stat-item">
                <span className="label">Designation</span>
                <span className="value">{employee.designation?.name || ""}</span>
              </div>
            </div>

            <div className="profile-actions">
              {employee.employee_status?.toUpperCase() === 'ACTIVE' ? (
                <button
                  className="view-action-btn deactivate"
                  onClick={handleDeactivate}
                  disabled={toggling}
                >
                  <XCircle size={16} /> {toggling ? "Updating..." : "Deactivate Account"}
                </button>
              ) : (
                <button
                  className="view-action-btn activate"
                  onClick={handleActivate}
                  disabled={toggling}
                >
                  <CheckCircle2 size={16} /> {toggling ? "Updating..." : "Activate Account"}
                </button>
              )}

              <button
                className="view-action-btn delete-perm"
                onClick={handleDeleteEmployee}
                disabled={toggling}
              >
                <Trash2 size={16} /> Delete Permanently
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="view-content-grid">
        {/* Left Column: Info Cards */}
        <div className="info-column">

          {/* Section 1: 🧑 Employee Info */}
          <section className="info-card">
            <div className="card-header">
              <Briefcase size={20} className="header-icon" />
              <h3>Employment Details</h3>
            </div>
            <div className="card-body">
              <div className="data-grid">
                <div className="data-field">
                  <label>Email Address</label>
                  <span><Mail size={14} /> {employee.email || ""}</span>
                </div>
                <div className="data-field">
                  <label>Phone Number</label>
                  <span><Phone size={14} /> {(employee.country_code || "") + (employee.phone || "")}</span>
                </div>
                <div className="data-field">
                  <label>Branch</label>
                  <span><Building2 size={14} /> {employee.branch?.name || ""}</span>
                </div>
                <div className="data-field">
                  <label>Joining Date</label>
                  <span><Calendar size={14} /> {employee.joining_date ? new Date(employee.joining_date).toLocaleDateString() : ""}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: 👤 Profile Info */}
          <section className="info-card">
            <div className="card-header">
              <User size={20} className="header-icon" />
              <h3>Personal Profile</h3>
            </div>
            <div className="card-body">
              {profile ? (
                <div className="data-grid">
                  <div className="data-field">
                    <label>Gender</label>
                    <span>{profile.gender || ""}</span>
                  </div>
                  <div className="data-field">
                    <label>Date of Birth</label>
                    <span>{profile.dob ? new Date(profile.dob).toLocaleDateString() : ""}</span>
                  </div>
                  <div className="data-field full-width">
                    <label>Address</label>
                    <span><MapPin size={14} /> {profile.address || ""}</span>
                  </div>
                </div>
              ) : (
                <p className="no-data">No profile information available.</p>
              )}
            </div>
          </section>

          {/* Section 3: Bank Details */}
          <section className="info-card">
            <div className="card-header">
              <CreditCard size={20} className="header-icon" />
              <h3>Bank Information</h3>
            </div>
            <div className="card-body">
              {profile && (profile.bank_name || profile.account_number) ? (
                <div className="data-grid">
                  <div className="data-field">
                    <label>Bank Name</label>
                    <span>{profile.bank_name || ""}</span>
                  </div>
                  <div className="data-field">
                    <label>Account Number</label>
                    <span>{profile.account_number || ""}</span>
                  </div>
                  <div className="data-field">
                    <label>IFSC Code</label>
                    <span>{profile.ifsc_code || ""}</span>
                  </div>
                </div>
              ) : (
                <p className="no-data">No bank details recorded.</p>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Documents */}
        <div className="action-column">
          <section className="info-card sticky-card">
            <div className="card-header">
              <FileText size={20} className="header-icon" />
              <h3>📎 Documents</h3>
            </div>
            <div className="card-body">
              {documents && documents.length > 0 ? (
                <ul className="document-list">
                  {documents.map((doc, idx) => (
                    <li key={idx} className="doc-item">
                      <div className="doc-info">
                        <span className="doc-type">{doc.document_type || "Document"}</span>
                        <span className="doc-name">{doc.document_number ? `No: ${doc.document_number}` : `File ${idx + 1}`}</span>
                      </div>
                      <div className="doc-actions">
                        {doc.view_url && (
                          <a href={doc.view_url} target="_blank" rel="noopener noreferrer" className="doc-btn view" title="View">
                            <Eye size={16} />
                          </a>
                        )}
                        {doc.download_url && (
                          <button
                            onClick={() => window.open(doc.download_url, "_blank")}
                            className="doc-btn download"
                            title="Download"
                          >
                            <Download size={16} />
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="no-docs">
                  <FileText size={40} strokeWidth={1} />
                  <p>No documents uploaded yet.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
