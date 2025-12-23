import { api } from "./api";

/* CREATE */
export const createEmployee = (payload) =>
  api("/api/employees", {
    method: "POST",
    body: JSON.stringify(payload),
  });

/* LIST */
export const getEmployees = (params = "") =>
  api(`/api/employees${params}`);

/* VIEW */
export const getEmployeeById = (id) =>
  api(`/api/employees/${id}`);

/* UPDATE */
export const updateEmployee = (id, payload) =>
  api(`/api/employees/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

/* STATUS */
export const toggleEmployeeStatus = (id) =>
  api(`/api/employees/${id}/status`, {
    method: "PATCH",
  });

/* BIODATA */
export const saveEmployeeBiodata = (id, payload) =>
  api(`/api/employees/${id}/biodata`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getEmployeeBiodata = (id) =>
  api(`/api/employees/${id}/biodata`);

/* LAST EMPLOYEE CODE */
export const getLastEmployeeCode = () =>
  api("/api/employees/last-code");
