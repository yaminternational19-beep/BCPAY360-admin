import { api } from "./api";

/* ===================================================================================
   BRANCHES
   =================================================================================== */
export const getBranches = () =>
  api("/api/branches");

export const createBranch = (data) =>
  api("/api/branches", { method: "POST", body: JSON.stringify(data) });

export const updateBranch = (id, data) =>
  api(`/api/branches/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const toggleBranchStatus = (id) =>
  api(`/api/branches/${id}/status`, { method: "PATCH" });

export const deleteBranch = (id) =>
  api(`/api/branches/${id}`, { method: "DELETE" });


/* ===================================================================================
   DEPARTMENTS
   Query Param: branch_id (Required)
   =================================================================================== */
export const getDepartments = (branchId) =>
  api(`/api/departments?branch_id=${branchId}`);

export const createDepartment = (data) =>
  api("/api/departments", { method: "POST", body: JSON.stringify(data) });

export const updateDepartment = (id, data) =>
  api(`/api/departments/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const deleteDepartment = (id) =>
  api(`/api/departments/${id}`, { method: "DELETE" });


/* ===================================================================================
   DESIGNATIONS
   Query Params: branch_id (Required), department_id (Required)
   =================================================================================== */
export const getDesignations = (branchId, departmentId) =>
  api(`/api/designations?branch_id=${branchId}&department_id=${departmentId}`);

export const createDesignation = (data) =>
  api("/api/designations", { method: "POST", body: JSON.stringify(data) });

export const updateDesignation = (id, data) =>
  api(`/api/designations/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const toggleDesignationStatus = (id) =>
  api(`/api/designations/${id}/status`, { method: "PATCH" });

export const deleteDesignation = (id) =>
  api(`/api/designations/${id}`, { method: "DELETE" });


/* ===================================================================================
   EMPLOYEE TYPES
   Query Param: branch_id (Required)
   =================================================================================== */
export const getEmployeeTypes = (branchId) =>
  api(`/api/employee-types?branch_id=${branchId}`);

export const createEmployeeType = (data) =>
  api("/api/employee-types", { method: "POST", body: JSON.stringify(data) });

export const updateEmployeeType = (id, data) =>
  api(`/api/employee-types/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const toggleEmployeeTypeStatus = (id) =>
  api(`/api/employee-types/${id}/status`, { method: "PATCH" });

export const deleteEmployeeType = (id) =>
  api(`/api/employee-types/${id}`, { method: "DELETE" });


/* ===================================================================================
   SHIFTS
   Query Param: branch_id (Required)
   =================================================================================== */
export const getShifts = (branchId) =>
  api(`/api/shifts?branch_id=${branchId}`);

export const createShift = (data) =>
  api("/api/shifts", { method: "POST", body: JSON.stringify(data) });

export const updateShift = (id, data) =>
  api(`/api/shifts/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const toggleShiftStatus = (id) =>
  api(`/api/shifts/${id}/status`, { method: "PATCH" });

export const deleteShift = (id) =>
  api(`/api/shifts/${id}`, { method: "DELETE" });



/* ===================================================================================
   HR USERS
   =================================================================================== */
export const getHRList = () =>
  api("/api/hr");

export const getHRDetails = (hrId) =>
  api(`/api/hr/${hrId}`);

export const createHR = (data) =>
  api("/api/hr", { method: "POST", body: JSON.stringify(data) });

export const updateHR = (id, data) =>
  api(`/api/hr/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const toggleHRStatus = (id) =>
  api(`/api/hr/${id}/status`, { method: "PATCH" });

export const deleteHR = (id) =>
  api(`/api/hr/${id}`, { method: "DELETE" });




/* ===================================================================================
   HR PERMISSIONS
   =================================================================================== */
export const getHRPermissions = (hrId) =>
  api(`/api/hr-permissions/${hrId}`);

export const saveHRPermissions = (hrId, payload) =>
  api(`/api/hr-permissions/${hrId}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const deleteHRPermission = (hrId, moduleKey) =>
  api(`/api/hr-permissions/${hrId}/${moduleKey}`, {
    method: "DELETE",
  });

export const resetHRPermissions = (hrId) =>
  api(`/api/hr-permissions/${hrId}`, {
    method: "DELETE",
  });


  

