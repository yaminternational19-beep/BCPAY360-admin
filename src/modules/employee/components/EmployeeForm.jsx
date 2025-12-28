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

const EMPTY_FORM = {
  employee_code: "",
  full_name: "",
  email: "",
  password: "",
  employee_status: "ACTIVE",
  employee_type_id: "",
  shift_id: "",
  country_code: "+91",
  phone: "",
  joining_date: "",
  salary: "",
  confirmation_date: "",
  notice_period_days: "",
  payment_mode: "",
  salary_type: "",
  ctc_annual: "",
  company_name: "",
  job_location: "",
  site_location: "",
  has_multiple_branches: false,
  branch_ids: [],
  company_unit: "",
  department_id: "",
  designation_id: "",
  branch_id: "",
  experience_years: "",
  reference_name: "",
  reference_contact: "",

  weekly_off_type: "",
  ot_allowed: false,
  ot_rate: "",
  late_deduction_applicable: false,
  gender: "",
  dob: "",
  religion: "",
  father_name: "",
  marital_status: "",
  qualification: "",
  emergency_contact: "",
  address: "",
  permanent_address: "",
  profile_photo: null,
  bank_name: "",
  account_number: "",
  ifsc_code: "",
  branch_name: "",
  pan: "",
  aadhaar: "",
  uan_number: "",
  esic_number: "",
  pf_join_date: "",
  esic_join_date: "",
  is_disabled: false,
  esic_required: false,
  epf_required: false,
  pan_file: null,
  aadhaar_file: null,
  esic_form_1: null,
  epf_form_2: null,
  epf_form_11: null,
  form_16: null,
  form_f: null,
  appointment_letter: null,
  confirmation_letter: null,
  application_form: null,
  employee_photo_list: null,
  id_card: null,
  id_card_history: null,
  documents: [],
  pf_applicable: false,
  esi_applicable: false,

};

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

const MOCK_EMPLOYEE_TYPES = [
  { id: 1, type_name: "Permanent", name: "Permanent" },
  { id: 2, type_name: "Contract", name: "Contract" },
  { id: 3, type_name: "Intern", name: "Intern" },
  { id: 4, type_name: "Trainee", name: "Trainee" },
  { id: 5, type_name: "Consultant", name: "Consultant" },
];

const MOCK_SHIFTS = [
  { id: 1, shift_name: "General Shift", name: "General Shift", start_time: "09:00", end_time: "18:00" },
  { id: 2, shift_name: "Night Shift", name: "Night Shift", start_time: "22:00", end_time: "06:00" },
  { id: 3, shift_name: "Morning Shift", name: "Morning Shift", start_time: "06:00", end_time: "14:00" },
];

const EmployeeForm = ({ initial, onSave, onClose }) => {
  const isEdit = Boolean(initial);
  const authUser = JSON.parse(localStorage.getItem("auth_user")) || {};

  const [step, setStep] = useState(1);
  const [form, setForm] = useState(EMPTY_FORM);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [employeeTypes, setEmployeeTypes] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (initial) {
      setForm({
        ...EMPTY_FORM,
        ...initial,
        joining_date: initial.joining_date?.slice(0, 10) || "",
        dob: initial.dob?.slice(0, 10) || "",
        pf_join_date: initial.pf_join_date?.slice(0, 10) || "",
        esic_join_date: initial.esic_join_date?.slice(0, 10) || "",
        has_multiple_branches: Array.isArray(initial.branch_ids) && initial.branch_ids.length > 0,
        branch_ids: initial.branch_ids || [],
        branch_id: initial.branch_id || "",
        password: "",
      });

    } else {
      setForm({
        ...EMPTY_FORM,
        company_name: authUser?.company_name || authUser?.company || "",
        job_location: authUser?.location || "",
      });
    }
  }, [initial, authUser]);

  useEffect(() => {
    if (isEdit) return;
    getLastEmployeeCode()
      .then((res) => {
        if (res?.last_employee_code) {
          const next = Number(res.last_employee_code.replace(/\D/g, "")) + 1;
          setForm((p) => ({
            ...p,
            employee_code: `EMP${String(next).padStart(3, "0")}`,
          }));
        }
      })
      .catch(() => { });
  }, [isEdit]);

  useEffect(() => {
    if (!form.department_id || !form.branch_id) {
      setDesignations([]);
      return;
    }
    getDesignations(form.branch_id, form.department_id)
      .then(setDesignations)
      .catch(() => setDesignations([]));
  }, [form.department_id, form.branch_id]);

  useEffect(() => {
    getBranches()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBranches(data);
        } else {
          setBranches([]);
        }
      })
      .catch(() => {
        setBranches([]);
      });
  }, []);

  useEffect(() => {
    if (!form.branch_id) {
      setDepartments([]);
      return;
    }
    getDepartments(form.branch_id)
      .then(setDepartments)
      .catch(() => setDepartments([]));
  }, [form.branch_id]);

  useEffect(() => {
    if (!form.branch_id) {
      setEmployeeTypes(MOCK_EMPLOYEE_TYPES);
      setShifts(MOCK_SHIFTS);
      return;
    }

    getEmployeeTypes(form.branch_id)
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setEmployeeTypes(data);
        } else {
          setEmployeeTypes(MOCK_EMPLOYEE_TYPES);
        }
      })
      .catch(() => {
        setEmployeeTypes(MOCK_EMPLOYEE_TYPES);
      });

    getShifts(form.branch_id)
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setShifts(data);
        } else {
          setShifts(MOCK_SHIFTS);
        }
      })
      .catch(() => {
        setShifts(MOCK_SHIFTS);
      });
  }, [form.branch_id]);

  const change = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
  };

  const submit = () => {
    const payload = {
      ...form,
      department_id: Number(form.department_id) || null,
      designation_id: Number(form.designation_id) || null,
      employee_type_id: Number(form.employee_type_id) || null,
      shift_id: Number(form.shift_id) || null,

      salary: Number(form.salary) || 0,

      branch_id: form.has_multiple_branches
        ? null
        : Number(form.branch_id) || null,

      branch_ids: form.has_multiple_branches
        ? form.branch_ids
        : [],
    };
    if (isEdit) delete payload.password;
    onSave(payload);
  };

  const FileField = ({ label, field, accept }) => (
    <div className="upload-inline">
      <Upload />
      <input
        type="file"
        onChange={(e) => change(field, e.target.files[0])}
        accept={accept}
      />
      <span>{form[field]?.name || label}</span>
    </div>
  );

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

            <div className="form-grid">
              <div>
                <label>Employee Code</label>
                <input readOnly value={form.employee_code} />
              </div>
              <div>
                <label>Employee Status</label>
                <select
                  value={form.employee_status}
                  onChange={(e) => change("employee_status", e.target.value)}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            </div>

            <label>Full Name (As per Govt ID)</label>
            <input
              placeholder="Employee full name"
              value={form.full_name}
              onChange={(e) => change("full_name", e.target.value)}
            />

            <label>Email</label>
            <input
              placeholder="employee@email.com"
              value={form.email}
              onChange={(e) => change("email", e.target.value)}
            />

            <div className="form-grid">
              <div>
                <label>Country Code</label>
                <select
                  value={form.country_code}
                  onChange={(e) =>
                    change("country_code", e.target.value.split(" ")[0])
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
                  value={form.phone}
                  onChange={(e) =>
                    change("phone", e.target.value.replace(/\D/g, ""))
                  }
                />
              </div>
            </div>

            {!isEdit && (
              <>
                <label>Password</label>
                <div className="password-field">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create password"
                    value={form.password}
                    onChange={(e) => change("password", e.target.value)}
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

            <div className="form-grid">
              <div>
                <label>Employee Type</label>
                <select
                  value={form.employee_type_id || ""}
                  onChange={(e) => change("employee_type_id", e.target.value)}
                >
                  <option value="">Select Employee Type</option>
                  {employeeTypes?.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.type_name || type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Shift</label>
                <select
                  value={form.shift_id || ""}
                  onChange={(e) => change("shift_id", e.target.value)}
                >
                  <option value="">Select Shift</option>
                  {shifts?.map((shift) => (
                    <option key={shift.id} value={shift.id}>
                      {shift.shift_name || shift.name}
                      {shift.start_time && shift.end_time
                        ? ` (${shift.start_time} - ${shift.end_time})`
                        : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-grid">
              <div>
                <label>Joining Date</label>
                <input
                  type="date"
                  value={form.joining_date}
                  onChange={(e) => change("joining_date", e.target.value)}
                />
              </div>
              <div>
                <label>Salary</label>
                <input
                  type="number"
                  placeholder="Monthly salary"
                  value={form.salary}
                  onChange={(e) => change("salary", e.target.value)}
                />
              </div>
            </div>

            <div className="form-grid">
              <div>
                <label>Confirmation Date</label>
                <input
                  type="date"
                  value={form.confirmation_date}
                  onChange={(e) => change("confirmation_date", e.target.value)}
                />
              </div>
              <div>
                <label>Notice Period (Days)</label>
                <input
                  type="number"
                  placeholder="Notice period in days"
                  value={form.notice_period_days}
                  onChange={(e) => change("notice_period_days", e.target.value)}
                />
              </div>
            </div>



            <div className="form-grid">
              <div>
                <label>CTC (Annual)</label>
                <input
                  type="number"
                  placeholder="Cost to Company (Annual)"
                  value={form.ctc_annual}
                  onChange={(e) => change("ctc_annual", e.target.value)}
                />
              </div>
            </div>

            <h4>Company Details</h4>

            <label>Company Name</label>
            <input readOnly value={form.company_name} />

            <div className="form-grid">
              <div>
                <label>Job Location</label>
                <input
                  placeholder="City / Office"
                  value={form.job_location}
                  onChange={(e) => change("job_location", e.target.value)}
                />
              </div>
              <div>
                <label>Site Location</label>
                <input
                  placeholder="Site / Project location"
                  value={form.site_location}
                  onChange={(e) => change("site_location", e.target.value)}
                />
              </div>
            </div>

            <label>
              <input
                type="checkbox"
                checked={form.has_multiple_branches}
                onChange={(e) =>
                  change("has_multiple_branches", e.target.checked)
                }
              />
              Employee works in multiple branches
            </label>
            {form.has_multiple_branches && (
              <div className="form-grid">
                <div>
                  <label>Select Branches</label>
                  <select
                    multiple
                    value={form.branch_ids}
                    onChange={(e) =>
                      change(
                        "branch_ids",
                        Array.from(
                          e.target.selectedOptions,
                          (o) => Number(o.value)
                        )
                      )
                    }
                  >
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.branch_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            {!form.has_multiple_branches && (
              <div className="form-grid">
                <div>
                  <label>Branch</label>
                  <select
                    value={form.branch_id || ""}
                    onChange={(e) => change("branch_id", e.target.value)}
                  >
                    <option value="">Select Branch</option>
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.branch_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}


            <div className="form-grid">
              <div>
                <label>Department</label>
                <select
                  value={form.department_id}
                  onChange={(e) => change("department_id", e.target.value)}
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.department_name || dept.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Designation</label>
                <select
                  value={form.designation_id}
                  onChange={(e) => change("designation_id", e.target.value)}
                >
                  <option value="">Select Designation</option>
                  {designations.map((desg) => (
                    <option key={desg.id} value={desg.id}>
                      {desg.designation_name || desg.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>


            <div className="form-grid">
              <div>
                <label>Experience (Years)</label>
                <input
                  type="number"
                  placeholder="Total experience"
                  value={form.experience_years}
                  onChange={(e) => change("experience_years", e.target.value)}
                />
              </div>
            </div>

            <div className="form-grid">
              <div>
                <label>Reference Name</label>
                <input
                  placeholder="Reference name / source"
                  value={form.reference_name}
                  onChange={(e) => change("reference_name", e.target.value)}
                />
              </div>
              <div>
                <label>Reference Contact</label>
                <input
                  placeholder="Reference contact number"
                  value={form.reference_contact}
                  onChange={(e) =>
                    change(
                      "reference_contact",
                      e.target.value.replace(/\D/g, "")
                    )
                  }
                />
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
                  value={form.gender}
                  onChange={(e) => change("gender", e.target.value)}
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
                  value={form.dob}
                  onChange={(e) => change("dob", e.target.value)}
                />
              </div>
            </div>

            <label>Father's Name</label>
            <input
              value={form.father_name}
              onChange={(e) => change("father_name", e.target.value)}
            />

            <div className="form-grid">
              <div>
                <label>Religion</label>
                <input
                  value={form.religion}
                  onChange={(e) => change("religion", e.target.value)}
                />
              </div>
              <div>
                <label>Marital Status</label>
                <select
                  value={form.marital_status}
                  onChange={(e) => change("marital_status", e.target.value)}
                >
                  <option value="">Select</option>
                  <option>Single</option>
                  <option>Married</option>
                </select>
              </div>
            </div>

            <label>Qualification</label>
            <input
              value={form.qualification}
              onChange={(e) => change("qualification", e.target.value)}
            />

            <label>Emergency Contact</label>
            <input
              placeholder="Emergency mobile number"
              value={form.emergency_contact}
              onChange={(e) =>
                change("emergency_contact", e.target.value.replace(/\D/g, ""))
              }
            />

            <label>Address</label>
            <textarea
              placeholder="Current address"
              value={form.address}
              onChange={(e) => change("address", e.target.value)}
            />

            <label>Permanent Address</label>
            <textarea
              placeholder="Full permanent address"
              value={form.permanent_address}
              onChange={(e) => change("permanent_address", e.target.value)}
            />

            <label>Profile Picture</label>
            <div className="upload-inline">
              <ImageIcon />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => change("profile_photo", e.target.files[0])}
              />
              <span>{form.profile_photo?.name || "Upload profile photo"}</span>
            </div>

            <h4>Bank Details</h4>

            <label>Bank Name</label>
            <input
              value={form.bank_name}
              onChange={(e) => change("bank_name", e.target.value)}
            />

            <div className="form-grid">
              <div>
                <label>Account Number</label>
                <input
                  value={form.account_number}
                  onChange={(e) => change("account_number", e.target.value)}
                />
              </div>
              <div>
                <label>IFSC Code</label>
                <input
                  value={form.ifsc_code}
                  onChange={(e) =>
                    change("ifsc_code", e.target.value.toUpperCase())
                  }
                />
              </div>
            </div>

            <label>Branch Name</label>
            <input
              value={form.branch_name}
              onChange={(e) => change("branch_name", e.target.value)}
            />
          </div>
        )}

        {step === 3 && (
          <div className="emp-form-section">
            <h4>Statutory Info</h4>

            <div className="form-grid">
              <div>
                <label>UAN Number</label>
                <input
                  placeholder="Universal Account Number"
                  value={form.uan_number}
                  onChange={(e) => change("uan_number", e.target.value.replace(/\D/g, ""))}
                />
              </div>
              <div>
                <label>ESIC Number</label>
                <input
                  placeholder="ESIC Insurance Number"
                  value={form.esic_number}
                  onChange={(e) => change("esic_number", e.target.value)}
                />
              </div>
            </div>

            <div className="form-grid">
              <div>
                <label>PF Join Date</label>
                <input
                  type="date"
                  value={form.pf_join_date}
                  onChange={(e) => change("pf_join_date", e.target.value)}
                />
              </div>
              <div>
                <label>ESIC Join Date</label>
                <input
                  type="date"
                  value={form.esic_join_date}
                  onChange={(e) => change("esic_join_date", e.target.value)}
                />
              </div>
            </div>

            <label>
              <input
                type="checkbox"
                checked={form.is_disabled}
                onChange={(e) => change("is_disabled", e.target.checked)}
              />
              Is Disabled
            </label>

            <h4>Identity & Statutory Documents</h4>

            <div className="form-grid">
              <div>
                <label>PAN Number</label>
                <input
                  value={form.pan}
                  onChange={(e) => change("pan", e.target.value.toUpperCase())}
                />
              </div>
              <div>
                <label>PAN File</label>
                <FileField
                  label="Upload PAN Card"
                  field="pan_file"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </div>
            </div>

            <div className="form-grid">
              <div>
                <label>Aadhaar Number</label>
                <input
                  maxLength={12}
                  value={form.aadhaar}
                  onChange={(e) =>
                    change("aadhaar", e.target.value.replace(/\D/g, ""))
                  }
                />
              </div>
              <div>
                <label>Aadhaar File</label>
                <FileField
                  label="Upload Aadhaar Card"
                  field="aadhaar_file"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </div>
            </div>

            <div className="document-grid">
              <div>
                <label>ESIC Form-1</label>
                <FileField
                  label="Upload ESIC Form-1"
                  field="esic_form_1"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </div>
              <div>
                <label>EPF Form-2</label>
                <FileField
                  label="Upload EPF Form-2"
                  field="epf_form_2"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </div>
              <div>
                <label>EPF Form-11</label>
                <FileField
                  label="Upload EPF Form-11"
                  field="epf_form_11"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </div>
              <div>
                <label>Form-16</label>
                <FileField label="Upload Form-16" field="form_16" accept=".pdf" />
              </div>
              <div>
                <label>Form-F</label>
                <FileField
                  label="Upload Form-F"
                  field="form_f"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </div>
              <div>
                <label>Appointment Letter</label>
                <FileField
                  label="Upload Appointment Letter"
                  field="appointment_letter"
                  accept=".pdf"
                />
              </div>
              <div>
                <label>Confirmation Letter</label>
                <FileField
                  label="Upload Confirmation Letter"
                  field="confirmation_letter"
                  accept=".pdf"
                />
              </div>
              <div>
                <label>Application Form</label>
                <FileField
                  label="Upload Application Form"
                  field="application_form"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </div>
              <div>
                <label>Photo-wise Employee List</label>
                <FileField
                  label="Upload Photo-wise List"
                  field="employee_photo_list"
                  accept=".pdf,.xlsx,.xls"
                />
              </div>
              <div>
                <label>ID Card</label>
                <FileField
                  label="Upload ID Card"
                  field="id_card"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </div>
              <div>
                <label>ID Card History</label>
                <FileField
                  label="Upload ID Card History"
                  field="id_card_history"
                  accept=".pdf"
                />
              </div>
            </div>

            <h4>Other Documents</h4>
            <div className="upload-box">
              <Upload />
              <p>Additional Documents</p>
              <input
                type="file"
                multiple
                onChange={(e) =>
                  change("documents", [
                    ...form.documents,
                    ...Array.from(e.target.files),
                  ])
                }
              />
            </div>

            <ul className="file-list">
              {form.documents.map((f, i) => (
                <li key={i}>{f.name}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="emp-form-footer">
          {step > 1 && (
            <button onClick={() => setStep(step - 1)}>
              <ChevronLeft /> Back
            </button>
          )}
          {step < 3 && (
            <button className="primary" onClick={() => setStep(step + 1)}>
              Save & Continue <ChevronRight />
            </button>
          )}
          {step === 3 && (
            <button className="primary" onClick={submit}>
              Save Employee
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeForm;
