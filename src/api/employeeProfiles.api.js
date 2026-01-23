import { api } from "./api";

export const saveEmployeeProfile = async (payload) =>
  api("/api/employee-profiles", {
    method: "POST",
    body: payload,
  });

export const getEmployeeProfile = async (employeeId) =>
  api(`/api/employee-profiles/${employeeId}`);

