import { api } from "./api";

/* DEPARTMENTS */
export const getDepartments = () =>
  api("/api/departments");

/* DESIGNATIONS (REQUIRES departmentId) */
export const getDesignationsByDepartment = (departmentId) =>
  api(`/api/designations?departmentId=${departmentId}`);


