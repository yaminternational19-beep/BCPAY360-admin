import { API_BASE } from "../utils/apiBase";
import { authHeader } from "../utils/authHeader";

export const uploadDocument = async formData =>
  fetch(`${API_BASE}/api/employee-documents`, {
    method: "POST",
    headers: authHeader(),
    body: formData,
  }).then(res => res.json());

export const getDocuments = async employeeId =>
  fetch(`${API_BASE}/api/employee-documents/${employeeId}`, {
    headers: authHeader(),
  }).then(res => res.json());

export const deleteDocument = async id =>
  fetch(`${API_BASE}/api/employee-documents/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });
