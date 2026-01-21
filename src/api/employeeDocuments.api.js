import { api } from "./api";

export const uploadDocument = async (formData) =>
  api("/api/employee-documents", {
    method: "POST",
    body: formData,
    isFormData: true,
  });

export const getDocuments = async (employeeId) =>
  api(`/api/employee-documents/${employeeId}`);

export const deleteDocument = async (id) =>
  api(`/api/employee-documents/${id}`, {
    method: "DELETE",
  });
