import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Eye, EyeOff } from "lucide-react";
import "../../../styles/AddHR.css";
import { createHR, updateHR } from "../../../api/master.api";
import { useBranch } from "../../../hooks/useBranch";
import { useToast } from "../../../context/ToastContext";

/* =========================
   Validators
========================= */
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isPhone = (v) => /^[6-9]\d{9}$/.test(v);

/* =========================
   HR FORM
========================= */
export default function HRForm({ initialData = null, onClose, onSuccess }) {
  const toast = useToast();
  const isEdit = Boolean(initialData);

  // USE GLOBAL BRANCH CONTEXT
  const { branches, selectedBranch } = useBranch();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    branch_id: initialData?.branch_id || selectedBranch || "",
    hr_code: initialData?.hr_code || "",

    full_name: initialData?.full_name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    password: "",

    joining_date: initialData?.joining_date || "",
    experience_years: initialData?.experience_years || "",
    job_location: initialData?.job_location || "",
    gender: initialData?.gender || "",
    dob: initialData?.dob || "",
    emergency_contact_name: initialData?.emergency_contact_name || "",
    emergency_contact_number: initialData?.emergency_contact_number || "",
    remarks: initialData?.remarks || "",
  });

  /* =========================
     CHANGE HANDLER
  ========================= */
  const change = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  /* =========================
     VALIDATION
  ========================= */
  const validateStep1 = (showToasts = true) => {
    const e = {};

    if (!form.branch_id) {
      e.branch_id = "Branch is required";
      if (showToasts) toast.error("Please select a branch");
    } else if (!form.hr_code || form.hr_code.trim().length < 3) {
      e.hr_code = "HR Code is required (min 3 chars)";
      if (showToasts) toast.error("HR Code is required (min 3 chars)");
    } else if (!form.full_name || form.full_name.trim().length < 2) {
      e.full_name = "Full name required";
      if (showToasts) toast.error("Full name is required");
    } else if (!form.email || !isEmail(form.email)) {
      e.email = "Valid email required";
      if (showToasts) toast.error("A valid email is required");
    } else if (!form.phone || !isPhone(form.phone)) {
      e.phone = "Valid phone required";
      if (showToasts) toast.error("A valid 10-digit phone number is required");
    } else if (!form.joining_date) {
      e.joining_date = "Joining date required";
      if (showToasts) toast.error("Joining date is required");
    } else if (!isEdit && (!form.password || form.password.length < 8)) {
      e.password = "Minimum 8 characters required";
      if (showToasts) toast.error("Password must be at least 8 characters");
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateAll = () => {
    // Check step 1 first
    if (!validateStep1(true)) {
      setStep(1); // Jump back to step 1 if error exists there
      return false;
    }

    const e = {};
    if (form.experience_years && Number(form.experience_years) < 0) {
      e.experience_years = "Invalid experience";
      toast.error("Experience years cannot be negative");
    }

    if (
      form.emergency_contact_number &&
      !isPhone(form.emergency_contact_number)
    ) {
      e.emergency_contact_number = "Invalid emergency number";
      toast.error("Emergency contact must be a valid 10-digit number");
    }

    setErrors((prev) => ({ ...prev, ...e }));
    return Object.keys(e).length === 0;
  };

  /* =========================
     SUBMIT
  ========================= */
  const submit = async () => {
    if (!validateAll()) return;

    setLoading(true);
    try {
      const payload = {
        branch_id: Number(form.branch_id),
        hr_code: form.hr_code.trim(),
        full_name: form.full_name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone,
        joining_date: form.joining_date,
        experience_years: form.experience_years ? Number(form.experience_years) : null,
        job_location: form.job_location || null,
        gender: form.gender || null,
        dob: form.dob || null,
        emergency_contact_name: form.emergency_contact_name || null,
        emergency_contact_number: form.emergency_contact_number || null,
        remarks: form.remarks || null,
      };

      if (!isEdit) payload.password = form.password;

      isEdit
        ? await updateHR(initialData.id, payload)
        : await createHR(payload);

      toast.success(`HR ${isEdit ? "updated" : "created"} successfully!`);
      onSuccess?.();
    } catch (err) {
      toast.error(err?.message || "Failed to save HR profile");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="emp-modal-backdrop">
      <div className="emp-modal">
        <div className="emp-modal-header">
          <h3>{isEdit ? "Edit HR" : "Add HR"}</h3>
          <span>Step {step} / 2</span>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="emp-step-tabs">
          <div className={step === 1 ? "step active" : "step"} onClick={() => setStep(1)}>
            Identity
          </div>
          <div
            className={step === 2 ? "step active" : "step"}
            onClick={() => validateStep1() && setStep(2)}
          >
            Profile
          </div>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="emp-form-section">
            <label>Branch *</label>
            <select value={form.branch_id} onChange={(e) => change("branch_id", e.target.value)}>
              <option value="">-- Select or Search Branch --</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>{b.branch_name}</option>
              ))}
            </select>
            {errors.branch_id && <span className="error-text">{errors.branch_id}</span>}

            <label>HR Code *</label>
            <input
              placeholder="e.g. HR001, COMP-HR-01"
              value={form.hr_code}
              onChange={(e) =>
                change("hr_code", e.target.value.toUpperCase().replace(/\s+/g, ""))
              }
            />
            {errors.hr_code && (
              <span className="error-text">{errors.hr_code}</span>
            )}

            <label>Full Name *</label>
            <input
              placeholder="Enter full name of the HR"
              value={form.full_name}
              onChange={(e) => change("full_name", e.target.value)}
            />
            {errors.full_name && <span className="error-text">{errors.full_name}</span>}

            <label>Email *</label>
            <input
              placeholder="Example: hr.name@company.com"
              value={form.email}
              onChange={(e) => change("email", e.target.value)}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}

            <label>Phone *</label>
            <input
              placeholder="10-digit mobile number"
              value={form.phone}
              maxLength={10}
              onChange={(e) => change("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}

            <label>Joining Date *</label>
            <input
              type="date"
              value={form.joining_date}
              onChange={(e) => change("joining_date", e.target.value)}
            />
            {errors.joining_date && <span className="error-text">{errors.joining_date}</span>}

            {!isEdit && (
              <>
                <label>Password *</label>
                <div className="password-field">
                  <input
                    placeholder="Create a strong password (min 8 chars)"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => change("password", e.target.value)}
                  />
                  <button type="button" onClick={() => setShowPassword((p) => !p)}>
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {errors.password && <span className="error-text">{errors.password}</span>}
              </>
            )}
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="emp-form-section">
            <label>Experience (Years)</label>
            <input
              placeholder="e.g. 5"
              type="number"
              value={form.experience_years}
              onChange={(e) => change("experience_years", e.target.value)}
            />

            <label>Job Location</label>
            <input
              placeholder="Enter city or office location"
              value={form.job_location}
              onChange={(e) => change("job_location", e.target.value)}
            />

            <label>Gender</label>
            <select value={form.gender} onChange={(e) => change("gender", e.target.value)}>
              <option value="">-- Select Gender --</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>

            <label>Date of Birth</label>
            <input
              type="date"
              value={form.dob}
              onChange={(e) => change("dob", e.target.value)}
            />

            <label>Emergency Contact Name</label>
            <input
              placeholder="Person to contact in emergency"
              value={form.emergency_contact_name}
              onChange={(e) => change("emergency_contact_name", e.target.value)}
            />

            <label>Emergency Contact Number</label>
            <input
              placeholder="10-digit contact number"
              value={form.emergency_contact_number}
              maxLength={10}
              onChange={(e) => change("emergency_contact_number", e.target.value.replace(/\D/g, "").slice(0, 10))}
            />

            <label>Remarks</label>
            <textarea
              placeholder="Any additional notes or information"
              value={form.remarks}
              onChange={(e) => change("remarks", e.target.value)}
            />
          </div>
        )}

        <div className="emp-form-footer">
          {step > 1 && <button onClick={() => setStep(step - 1)}><ChevronLeft /> Back</button>}
          {step < 2 && (
            <button
              className="hr-btn-next"
              onClick={() => validateStep1() && setStep(2)}
            >
              Next <ChevronRight />
            </button>
          )}
          {step === 2 && (
            <button
              className="hr-btn-submit"
              onClick={submit}
              disabled={loading}
            >
              {loading ? "Saving..." : (isEdit ? "Update HR Profile" : "Create HR Profile")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}