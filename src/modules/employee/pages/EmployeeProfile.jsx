import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  CreditCard,
  Download,
  Eye,
  FileText,
  Mail,
  MapPin,
  Phone,
  Trash2,
  User,
  XCircle,
  Clock,
  ExternalLink,
  Pencil,
  Ban
} from "lucide-react";
import "../styles/EmployeeView.css";
import {
  getEmployeeById,
  deleteEmployeeById,
  activateEmployeeById,
  updateEmployeeById,
  getAvailableCompanyForms
} from "../../../api/employees.api";
import { useToast } from "../../../context/ToastContext";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeDocumentCard from "../components/EmployeeDocumentCard";

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [data, setData] = useState({
    employee: null,
    organization: null,
    profile: null,
    auth: null,
    documents: []
  });
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [error, setError] = useState(null);

  const fetchEmployeeData = async () => {
    setLoading(true);
    try {
      const [res, companyFormsRes] = await Promise.all([
        getEmployeeById(id),
        getAvailableCompanyForms()
      ]);

      if (!res) {
        setError("Employee not found");
        return;
      }

      setData({
        employee: res.employee || null,
        organization: res.organization || null,
        profile: res.profile || null,
        auth: res.auth || null,
        documents: Array.isArray(res.documents) ? res.documents : [],
        companyForms: Array.isArray(companyFormsRes?.data) ? companyFormsRes.data : (Array.isArray(companyFormsRes) ? companyFormsRes : []),
        // Create a map of generated forms for easy lookup
        generatedMap: (Array.isArray(res.documents) ? res.documents : []).reduce((acc, doc) => {
          if (doc.form_code) acc[doc.form_code] = doc;
          return acc;
        }, {})
      });
    } catch (err) {
      setError(err.message || "Unable to load employee details");
      toast.error(err.message || "Unable to load employee details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeData();
  }, [id]);

  const handleDeactivate = async () => {
    if (!window.confirm("Deactivate employee account?")) return;
    setToggling(true);
    try {
      await deleteEmployeeById(id);
      setData(prev => ({
        ...prev,
        employee: { ...prev.employee, status: 'INACTIVE', employee_status: 'INACTIVE' }
      }));
      toast.success("Employee deactivated");
    } catch (err) {
      toast.error(err.message || "Failed to deactivate");
    } finally {
      setToggling(false);
    }
  };

  const handleActivate = async () => {
    if (!window.confirm("Activate employee account?")) return;
    setToggling(true);
    try {
      await activateEmployeeById(id);
      setData(prev => ({
        ...prev,
        employee: { ...prev.employee, status: 'ACTIVE', employee_status: 'ACTIVE' }
      }));
      toast.success("Employee activated");
    } catch (err) {
      toast.error(err.message || "Failed to activate");
    } finally {
      setToggling(false);
    }
  };

  const handleDeleteEmployee = async () => {
    if (!window.confirm("Delete employee measurement permanently?\nThis cannot be undone.")) return;
    try {
      await deleteEmployeeById(id, true);
      toast.success("Employee deleted permanently");
      navigate('/admin/employees');
    } catch (err) {
      toast.error(err.message || "Failed to delete");
    }
  };

  const handleEditSave = async (formData) => {
    try {
      await updateEmployeeById(id, formData);
      toast.success("Employee profile updated successfully");
      setShowEditForm(false);
      fetchEmployeeData(); // Refresh data
    } catch (err) {
      toast.error(err.message || "Failed to update employee");
    }
  };

  if (loading) {
    return (
      <div className="employee-view-loading">
        <div className="spinner"></div>
        <p>Loading employee profile...</p>
      </div>
    );
  }

  if (error || !data.employee) {
    return (
      <div className="employee-view-error">
        <XCircle size={48} color="#ef4444" />
        <h2>{error || "Not Found"}</h2>
        <button className="back-link" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back
        </button>
      </div>
    );
  }

  const { employee, profile, auth, documents } = data;

  // Extract organization details (they come nested in employee in the latest API)
  const organization = {
    branch: employee.branch || data.organization?.branch,
    department: employee.department || data.organization?.department,
    designation: employee.designation || data.organization?.designation,
    shift: employee.shift || data.organization?.shift,
    employeeType: employee.employee_type || data.organization?.employeeType
  };

  const fullName = employee.full_name || employee.fullName || "";
  const initials = fullName
    ? fullName.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)
    : "??";

  const status = employee.employee_status || employee.status || "INACTIVE";
  const isActive = String(status).toUpperCase() === "ACTIVE";

  return (
    <div className="employee-view-container">
      {/* Edit Modal */}
      {showEditForm && (
        <EmployeeForm
          initial={data}
          onSave={handleEditSave}
          onClose={() => setShowEditForm(false)}
        />
      )}

      {/* Top Navigation */}
      <div className="view-nav">
        <button className="back-link" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Back
        </button>
      </div>

      {/* Hero Section */}
      <div className="profile-hero-card">
        <div className="hero-left">
          <div className="hero-avatar-wrapper">
            {profile?.profile_photo_url ? (
              <img
                src={profile.profile_photo_url}
                alt={fullName}
                className="hero-avatar-img"
                onError={(e) => {
                  e.target.style.display = "none";
                  if (e.target.nextSibling) e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className="hero-avatar-initials"
              style={{ display: profile?.profile_photo_url ? "none" : "flex" }}
            >
              {initials}
            </div>
          </div>

          <div className="hero-text">
            <h1>{fullName}</h1>
            <div className="hero-pills">
              <span className="pill code">{employee.employee_code || employee.employeeCode}</span>
              <span className={`pill status ${status.toLowerCase()}`}>
                {isActive ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                {status}
              </span>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="quick-stats">
            <div className="q-stat">
              <label>Department</label>
              <span>{organization?.department?.name || "-"}</span>
            </div>
            <div className="q-stat">
              <label>Designation</label>
              <span>{organization?.designation?.name || "-"}</span>
            </div>
          </div>
          <div className="hero-actions">
            <button className="btn-edit" onClick={() => setShowEditForm(true)}>
              <Pencil size={18} /> Edit Profile
            </button>
            {isActive ? (
              <button className="btn-warning-outline" onClick={handleDeactivate} disabled={toggling}>
                <Ban size={18} /> Deactivate
              </button>
            ) : (
              <button className="btn-primary" onClick={handleActivate} disabled={toggling}>
                <CheckCircle2 size={18} /> Activate
              </button>
            )}
            <button className="btn-danger" onClick={handleDeleteEmployee}>
              <Trash2 size={18} /> Delete
            </button>
          </div>
        </div>
      </div>

      <div className="profile-content-grid">
        {/* Main Details Column */}
        <div className="main-info-column">

          {/* Section: Employment Details */}
          <div className="details-card">
            <div className="details-card-header">
              <Briefcase size={20} />
              <h2>Employment Details</h2>
            </div>
            <div className="details-grid">
              <div className="detail-item">
                <label>Employee Code</label>
                <span>{employee.employee_code || employee.employeeCode}</span>
              </div>
              <div className="detail-item">
                <label>Status</label>
                <span className={status.toLowerCase()}>{status}</span>
              </div>
              <div className="detail-item">
                <label>Joining Date</label>
                <span>{employee.joining_date || employee.joiningDate ? new Date(employee.joining_date || employee.joiningDate).toLocaleDateString('en-GB') : "-"}</span>
              </div>
              <div className="detail-item">
                <label>Confirmation Date</label>
                <span>{(employee.confirmation_date || employee.confirmationDate) ? new Date(employee.confirmation_date || employee.confirmationDate).toLocaleDateString('en-GB') : "-"}</span>
              </div>
              <div className="detail-item">
                <label>Experience</label>
                <span>{employee.experience_years || employee.experienceYears || "0"} Years</span>
              </div>
              <div className="detail-item">
                <label>Notice Period</label>
                <span>{employee.notice_period_days || employee.noticePeriodDays || "0"} Days</span>
              </div>
            </div>
          </div>

          {/* Section: Organization Details */}
          <div className="details-card">
            <div className="details-card-header">
              <Building2 size={20} />
              <h2>Organization Details</h2>
            </div>
            <div className="details-grid">
              <div className="detail-item">
                <label>Branch</label>
                <span>{organization?.branch?.name || organization?.branch || "-"}</span>
              </div>
              <div className="detail-item">
                <label>Department</label>
                <span>{organization?.department?.name || organization?.department || "-"}</span>
              </div>
              <div className="detail-item">
                <label>Designation</label>
                <span>{organization?.designation?.name || organization?.designation || "-"}</span>
              </div>
              <div className="detail-item">
                <label>Employee Type</label>
                <span>{organization?.employeeType?.name || organization?.employeeType || "-"}</span>
              </div>
              <div className="detail-item">
                <label>Shift</label>
                <span>{organization?.shift?.name || organization?.shift || "-"}</span>
              </div>
              <div className="detail-item">
                <label>Job Location</label>
                <span>{employee.job_location || employee.jobLocation || "-"}</span>
              </div>
            </div>
          </div>

          {/* Section: Contact Details */}
          <div className="details-card">
            <div className="details-card-header">
              <Mail size={20} />
              <h2>Contact Details</h2>
            </div>
            <div className="details-grid">
              <div className="detail-item full-width">
                <label>Email Address</label>
                <span className="with-icon"><Mail size={14} /> {employee.email || "-"}</span>
              </div>
              <div className="detail-item">
                <label>Phone Number</label>
                <span className="with-icon"><Phone size={14} /> {employee.country_code || employee.countryCode || ""} {employee.phone || "-"}</span>
              </div>
              <div className="detail-item">
                <label>Emergency Contact</label>
                <span>{profile?.emergency_contact || profile?.emergencyContact || "-"}</span>
              </div>
            </div>
          </div>

          {/* Section: Personal Profile */}
          <div className="details-card">
            <div className="details-card-header">
              <User size={20} />
              <h2>Personal Profile</h2>
            </div>
            <div className="details-grid">
              <div className="detail-item">
                <label>Gender</label>
                <span>{profile?.gender || "-"}</span>
              </div>
              <div className="detail-item">
                <label>Date of Birth</label>
                <span>{profile?.dob ? new Date(profile.dob).toLocaleDateString('en-GB') : "-"}</span>
              </div>
              <div className="detail-item">
                <label>Religion</label>
                <span>{profile?.religion || "-"}</span>
              </div>
              <div className="detail-item">
                <label>Marital Status</label>
                <span>{profile?.marital_status || profile?.maritalStatus || "-"}</span>
              </div>
              <div className="detail-item">
                <label>Father's Name</label>
                <span>{profile?.father_name || profile?.fatherName || "-"}</span>
              </div>
              <div className="detail-item">
                <label>Qualification</label>
                <span>{profile?.qualification || "-"}</span>
              </div>
              <div className="detail-item full-width">
                <label>Current Address</label>
                <span className="with-icon"><MapPin size={14} /> {profile?.address || "-"}</span>
              </div>
              <div className="detail-item full-width">
                <label>Permanent Address</label>
                <span className="with-icon"><MapPin size={14} /> {profile?.permanent_address || profile?.permanentAddress || "-"}</span>
              </div>
            </div>
          </div>

          {/* Section: Salary & Bank */}
          <div className="details-card">
            <div className="details-card-header">
              <CreditCard size={20} />
              <h2>Salary & Banking</h2>
            </div>
            <div className="details-grid">
              <div className="detail-item">
                <label>Monthly Salary</label>
                <span>₹{Number(employee.salary || 0).toLocaleString()}</span>
              </div>
              <div className="detail-item">
                <label>Annual CTC</label>
                <span>₹{Number(employee.ctc_annual || employee.ctc_annual || 0).toLocaleString()}</span>
              </div>
              <div className="detail-item">
                <label>Bank Name</label>
                <span>{profile?.bank_name || profile?.bankName || "-"}</span>
              </div>
              <div className="detail-item">
                <label>Account Number</label>
                <span>{profile?.account_number || profile?.accountNumber || "-"}</span>
              </div>
              <div className="detail-item">
                <label>IFSC Code</label>
                <span>{profile?.ifsc_code || profile?.ifscCode || "-"}</span>
              </div>
              <div className="detail-item">
                <label>Bank Branch</label>
                <span>{profile?.bank_branch_name || profile?.bankBranchName || "-"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="sidebar-column">

          {/* Documents Section */}
          {/* Documents Section */}
          <div className="details-card sticky-card">
            <div className="details-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={20} />
                <h2>Documents</h2>
              </div>
            </div>

            <div className="sidebar-body" style={{ padding: '12px' }}>
              <h5 style={{
                margin: '0 0 8px 0',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: 'var(--text-secondary)'
              }}>
                Uploaded Documents
              </h5>

              <div className="document-stack" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                {documents.length > 0 ? (
                  documents.filter(d => !d.form_code).map((doc, idx) => (
                    <EmployeeDocumentCard
                      key={`uploaded-${idx}`}
                      document={{
                        form_name: doc.type || doc.name || "Uploaded Document",
                        generated: true, // It's uploaded, so it exists
                        view_url: doc.view_url || doc.viewUrl
                      }}
                      type="UPLOADED"
                      onAction={(d) => window.open(d.view_url, '_blank')}
                    />
                  ))
                ) : (
                  <div className="empty-state" style={{ padding: '12px', minHeight: 'auto' }}>
                    <p style={{ margin: 0, fontSize: '13px' }}>No uploaded documents</p>
                  </div>
                )}
              </div>

              <h5 style={{
                margin: '0 0 8px 0',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: 'var(--text-secondary)'
              }}>
                Company Documents
              </h5>

              <div
                className="document-stack"
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                {Array.isArray(data.companyForms) && data.companyForms.length > 0 ? (
                  data.companyForms.map((form) => {
                    const formCode = form.form_code || form.id;
                    const formName = form.form_name || form.title || form.name || "Document";

                    const existingDoc =
                      data.generatedMap && formCode
                        ? data.generatedMap[formCode]
                        : null;

                    const isGenerated = Boolean(existingDoc);

                    return (
                      <EmployeeDocumentCard
                        key={`company-form-${formCode}`}
                        type="COMPANY"
                        document={{
                          form_code: formCode,
                          form_name: formName,
                          generated: isGenerated
                        }}
                        onAction={() => {
                          if (isGenerated && existingDoc?.view_url) {
                            // VIEW existing generated document
                            window.open(
                              existingDoc.view_url || existingDoc.viewUrl,
                              "_blank",
                              "noopener,noreferrer"
                            );
                          } else {
                            // GENERATE new document
                            navigate(`/employees/${id}/generate-document/${formCode}`)

                          }
                        }}
                      />
                    );
                  })
                ) : (
                  <div
                    className="empty-state"
                    style={{ padding: "12px", minHeight: "auto" }}
                  >
                    <p style={{ margin: 0, fontSize: "13px" }}>
                      No company forms available
                    </p>
                  </div>
                )}
              </div>


            </div>
          </div>

          {/* Audit Section */}
          <div className="details-card">
            <div className="details-card-header">
              <Clock size={20} />
              <h2>System Audit</h2>
            </div>
            <div className="sidebar-body">
              <div className="audit-item">
                <label>Created At</label>
                <span>{employee.created_at || employee.createdAt ? new Date(employee.created_at || employee.createdAt).toLocaleString() : "-"}</span>
              </div>
              <div className="audit-item">
                <label>Last Updated</label>
                <span>{employee.updated_at || employee.updatedAt ? new Date(employee.updated_at || employee.updatedAt).toLocaleString() : "-"}</span>
              </div>
              <div className="audit-item">
                <label>Access Status</label>
                <span>{auth?.is_active || auth?.isActive ? "Login Enabled" : "Login Disabled"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
