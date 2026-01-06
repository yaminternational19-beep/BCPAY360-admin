import { API_BASE } from "../utils/apiBase";
import { authHeader } from "../utils/authHeader";
import { handleApiError } from "../utils/apiUtils";

// 1. Employee Core (ID-based)
export const getEmployeeById = async (id) =>
  fetch(`${API_BASE}/api/employees/${id}`, {
    headers: authHeader(),
  }).then(handleApiError);

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
  if (params.page) query.append("page", params.page);
  if (params.limit) query.append("limit", params.limit);

  const queryString = query.toString();
  const url = queryString ? `${API_BASE}/api/employees?${queryString}` : `${API_BASE}/api/employees`;

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
export const getLastEmployeeCode = async () =>
  fetch(`${API_BASE}/api/employees/last-code`, {
    headers: authHeader(),
  }).then(handleApiError);
