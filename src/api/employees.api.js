import { API_BASE } from "../utils/apiBase";
import { authHeader } from "../utils/authHeader";
import { handleApiError } from "../utils/apiUtils";

// 1. Employee Core (ID-based)
export const getEmployeeById = async (id) =>
  fetch(`${API_BASE}/api/employees/${id}`, {
    headers: authHeader(),
  })
    .then(handleApiError)
    .then((res) => res.data);

export const createEmployee = async (formData) =>
  fetch(`${API_BASE}/api/employees`, {
    method: "POST",
    headers: { ...authHeader() },
    body: formData,
  }).then(handleApiError);

export const updateEmployeeById = async (id, formData) =>
  fetch(`${API_BASE}/api/employees/${id}`, {
    method: "PUT",
    headers: { ...authHeader() },
    body: formData,
  }).then(handleApiError);

export const listEmployees = async (params = {}) => {
  const query = new URLSearchParams();

  // Pagination
  if (params.limit) query.append("limit", params.limit);
  if (params.offset !== undefined) query.append("offset", params.offset);

  // Filters (BACKEND-DRIVEN)
  if (params.branch_id) query.append("branch_id", params.branch_id);
  if (params.department_id) query.append("department_id", params.department_id);
  if (params.designation_id) query.append("designation_id", params.designation_id);
  if (params.shift_id) query.append("shift_id", params.shift_id);
  if (params.employee_type_id) query.append("employee_type_id", params.employee_type_id);

  // Search & status
  if (params.search) query.append("search", params.search);
  if (params.status) query.append("status", params.status);

  // Sorting
  if (params.sort_by) query.append("sort_by", params.sort_by);

  const url = `${API_BASE}/api/employees?${query.toString()}`;

  return fetch(url, {
    headers: authHeader(),
  }).then(handleApiError);
};



export const deleteEmployeeById = async (id, force = false) => {
  const url = force
    ? `${API_BASE}/api/employees/${id}?force=true`
    : `${API_BASE}/api/employees/${id}`;
  return fetch(url, {
    method: "DELETE",
    headers: authHeader(),
  }).then(res => {
    if (!res.ok) return handleApiError(res);
    return res.json();
  });
};

export const activateEmployeeById = async (id) =>
  fetch(`${API_BASE}/api/employees/${id}/activate`, {
    method: "PATCH",
    headers: authHeader(),
  }).then(handleApiError);

export const toggleEmployeeStatusById = async (id, status) => {
  const payload = {
    employeeForm: {
      employee_status: status
    }
  };
  return fetch(`${API_BASE}/api/employees/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  }).then(handleApiError);
};

// 2. Documents (CODE-based)
export const getEmployeeDocuments = async (employee_code) =>
  fetch(`${API_BASE}/api/employee-documents/${employee_code}`, {
    headers: authHeader(),
  }).then(handleApiError);

// 3. Specials
export const getLastEmployeeCode = async (branch_id) => {
  if (!branch_id) {
    throw new Error("branch_id is required to generate employee code");
  }

  return fetch(
    `${API_BASE}/api/employees/last-code?branch_id=${branch_id}`,
    {
      headers: authHeader(),
    }
  ).then(handleApiError);
};

// Get available company document forms (dynamic)
export const getAvailableCompanyForms = async () =>
  fetch(
    `${API_BASE}/api/employees/company/forms/available`,
    {
      headers: authHeader(),
    }
  ).then(handleApiError);

// Upload new company government form
export const uploadCompanyGovernmentForm = async (formData) => {
  const data = new FormData();
  data.append('form_name', formData.formName);
  data.append('form_code', formData.formCode);
  data.append('version', formData.version);
  data.append('file', formData.file);

  return fetch(`${API_BASE}/api/employees/company/forms/upload`, {
    method: "POST",
    headers: authHeader(),
    body: data,
  }).then(handleApiError);
};

// Replace existing company government form
export const replaceCompanyGovernmentForm = async (formId, formData) => {
  const data = new FormData();
  data.append('form_name', formData.formName);
  data.append('form_code', formData.formCode);
  data.append('version', formData.version);
  data.append('file', formData.file);

  return fetch(`${API_BASE}/api/employees/company/forms/${formId}/replace`, {
    method: "POST",
    headers: authHeader(),
    body: data,
  }).then(handleApiError);
};

// Delete company government form
export const deleteCompanyGovernmentForm = async (formId) =>
  fetch(`${API_BASE}/api/employees/company/forms/${formId}`, {
    method: "DELETE",
    headers: authHeader(),
  }).then(handleApiError);

// Toggle company government form status
export const toggleCompanyGovernmentFormStatus = async (formId) =>
  fetch(`${API_BASE}/api/employees/company/forms/${formId}/status`, {
    method: "PATCH",
    headers: authHeader(),
  }).then(handleApiError);



// 4. Company Government Forms (FORM-CODE based)
export const getCompanyGovernmentForm = async (formCode) => {
  if (!formCode) {
    throw new Error("formCode is required");
  }

  return fetch(
    `${API_BASE}/api/admin/generate-docs/company/${formCode}`,
    {
      headers: authHeader(),
    }
  )
    .then(handleApiError)
};


// 5. Employee Summary (LIFETIME or MONTHLY)
export const getEmployeeSummary = async (employeeId, params = {}) => {
  const query = new URLSearchParams(params).toString();

  const url = query
    ? `${API_BASE}/api/admin/generate-docs/employees/${employeeId}/summary?${query}`
    : `${API_BASE}/api/admin/generate-docs/employees/${employeeId}/summary`;

  return fetch(url, {
    headers: authHeader(),
  })
    .then(handleApiError)
};




// 6. Employee Forms (FORM + PERIOD based)

/**
 * Get employees by form (available / missing)
 * Supports FY and MONTH based forms
 */
export const getEmployeesByForm = async (params = {}) => {
  const query = new URLSearchParams();

  if (params.formCode) query.append("formCode", params.formCode);
  if (params.periodType) query.append("periodType", params.periodType);

  // FY based
  if (params.financialYear) query.append("financialYear", params.financialYear);

  // MONTH based
  if (params.year) query.append("year", params.year);
  if (params.month) query.append("month", params.month);

  // Optional filters
  if (params.branchId) query.append("branchId", params.branchId);
  if (params.departmentId) query.append("departmentId", params.departmentId);

  const url = `${API_BASE}/api/admin/forms?${query.toString()}`;

  return fetch(url, {
    headers: authHeader(),
  }).then(handleApiError);
};

/**
 * Upload employee form (FY or MONTH based)
 */
export const uploadEmployeeForm = async (data) => {
  const formData = new FormData();

  formData.append("employeeId", data.employeeId);
  formData.append("formCode", data.formCode);
  formData.append("periodType", data.periodType);

  // FY based
  if (data.financialYear) {
    formData.append("financialYear", data.financialYear);
  }

  // MONTH based
  if (data.year) formData.append("year", data.year);
  if (data.month) formData.append("month", data.month);

  // IMPORTANT: backend expects "document"
  formData.append("document", data.file);

  return fetch(`${API_BASE}/api/admin/forms/upload`, {
    method: "POST",
    headers: authHeader(), // ❌ do NOT set Content-Type
    body: formData,
  }).then(handleApiError);
};
/**
 * Replace existing employee form (FY or MONTH based)
 */
export const replaceEmployeeForm = async (data) => {
  const formData = new FormData();

  formData.append("employeeId", data.employeeId);
  formData.append("formCode", data.formCode);
  formData.append("periodType", data.periodType);

  // FY based
  if (data.financialYear) {
    formData.append("financialYear", data.financialYear);
  }

  // MONTH based
  if (data.year) formData.append("year", data.year);
  if (data.month) formData.append("month", data.month);

  // IMPORTANT: backend expects "document"
  formData.append("document", data.file);

  return fetch(`${API_BASE}/api/admin/forms/replace`, {
    method: "PUT",
    headers: authHeader(), // ❌ do NOT set Content-Type
    body: formData,
  }).then(handleApiError);
};
/**
 * Delete existing employee form (FY or MONTH based)
 */
export const deleteEmployeeForm = async (data) => {
  return fetch(`${API_BASE}/api/admin/forms/delete`, {
    method: "DELETE",
    headers: {
      ...authHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      employeeId: data.employeeId,
      formCode: data.formCode,
      periodType: data.periodType,

      // FY based
      financialYear: data.financialYear || null,

      // MONTH based
      year: data.year || null,
      month: data.month || null,
    }),
  }).then(handleApiError);
};


