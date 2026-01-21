import { api, API_BASE } from "./api";


export { API_BASE };

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



/* ===================================================================================
 ADMIN – ATTENDANCE (UPGRADED)
 =================================================================================== */

/* 🔹 DAILY ATTENDANCE (ADMIN) */
export const fetchDailyAttendance = (params) =>
  api("/api/admin/attendance", {
    params: {
      viewType: "DAILY",
      ...params
    }
  });





/* 🔹 HISTORY ATTENDANCE (ADMIN – EMPLOYEE WISE) */
export const fetchHistoryAttendance = ({
  employeeId,
  from,
  to,
  page = 1,
  limit = 31
}) =>
  api("/api/admin/attendance", {
    params: {
      viewType: "HISTORY",
      employeeId,
      from,
      to,
      page,
      limit
    }
  });

export const fetchMonthlyAttendance = ({
  fromDate,
  toDate,
  page = 1,
  limit = 20,
  search = "",
  departmentId = "",
  shiftId = ""
}) =>
  api("/api/admin/attendance", {
    params: {
      viewType: "MONTHLY",
      fromDate,
      toDate,
      page,
      limit,
      search,
      departmentId,
      shiftId
    }
  });










/* ===================================================================================
   LEAVE MASTER (ADMIN)
   =================================================================================== */

/* 🔹 Get all leave types (company-wise) */
export const getLeaveTypes = () =>
  api("/api/admin/leave-master/leave-types");

/* 🔹 Create new leave type */
export const createLeaveType = (data) =>
  api("/api/admin/leave-master/leave-types", {
    method: "POST",
    body: JSON.stringify(data),
  });

/* 🔹 Update leave type */
export const updateLeaveType = (id, data) =>
  api(`/api/admin/leave-master/leave-types/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

/* 🔹 Enable / Disable leave type */
export const toggleLeaveTypeStatus = (id, isActive) =>
  api(`/api/admin/leave-master/leave-types/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ is_active: isActive }),
  });
export const deleteLeaveType = (id) =>
  api(`/api/admin/leave-master/leave-types/${id}`, {
    method: "DELETE",
  });
/* ===================================================================================
   LEAVE APPROVAL (ADMIN)
   =================================================================================== */

/* 🔹 Get all pending leave requests */
export const getPendingLeaveRequests = () =>
  api("/api/admin/leave-approval/pending");

/* 🔹 Approve leave request */
export const approveLeaveRequest = (requestId) =>
  api(`/api/admin/leave-approval/${requestId}/approve`, {
    method: "POST",
  });

/* 🔹 Reject leave request */
export const rejectLeaveRequest = (requestId, remarks) =>
  api(`/api/admin/leave-approval/${requestId}/reject`, {
    method: "POST",
    body: JSON.stringify({ remarks }),
  });
export const getLeaveHistory = () =>
  api("/api/admin/leave-approval/leave-history");



/* ===================================================================================
   PAYROLL (ADMIN)
   =================================================================================== */

/**
 * 🔹 Get employees for payroll processing
 * Query params: month, year
 */
export const getPayrollEmployees = ({ month, year }) =>
  api("/api/admin/payroll/employees", {
    params: { month, year }
  });

/**
 * 🔹 Generate payroll batch (DRAFT)
 * Stores payroll_employee_entries and creates payroll_batches
 */
export const generatePayrollBatch = (payload) =>
  api("/api/admin/payroll/generate", {
    method: "POST",
    body: JSON.stringify(payload),
  });


export const getLatestPayrollBatch = () =>
  api("/api/admin/payroll/batch/latest");
/**
 * 🔹 Get payroll batch details (for confirm screen)
 */
export const getPayrollBatchDetails = (batchId) =>
  api(`/api/admin/payroll/batches/${batchId}`);

/**
 * 🔹 Confirm payroll batch
 * - Generates payslip
 * - Uploads PDF to S3
 * - Sends email
 * - Locks batch
 */
export const confirmPayrollBatch = (batchId) =>
  api(`/api/admin/payroll/batches/${batchId}/confirm`, {
    method: "POST",
  });

export const generateEmployeeCode = (data) =>
  api("/api/admin/employee/code", {
    method: "POST",
    body: JSON.stringify(data),
  });





/* ===================================================================================
 COMPANY GOVERNMENT FORMS
 =================================================================================== */

export const getGovernmentForms = (params = {}) =>
  api("/api/admin/government-forms", {
    params
  });


export const createGovernmentForm = (formData) =>
  api("/api/admin/government-forms", {
    method: "POST",
    body: formData,
    isFormData: true
  });


export const updateGovernmentForm = (id, data) =>
  api(`/api/admin/government-forms/${id}`, {
    method: "PATCH",
    body: data,
    isFormData: data instanceof FormData
  });

/**
 * DELETE – permanently delete government form
 * (only works if status = INACTIVE)
 */
export const deleteGovernmentForm = (id) =>
  api(`/api/admin/government-forms/${id}`, {
    method: "DELETE"
  });