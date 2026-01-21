import React, { useState, useEffect } from "react";
import GovernmentFormsTable from "../components/GovernmentFormsTable";
import PDFPreviewModal from "../components/PDFPreviewModal";
import {
    getGovernmentForms,
    createGovernmentForm,
    updateGovernmentForm,
    deleteGovernmentForm
} from "../../../api/master.api";

const GovernmentForms = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Preview Modal State
    const [previewModalOpen, setPreviewModalOpen] = useState(false);
    const [previewingItem, setPreviewingItem] = useState(null);
    const [previewLoading, setPreviewLoading] = useState(false);

    // Fetch forms on component mount
    useEffect(() => {
        fetchForms();
    }, []);

    const fetchForms = async () => {
        try {
            setLoading(true);
            setError(null);
            // Fetch all forms - no category
            const response = await getGovernmentForms();
            // Response logic: array or { data: [] }
            setData(Array.isArray(response) ? response : response?.data || []);
        } catch (err) {
            setError(err.message || "Failed to fetch forms");
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (formData) => {
        try {
            const submitData = new FormData();
            submitData.append("form_name", formData.formName);
            submitData.append("form_code", formData.formCode);
            // Append category as required by backend
            if (formData.category) {
                submitData.append("category", formData.category);
            }

            if (formData.file) {
                submitData.append("file", formData.file);
            }
            if (formData.version) {
                submitData.append("version", formData.version);
            }

            const response = await createGovernmentForm(submitData);
            console.log("Upload response:", response);
            alert("Form uploaded successfully!");
            await fetchForms();
            return true;
        } catch (err) {
            console.error("Upload error:", err);
            alert("Failed to upload form: " + err.message);
            return false;
        }
    };

    const handleReplace = async (id, formData) => {
        try {
            const submitData = new FormData();
            // For replace/update, typically we might just send file + version
            // But updateGovernmentForm might handle metadata too.
            // Adjust payload based on what backend expects for "update" vs "replace"
            // User said: Replace / Toggle: updateGovernmentForm(id, data)
            // I'll assume standard FormData approach.

            if (formData.formName) submitData.append("form_name", formData.formName);
            if (formData.formCode) submitData.append("form_code", formData.formCode);
            if (formData.file) submitData.append("file", formData.file);
            if (formData.version) submitData.append("version", formData.version);

            const response = await updateGovernmentForm(id, submitData);
            console.log("Replace response:", response);
            alert("Form updated/replaced successfully!");
            await fetchForms();
            return true;
        } catch (err) {
            console.error("Replace error:", err);
            alert("Failed to replace form: " + err.message);
            return false;
        }
    };

    // Toggle Status
    const handleToggle = async (id) => {
        try {
            // User confirmed strict controller logic:
            // if (req.body.action === "TOGGLE_STATUS") ...

            // updateGovernmentForm in master.api.js uses isFormData: data instanceof FormData.
            // So passing a plain object is fine, it will be JSON stringified by the api wrapper (or handled as JSON).
            // We'll pass the exact object expected by the backend.

            const payload = { action: "TOGGLE_STATUS" };

            // NOTE: master.api.js implementation:
            // export const updateGovernmentForm = (id, data) =>
            //   api(/ api / admin / government - forms / ${ id } , {
            //     method: "PATCH",
            //     body: data,
            //     isFormData: data instanceof FormData
            //   });
            // If body is object and isFormData is false, api usually handles JSON.stringify.
            // If not, we might need JSON.stringify(payload).
            // Safest to let the API wrapper handle it if it supports objects, or stringify if we're unsure.
            // But typical api wrappers expect object for JSON.
            // Let's assume the API wrapper handles object -> JSON.

            await updateGovernmentForm(id, payload);
            await fetchForms();
            return true;
        } catch (err) {
            console.error("Toggle error:", err);
            alert("Failed to toggle status: " + err.message);
            return false;
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteGovernmentForm(id);
            alert("Form deleted permanently!");
            await fetchForms();
            return true;
        } catch (err) {
            console.error("Delete error:", err);
            alert("Failed to delete form: " + err.message);
            return false;
        }
    };

    // --- SMART PREVIEW / DOWNLOAD LOGIC ---

    const handleView = async (id) => {
        try {
            setPreviewLoading(true);
            // Fetch fresh details (checks backend, gets fresh signedUrl)
            const form = await getGovernmentForms({ id });

            if (form && (form.signedUrl || form.storage_url)) {
                setPreviewingItem({
                    ...form,
                    fileUrl: form.signedUrl || form.storage_url // Prioritize signedUrl
                });
                setPreviewModalOpen(true);
            } else {
                alert("Could not retrieve document URL.");
            }
        } catch (err) {
            console.error("View error:", err);
            alert("Failed to view document: " + err.message);
        } finally {
            setPreviewLoading(false);
        }
    };

    const handleDownload = async (id) => {
        try {
            // Fetch fresh details for download
            const form = await getGovernmentForms({ id });
            const url = form.signedUrl || form.storage_url;

            if (url) {
                window.open(url, "_blank");
            } else {
                alert("Could not retrieve download URL.");
            }
        } catch (err) {
            console.error("Download error:", err);
            alert("Failed to download document: " + err.message);
        }
    };

    return (
        <>
            <GovernmentFormsTable
                data={data}
                loading={loading}
                error={error}
                onRefresh={fetchForms}
                onView={handleView}
                onDownload={handleDownload}
                onUpload={handleUpload}
                onReplace={handleReplace}
                onToggle={handleToggle}
                onDelete={handleDelete}
            />

            {/* Preview Modal Hosted Here */}
            {previewingItem && (
                <PDFPreviewModal
                    isOpen={previewModalOpen}
                    onClose={() => {
                        setPreviewModalOpen(false);
                        setPreviewingItem(null);
                    }}
                    formId={previewingItem.id}
                    formName={previewingItem.form_name || "Document"}
                    fileUrl={previewingItem.fileUrl}
                />
            )}
        </>
    );
};

export default GovernmentForms;
