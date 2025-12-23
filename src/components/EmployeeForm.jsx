import { useEffect, useState } from "react";
import "../styles/EmployeeForm.css";
import { getDesignationsByDepartment } from "../api/master.api";
import { getLastEmployeeCode } from "../api/employees.api";

const EMPTY_FORM = {
  employee_code: "",
  full_name: "",
  email: "",
  country_code: "+91",
  phone: "",
  department_id: "",
  designation_id: "",
  joining_date: "",
  salary: "",
  employment_type: "PERMANENT",
  password: "",
};

const EmployeeForm = ({ initial, onClose, onSave, departments = [] }) => {
  const isEdit = Boolean(initial);

  const [form, setForm] = useState(EMPTY_FORM);
  const [designations, setDesignations] = useState([]);
  const [loadingDesignations, setLoadingDesignations] = useState(false);
  const [lastEmpCode, setLastEmpCode] = useState("Loading...");

  /* PREFILL / RESET */
  useEffect(() => {
    if (initial) {
      setForm({
        ...EMPTY_FORM,
        ...initial,
        password: "",
        joining_date: initial.joining_date?.slice(0, 10) || "",
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [initial]);

  /* FETCH LAST EMPLOYEE CODE (ADD ONLY) */
  useEffect(() => {
    if (!isEdit) {
      setLastEmpCode("Loading...");
      getLastEmployeeCode()
        .then((res) =>
          setLastEmpCode(res.last_employee_code || "—")
        )
        .catch(() => setLastEmpCode("Unable to fetch"));
    }
  }, [isEdit]);

  /* LOAD DESIGNATIONS BY DEPARTMENT */
  useEffect(() => {
    if (!form.department_id) {
      setDesignations([]);
      return;
    }

    setLoadingDesignations(true);
    getDesignationsByDepartment(form.department_id)
      .then(setDesignations)
      .catch(() => setDesignations([]))
      .finally(() => setLoadingDesignations(false));
  }, [form.department_id]);

  const change = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  /* SUBMIT */
  const submit = (e) => {
    e.preventDefault();

    if (
      !form.employee_code ||
      !form.full_name ||
      !form.department_id ||
      !form.designation_id ||
      !form.joining_date ||
      Number(form.salary) <= 0
    ) {
      alert("Please fill all required fields correctly");
      return;
    }

    if (!isEdit && !form.password) {
      alert("Temporary password is required");
      return;
    }

    const payload = {
      employee_code: form.employee_code.trim(),
      full_name: form.full_name.trim(),
      email: form.email || null,
      phone: form.phone
        ? `${form.country_code}${form.phone}`
        : null,
      department_id: Number(form.department_id),
      designation_id: Number(form.designation_id),
      joining_date: form.joining_date,
      salary: Number(form.salary),
      employment_type: form.employment_type,
    };

    if (!isEdit) payload.password = form.password;

    onSave(payload);
  };

  useEffect(() => {
  let mounted = true;

  if (!isEdit) {
    setLastEmpCode("Loading...");
    getLastEmployeeCode()
      .then((res) => {
        if (mounted) {
          console.log("LAST CODE:", res);
          setLastEmpCode(res?.last_employee_code ?? "—");
        }
      })
      .catch(() => {
        if (mounted) setLastEmpCode("Unable to fetch");
      });
  }

  return () => {
    mounted = false;
  };
}, [isEdit]);


  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h3>{isEdit ? "Edit Employee" : "Add Employee"}</h3>
          <button onClick={onClose}>✕</button>
        </div>

        <form className="emp-form" onSubmit={submit}>
          {/* EMP CODE + NAME */}
          <div className="row">
            <div className="field">
              <input
                placeholder="Employee Code"
                value={form.employee_code}
                disabled={isEdit}
                onChange={(e) =>
                  change(
                    "employee_code",
                    e.target.value.toUpperCase()
                  )
                }
              />
              {!isEdit && (
                <small className="hint">
                  Last Employee ID for this company: <b>{lastEmpCode}</b>
                </small>
              )}

            </div>

            <input
              placeholder="Enter full name as per Government ID"
              value={form.full_name}
              onChange={(e) =>
                change("full_name", e.target.value)
              }
            />
          </div>

          {/* EMAIL + PHONE */}
          <div className="row">
            <input
              type="email"
              placeholder="example@gmail.com"
              value={form.email}
              onChange={(e) =>
                change("email", e.target.value)
              }
            />

            <div className="phone-group">
              <select
                value={form.country_code}
                onChange={(e) =>
                  change("country_code", e.target.value)
                }
              >
                <option value="+91">🇮🇳 +91</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
              </select>

              <input
                placeholder="Phone number"
                value={form.phone}
                onChange={(e) =>
                  change(
                    "phone",
                    e.target.value.replace(/\D/g, "")
                  )
                }
              />
            </div>
          </div>

          {/* PASSWORD */}
          {!isEdit && (
            <div className="row">
              <input
                type="password"
                placeholder="name@2025"
                value={form.password}
                onChange={(e) =>
                  change("password", e.target.value)
                }
              />
            </div>
          )}

          {/* DEPARTMENT + DESIGNATION */}
          <div className="row">
            <select
              value={form.department_id}
              onChange={(e) =>
                change("department_id", e.target.value)
              }
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.department_name}
                </option>
              ))}
            </select>

            <select
              value={form.designation_id}
              disabled={
                !form.department_id || loadingDesignations
              }
              onChange={(e) =>
                change("designation_id", e.target.value)
              }
            >
              <option value="">
                {loadingDesignations
                  ? "Loading..."
                  : "Select Designation"}
              </option>
              {designations.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.designation_name}
                </option>
              ))}
            </select>
          </div>

          {/* DATE + SALARY */}
          <div className="row">
            <input
              type="date"
              value={form.joining_date}
              onChange={(e) =>
                change("joining_date", e.target.value)
              }
            />
            <input
              type="number"
              min="1"
              placeholder="Salary (must be > 0)"
              value={form.salary}
              onChange={(e) =>
                change("salary", e.target.value)
              }
            />
          </div>

          {/* EMP TYPE */}
          <div className="row">
            <select
              value={form.employment_type}
              onChange={(e) =>
                change("employment_type", e.target.value)
              }
            >
              <option value="PERMANENT">Permanent</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERN">Intern</option>
            </select>
          </div>

          <div className="form-actions">
            <button className="btn primary" type="submit">
              Save
            </button>
            <button
              className="btn"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
