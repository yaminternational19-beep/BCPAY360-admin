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
