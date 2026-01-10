import { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  User,
  Building2,
  FileText,
  ChevronLeft,
  ChevronRight,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import "../../../styles/EmployeeForm.css";
import { getDepartments, getDesignations, getEmployeeTypes, getShifts, getBranches } from "../../../api/master.api";
import { getLastEmployeeCode } from "../../../api/employees.api";
import { useToast } from "../../../context/ToastContext";

const COUNTRY_CODES = [
  "+91 (India)",
  "+1 (USA)",
  "+44 (UK)",
  "+61 (Australia)",
  "+81 (Japan)",
  "+49 (Germany)",
  "+33 (France)",
  "+86 (China)",
  "+971 (UAE)",
  "+65 (Singapore)",
  "+92 (Pakistan)",
  "+880 (Bangladesh)",
];

const EmployeeForm = ({ initial, onSave, onClose }) => {
  const isEdit = Boolean(initial);
  const toast = useToast();

  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [employeeTypes, setEmployeeTypes] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  const [employeeForm, setEmployeeForm] = useState({
    employee_code: "",
    full_name: "",
    email: "",
    password: "",

    country_code: "+91",
    phone: "",

    employee_status: "ACTIVE",

    employee_type_id: "",
    shift_id: "",

    joining_date: "",
    confirmation_date: "",
    notice_period_days: "",

    experience_years: "",
    salary: "",
    ctc_annual: "",

    job_location: "",
    site_location: "",

    branch_id: "",
    department_id: "",
    designation_id: "",

    uan_number: "",
    esic_number: "",
  });


  const [profileForm, setProfileForm] = useState({
    gender: "",
    dob: "",
    father_name: "",
    religion: "",
    marital_status: "",

    qualification: "",

    emergency_contact: "",

    address: "",
    permanent_address: "",

    bank_name: "",
    account_number: "",
    ifsc_code: "",
    bank_branch_name: "",

    profile_photo: null,
  });


  const [documentsForm, setDocumentsForm] = useState({
  files: {},
  existing: [],
});



  // 1️⃣ Initialize Form for Edit
  useEffect(() => {
    if (!isEdit || !initial) return;

    // Handle initial data which might be structured differently
    const ef = initial.employee || initial;
    const pf = initial.profile || {};
    const docs = initial.documents || [];

    setEmployeeForm({
      employee_code: ef.employee_code || "",
      full_name: ef.full_name || "",
      email: ef.email || "",
      password: "", // Always empty on edit

      country_code: ef.country_code || "+91",
      phone: ef.phone || "",

      employee_status: ef.employee_status || "ACTIVE",

      employee_type_id: ef.employee_type_id || "",
      shift_id: ef.shift_id || "",

      joining_date: ef.joining_date ? ef.joining_date.split("T")[0] : "",
      confirmation_date: ef.confirmation_date ? ef.confirmation_date.split("T")[0] : "",
      notice_period_days: ef.notice_period_days || "",

      experience_years: ef.experience_years || "",
      salary: ef.salary || "",
      ctc_annual: ef.ctc_annual || "",

      job_location: ef.job_location || "",
      site_location: ef.site_location || "",

      branch_id: ef.branch_id || "",
      department_id: ef.department_id || "",
      designation_id: ef.designation_id || "",

      uan_number: docs.find(d => d.document_type === "UAN")?.document_number || "",
      esic_number: docs.find(d => d.document_type === "ESIC")?.document_number || "",
    });

    if (pf) {
      setProfileForm({
        gender: pf.gender || "",
        dob: pf.dob ? pf.dob.split("T")[0] : "",
        father_name: pf.father_name || "",
        religion: pf.religion || "",
        marital_status: pf.marital_status || "",
        qualification: pf.qualification || "",
        emergency_contact: pf.emergency_contact || "",
        address: pf.address || "",
        permanent_address: pf.permanent_address || "",
        bank_name: pf.bank_name || "",
        account_number: pf.account_number || "",
        ifsc_code: pf.ifsc_code || "",
        bank_branch_name: pf.bank_branch_name || "",
        profile_photo: null,
      });
    }

    // Map existing docs to the form numbers if needed
    // However, the backend expects 'pan', 'aadhaar' in documentsForm
    // We'll try to find them from the docs array if they are not already in pf (though pf doesn't have them)
    setDocumentsForm({
  files: {},
  existing: docs || [],
});

  }, [isEdit, initial]);

  // 2️⃣ Employee Code (only on create)
  useEffect(() => {
    if (isEdit) return;

    let mounted = true;

    getLastEmployeeCode()
      .then((res) => {
        if (mounted && res?.code) {
          setEmployeeForm((p) => ({
            ...p,
            employee_code: res.code,
          }));
        }
      })
      .catch((err) => {
        console.error("Failed to get employee code", err);
      });

    return () => {
      mounted = false;
    };
  }, [isEdit]);




  // 2️⃣ Load branches (on mount)
  useEffect(() => {
    let mounted = true;

    getBranches()
      .then((data) => {
        if (mounted) {
          setBranches(Array.isArray(data) ? data : []);
        }
      })
      .catch(() => {
        if (mounted) setBranches([]);
      });

    return () => {
      mounted = false;
    };
  }, []);



  // 3️⃣ Load departments (when branch changes)
  useEffect(() => {
    if (!employeeForm.branch_id) {
      setDepartments([]);
      return;
    }

    getDepartments(employeeForm.branch_id)
      .then(setDepartments)
      .catch(() => setDepartments([]));
  }, [employeeForm.branch_id]);


  // 4️⃣ Load designations (when branch + department changes)
  useEffect(() => {
    if (!employeeForm.branch_id || !employeeForm.department_id) {
      setDesignations([]);
      return;
    }

    getDesignations(
      employeeForm.branch_id,
      employeeForm.department_id
    )
      .then(setDesignations)
      .catch(() => setDesignations([]));
  }, [employeeForm.branch_id, employeeForm.department_id]);


  // 5️⃣ Load employee types & shifts (when branch changes)
  useEffect(() => {
    if (!employeeForm.branch_id) {
      setEmployeeTypes([]);
      setShifts([]);
      return;
    }

    getEmployeeTypes(employeeForm.branch_id)
      .then((data) => {
        setEmployeeTypes(Array.isArray(data) ? data : []);
      })
      .catch(() => setEmployeeTypes([]));

    getShifts(employeeForm.branch_id)
      .then((data) => {
        setShifts(Array.isArray(data) ? data : []);
      })
      .catch(() => setShifts([]));
  }, [employeeForm.branch_id]);



  const changeEmployee = (k, v) => {
    setEmployeeForm(p => ({ ...p, [k]: v }));
  };

  const changeProfile = (k, v) => {
    setProfileForm(p => ({ ...p, [k]: v }));
  };


  const submit = async () => {
    // 1. Basic Client-side Validation
    if (!employeeForm.full_name?.trim()) return toast.error("Full Name is required");
    if (!employeeForm.email?.trim()) return toast.error("Email is required");
    if (!employeeForm.joining_date) return toast.error("Joining Date is required");
    if (!employeeForm.branch_id) return toast.error("Branch is required");
    if (!employeeForm.department_id) return toast.error("Department is required");
    if (!employeeForm.designation_id) return toast.error("Designation is required");

    if (!isEdit && !employeeForm.password?.trim()) {
      return toast.error("Password is required for new employees");
    }

    setIsSaving(true);
    try {
      // Build FormData
      const formData = new FormData();

      // JSON parts
      const employeeData = {
        ...employeeForm,
        employee_type_id: employeeForm.employee_type_id ? Number(employeeForm.employee_type_id) : null,
        shift_id: employeeForm.shift_id ? Number(employeeForm.shift_id) : null,
        branch_id: employeeForm.branch_id ? Number(employeeForm.branch_id) : null,
        department_id: employeeForm.department_id ? Number(employeeForm.department_id) : null,
        designation_id: employeeForm.designation_id ? Number(employeeForm.designation_id) : null,
        salary: employeeForm.salary ? Number(employeeForm.salary) : null,
        ctc_annual: employeeForm.ctc_annual ? Number(employeeForm.ctc_annual) : null,
        experience_years: employeeForm.experience_years ? Number(employeeForm.experience_years) : null,
        notice_period_days: employeeForm.notice_period_days ? Number(employeeForm.notice_period_days) : null,
      };

      if (isEdit) {
        delete employeeData.password;
      }

      formData.append("employeeForm", JSON.stringify(employeeData));
      formData.append("profileForm", JSON.stringify(profileForm));

      // Build documentsForm ONLY from uploaded files
      const documentsMeta = {};

Object.keys(documentsForm.files || {}).forEach((key) => {
  documentsMeta[key] = "UPLOADED";
});

// 🔥 THIS LINE WAS MISSING
formData.append("documentsForm", JSON.stringify(documentsMeta));



      // Profile Photo
      if (profileForm.profile_photo instanceof File) {
        formData.append("profile_photo", profileForm.profile_photo);
      }

      // Dynamic Files from documentsForm.files
      Object.entries(documentsForm.files || {}).forEach(([type, file]) => {
        if (file instanceof File) {
          formData.append(type, file);
        }
      });

      console.log("🚀 Submitting FormData for Employee...");
      console.log("📦 documentsForm.files:", documentsForm.files);
console.log("📦 documentsMeta:", documentsMeta);

for (let pair of formData.entries()) {
  console.log("🧾 FormData:", pair[0], pair[1]);
}

      await onSave(formData);
      // toast is handled in parent handleSave or can be handled here if we await it 
    } catch (err) {
      console.error("Submit error:", err);
      toast.error(err.message || "Failed to save employee");
    } finally {
      setIsSaving(false);
    }
  };


  const FileField = ({ label, field, accept }) => {
    const existing = documentsForm.existing?.find(d => d.document_type === field);

    return (
      <div className="upload-inline">
        <Upload />
        <input
          type="file"
          accept={accept}
          onChange={(e) => {
            const file = e.target.files[0];
            if (!file) return;

            setDocumentsForm((p) => ({
              ...p,
              files: {
                ...p.files,
                [field]: file,
              },
            }));
          }}
        />
        <div className="file-info">
          {documentsForm.files?.[field] ? (
            <span className="new-file">{documentsForm.files[field].name} (Ready to upload)</span>
          ) : existing ? (
            <a href={existing.view_url || existing.url} target="_blank" rel="noreferrer" className="existing-file">
              View Existing {field}
            </a>
          ) : (
            <span>{label}</span>
          )}
        </div>
      </div>
    );
  };


  return (
    <div className="emp-modal-backdrop">
      <div className="emp-modal">
        <div className="emp-modal-header">
          <h3>{isEdit ? "Edit Employee" : "Add Employee"}</h3>
          <span>Step {step} / 3</span>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="emp-step-tabs">
          <div className={step === 1 ? "step active" : "step"}>
            <User /> Employee
          </div>
          <div className={step === 2 ? "step active" : "step"}>
            <Building2 /> Bio Data
          </div>
          <div className={step === 3 ? "step active" : "step"}>
            <FileText /> Documents
          </div>
        </div>

        {step === 1 && (
          <div className="emp-form-section">
            <h4>Employee & Login Information</h4>

            {/* Employee Code + Status */}
            <div className="form-grid">
              <div>
                <label>Employee Code</label>
                <input readOnly value={employeeForm.employee_code} />
              </div>
              <div>
                <label>Employee Status</label>
                <select
                  value={employeeForm.employee_status}
                  onChange={(e) =>
                    changeEmployee("employee_status", e.target.value)
                  }
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            </div>

            {/* Name + Email */}
            <label>Full Name (As per Govt ID)</label>
            <input
              placeholder="Employee full name"
              value={employeeForm.full_name}
              onChange={(e) =>
                changeEmployee("full_name", e.target.value)
              }
            />

            <label>Email</label>
            <input
              placeholder="employee@email.com"
              value={employeeForm.email}
              onChange={(e) =>
                changeEmployee("email", e.target.value)
              }
            />

            {/* Phone */}
            <div className="form-grid">
              <div>
                <label>Country Code</label>
                <select
                  value={employeeForm.country_code}
                  onChange={(e) =>
                    changeEmployee(
                      "country_code",
                      e.target.value.split(" ")[0]
                    )
                  }
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>Phone Number</label>
                <input
                  placeholder="Mobile number"
                  value={employeeForm.phone}
                  onChange={(e) =>
                    changeEmployee(
                      "phone",
                      e.target.value.replace(/\D/g, "")
                    )
                  }
                />
              </div>
            </div>

            {/* Password (Create only) */}
            {!isEdit && (
              <>
                <label>Password</label>
                <div className="password-field">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create password"
                    value={employeeForm.password}
                    onChange={(e) =>
                      changeEmployee("password", e.target.value)
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </>
            )}
            {/* Org Mapping */}
            <div className="form-grid">
              <div>
                <label>Branch</label>
                <select
                  value={employeeForm.branch_id}
                  onChange={(e) =>
                    changeEmployee("branch_id", e.target.value)
                  }
                >
                  <option value="">Select Branch</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.branch_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Type + Shift */}
            <div className="form-grid">
              <div>
                <label>Employee Type</label>
                <select
                  value={employeeForm.employee_type_id}
                  onChange={(e) =>
                    changeEmployee("employee_type_id", e.target.value)
                  }
                >
                  <option value="">Select Employee Type</option>
                  {employeeTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.type_name || type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Shift</label>
                <select
                  value={employeeForm.shift_id}
                  onChange={(e) =>
                    changeEmployee("shift_id", e.target.value)
                  }
                >
                  <option value="">Select Shift</option>
                  {shifts.map((shift) => (
                    <option key={shift.id} value={shift.id}>
                      {shift.shift_name || shift.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dates */}
            <div className="form-grid">

              <div>
                <label>Confirmation Date</label>
                <input
                  type="date"
                  value={employeeForm.confirmation_date}
                  onChange={(e) =>
                    changeEmployee("confirmation_date", e.target.value)
                  }
                />
              </div>

              <div>
                <label>Joining Date</label>
                <input
                  type="date"
                  value={employeeForm.joining_date}
                  onChange={(e) =>
                    changeEmployee("joining_date", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Salary */}
            <div className="form-grid">
              <div>
                <label>Salary (Monthly)</label>
                <input
                  type="number"
                  value={employeeForm.salary}
                  onChange={(e) =>
                    changeEmployee("salary", e.target.value)
                  }
                />
              </div>
              <div>
                <label>CTC (Annual)</label>
                <input
                  type="number"
                  value={employeeForm.ctc_annual}
                  onChange={(e) =>
                    changeEmployee("ctc_annual", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Experience */}
            <div className="form-grid">
              <div>
                <label>Experience (Years)</label>
                <input
                  type="number"
                  step="0.1"
                  value={employeeForm.experience_years}
                  onChange={(e) =>
                    changeEmployee("experience_years", e.target.value)
                  }
                />
              </div>
              <div>
                <label>Notice Period (Days)</label>
                <input
                  type="number"
                  value={employeeForm.notice_period_days}
                  onChange={(e) =>
                    changeEmployee("notice_period_days", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Location */}
            <div className="form-grid">
              <div>
                <label>Job Location</label>
                <input
                  value={employeeForm.job_location}
                  onChange={(e) =>
                    changeEmployee("job_location", e.target.value)
                  }
                />
              </div>
              <div>
                <label>Site Location</label>
                <input
                  value={employeeForm.site_location}
                  onChange={(e) =>
                    changeEmployee("site_location", e.target.value)
                  }
                />
              </div>
            </div>



            <div className="form-grid">
              <div>
                <label>Department</label>
                <select
                  value={employeeForm.department_id}
                  onChange={(e) =>
                    changeEmployee("department_id", e.target.value)
                  }
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.department_name || d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Designation</label>
                <select
                  value={employeeForm.designation_id}
                  onChange={(e) =>
                    changeEmployee("designation_id", e.target.value)
                  }
                >
                  <option value="">Select Designation</option>
                  {designations.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.designation_name || g.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}


        {step === 2 && (
          <div className="emp-form-section">
            <h4>Personal Information</h4>

            <div className="form-grid">
              <div>
                <label>Gender</label>
                <select
                  value={profileForm.gender}
                  onChange={(e) =>
                    changeProfile("gender", e.target.value)
                  }
                >
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label>Date of Birth</label>
                <input
                  type="date"
                  value={profileForm.dob}
                  onChange={(e) =>
                    changeProfile("dob", e.target.value)
                  }
                />
              </div>
            </div>

            <label>Father's Name</label>
            <input
              value={profileForm.father_name}
              onChange={(e) =>
                changeProfile("father_name", e.target.value)
              }
            />

            <div className="form-grid">
              <div>
                <label>Religion</label>
                <input
                  value={profileForm.religion}
                  onChange={(e) =>
                    changeProfile("religion", e.target.value)
                  }
                />
              </div>

              <div>
                <label>Marital Status</label>
                <select
                  value={profileForm.marital_status}
                  onChange={(e) =>
                    changeProfile("marital_status", e.target.value)
                  }
                >
                  <option value="">Select</option>
                  <option>Single</option>
                  <option>Married</option>
                </select>
              </div>
            </div>

            <label>Qualification</label>
            <input
              value={profileForm.qualification}
              onChange={(e) =>
                changeProfile("qualification", e.target.value)
              }
            />

            <label>Emergency Contact</label>
            <input
              placeholder="Emergency mobile number"
              value={profileForm.emergency_contact}
              onChange={(e) =>
                changeProfile(
                  "emergency_contact",
                  e.target.value.replace(/\D/g, "")
                )
              }
            />

            <label>Address</label>
            <textarea
              placeholder="Current address"
              value={profileForm.address}
              onChange={(e) =>
                changeProfile("address", e.target.value)
              }
            />

            <label>Permanent Address</label>
            <textarea
              placeholder="Full permanent address"
              value={profileForm.permanent_address}
              onChange={(e) =>
                changeProfile("permanent_address", e.target.value)
              }
            />

            <label>Profile Picture</label>
            <div className="upload-inline">
              <ImageIcon />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    changeProfile("profile_photo", file);
                  }
                }}
              />
              <div className="file-info">
                {profileForm.profile_photo ? (
                  <span className="new-file">{profileForm.profile_photo.name} (Ready to upload)</span>
                ) : initial?.profile?.profile_photo ? (
                  <a href={initial.profile.profile_photo} target="_blank" rel="noreferrer" className="existing-file">
                    View Existing Photo
                  </a>
                ) : (
                  <span>Upload profile photo</span>
                )}
              </div>
            </div>

            <h4>Bank Details</h4>

            <label>Bank Name</label>
            <input
              value={profileForm.bank_name}
              onChange={(e) =>
                changeProfile("bank_name", e.target.value)
              }
            />

            <div className="form-grid">
              <div>
                <label>Account Number</label>
                <input
                  value={profileForm.account_number}
                  onChange={(e) =>
                    changeProfile("account_number", e.target.value)
                  }
                />
              </div>

              <div>
                <label>IFSC Code</label>
                <input
                  value={profileForm.ifsc_code}
                  onChange={(e) =>
                    changeProfile(
                      "ifsc_code",
                      e.target.value.toUpperCase()
                    )
                  }
                />
              </div>
            </div>

            <label>Bank Branch Name</label>
            <input
              value={profileForm.bank_branch_name}
              onChange={(e) =>
                changeProfile("bank_branch_name", e.target.value)
              }
            />
          </div>
        )}


        {step === 3 && (
          <div className="emp-form-section">
            <h4>Statutory Information</h4>

            {/* ===== Document Numbers ===== */}
            <div className="form-grid">
              <div>
                <label>UAN Number</label>
                <input
                  placeholder="Universal Account Number"
                  value={employeeForm.uan_number}
                  onChange={(e) =>
                    changeEmployee("uan_number", e.target.value.replace(/\D/g, ""))
                  }
                />
              </div>

              <div>
                <label>ESIC Number</label>
                <input
                  placeholder="ESIC Insurance Number"
                  value={employeeForm.esic_number}
                  onChange={(e) =>
                    changeEmployee("esic_number", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="form-grid">
              <div>
                <label>PAN Number</label>
                <input
  value={employeeForm.pan_number || ""}
  onChange={(e) =>
    changeEmployee("pan_number", e.target.value.toUpperCase())
  }
/>

              </div>

              <div>
                <label>Aadhaar Number</label>
                <input
  maxLength={12}
  value={employeeForm.aadhaar_number || ""}
  onChange={(e) =>
    changeEmployee("aadhaar_number", e.target.value.replace(/\D/g, ""))
  }
/>

              </div>
            </div>

            <h4>Upload Documents</h4>

            <div className="document-grid">
              {[
                ["PAN Card", "PAN"],
                ["Aadhaar Card", "AADHAAR"],
                ["ESIC Form-1", "ESIC_FORM_1"],
                ["EPF Form-2", "EPF_FORM_2"],
                ["EPF Form-11", "EPF_FORM_11"],
                ["Form-16", "FORM_16"],
                ["Form-F", "FORM_F"],
                ["Appointment Letter", "APPOINTMENT_LETTER"],
                ["Confirmation Letter", "CONFIRMATION_LETTER"],
                ["Application Form", "APPLICATION_FORM"],
                ["ID Card", "ID_CARD"],
              ].map(([label, type]) => (
                <div key={type}>
                  <label>{label}</label>
                  <FileField
                    label={`Upload ${label}`}
                    field={type}
                    accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls"
                  />
                </div>
              ))}
            </div>
          </div>
        )}



        <div className="emp-form-footer">
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} disabled={isSaving}>
              <ChevronLeft /> Back
            </button>
          )}

          {step < 3 && (
            <button className="primary" onClick={() => setStep(step + 1)} disabled={isSaving}>
              Save & Continue <ChevronRight />
            </button>
          )}

          {step === 3 && (
            <button className="primary" onClick={submit} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Employee"}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default EmployeeForm;
