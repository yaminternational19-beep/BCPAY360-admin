import { API_BASE } from "../utils/apiBase";
import { authHeader } from "../utils/authHeader";

export const getEmployee = async id =>
  fetch(`${API_BASE}/api/employees/${id}`, {
    headers: authHeader(),
  }).then(res => res.json());

export const createEmployee = async payload =>
  fetch(`${API_BASE}/api/employees`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  }).then(res => res.json());

export const listEmployees = async () =>
  fetch(`${API_BASE}/api/employees`, {
    headers: authHeader(),
  }).then(res => res.json());

export const updateEmployee = async (id, payload) =>
  fetch(`${API_BASE}/api/employees/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  }).then(res => res.json());

export const toggleEmployeeStatus = async id =>
  fetch(`${API_BASE}/api/employees/${id}/status`, {
    method: "PATCH",
    headers: authHeader(),
  });

export const deleteEmployee = async id =>
  fetch(`${API_BASE}/api/employees/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });
  
export const getLastEmployeeCode = async () =>
  fetch(`${API_BASE}/api/employees/last-code`, {
    headers: authHeader(),
  }).then(res => res.json());

