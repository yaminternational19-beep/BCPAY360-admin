import { API_BASE } from "../utils/apiBase";
import { authHeader } from "../utils/authHeader";

export const saveEmployeeProfile = async payload =>
  fetch(`${API_BASE}/api/employee-profiles`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  }).then(res => res.json());

export const getEmployeeProfile = async employeeId =>
  fetch(`${API_BASE}/api/employee-profiles/${employeeId}`, {
    headers: authHeader(),
  }).then(res => res.json());
