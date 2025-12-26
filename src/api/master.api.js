import { api } from "./api";

/* DEPARTMENTS */
export const getDepartments = () =>
  api("/api/departments");

/* DESIGNATIONS (REQUIRES departmentId) */
export const getDesignationsByDepartment = (departmentId) =>
  api(`/api/designations?departmentId=${departmentId}`);

/* EMPLOYEE TYPES */
export const getEmployeeTypes = () =>
  api("/api/employee-types");

/* SHIFTS */
export const getShifts = () =>
  api("/api/shifts");


