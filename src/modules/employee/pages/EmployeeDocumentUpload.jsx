import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, UploadCloud, FileText } from "lucide-react";
import { useToast } from "../../../context/ToastContext";
import { uploadDocument } from "../../../api/employeeDocuments.api";
import "../styles/EmployeeView.css";
import "../styles/EmployeeDocuments.css";

const EmployeeDocumentUpload = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();

    const [documentType, setDocumentType] = useState("");
    const [documentNumber, setDocumentNumber] = useState("");
    const [file, setFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    useEffect(() => {
        // Pre-fill from navigation state if available
        if (location.state?.documentType) {
            setDocumentType(location.state.documentType);
        }
        if (location.state?.documentData?.document_number) {
            setDocumentNumber(location.state.documentData.document_number);
        }
    }, [location.state]);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!documentType) {
            toast.error("Please specify a document type");
            return;
        }
        if (!file) {
            toast.error("Please select a file to upload");
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData();
        formData.append("employee_id", id);
        formData.append("type", documentType);
        formData.append("document_number", documentNumber);
        formData.append("file", file);

        try {
            await uploadDocument(formData);
            toast.success("Document uploaded successfully");
            navigate(-1); // Go back to profile
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to upload document");
        } finally {
            setIsSubmitting(false);
        }
    };

    const predefinedTypes = [
        "Aadhaar Card",
        "PAN Card",
        "Driving License",
        "Passport",
        "Voter ID",
        "Bank Passbook",
        "Offer Letter",
        "Appointment Letter",
        "Experience Certificate",
        "Relieving Letter",
        "Resume/CV",
        "Other"
    ];

    return (
        <div className="employee-view-container" style={{ maxWidth: '800px' }}>
            {/* Header */}
            <div className="view-nav">
                <button className="btn-ghost" onClick={() => navigate(-1)}>
                    <ArrowLeft size={18} /> Back to Profile
                </button>
            </div>

            <div className="profile-hero-card" style={{ flexDirection: 'column', alignItems: 'stretch', padding: '0' }}>
                <div style={{
                    padding: 'var(--space-lg)',
                    borderBottom: '1px solid var(--border-default)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <h1 className="upload-title">
                            <UploadCloud size={24} color="var(--primary)" />
                            Upload Document
                        </h1>
                        <p style={{ margin: '8px 0 0 0', color: 'var(--text-secondary)' }}>
                            Add a new document to the employee's digital file
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: 'var(--space-xl)' }}>

                    <div className="form-group" style={{ marginBottom: 'var(--space-lg)' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                            Document Type <span style={{ color: 'var(--danger)' }}>*</span>
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                list="docTypes"
                                className="input-field"
                                placeholder="Select or type document name"
                                value={documentType}
                                onChange={(e) => setDocumentType(e.target.value)}
                            />
                            <datalist id="docTypes">
                                {predefinedTypes.map(t => <option key={t} value={t} />)}
                            </datalist>
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 'var(--space-lg)' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                            Document Number / ID (Optional)
                        </label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="e.g. XXXX-XXXX-XXXX"
                            value={documentNumber}
                            onChange={(e) => setDocumentNumber(e.target.value)}
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: 'var(--space-xl)' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                            Upload File <span style={{ color: 'var(--danger)' }}>*</span>
                        </label>

                        <div
                            className={`upload-zone ${dragActive ? 'drag-active' : ''}`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <input
                                type="file"
                                id="file-upload"
                                onChange={handleChange}
                                style={{ display: 'none' }}
                                accept="application/pdf,image/jpeg,image/png,image/jpg"
                            />

                            {!file ? (
                                <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                                    <div className="upload-icon-circle">
                                        <UploadCloud size={32} color="var(--primary)" />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: 'var(--text-base)', fontWeight: '600', marginBottom: '4px' }}>
                                            Click to upload or drag and drop
                                        </p>
                                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                                            PDF, PNG, JPG (max 10MB)
                                        </p>
                                    </div>
                                </label>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                                    <FileText size={48} color="var(--primary)" />
                                    <div style={{ textAlign: 'left' }}>
                                        <p style={{ fontSize: 'var(--text-base)', fontWeight: '600', margin: 0 }}>{file.name}</p>
                                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                        <button
                                            type="button"
                                            className="remove-file-btn"
                                            onClick={(e) => { e.preventDefault(); setFile(null); }}
                                        >
                                            Remove file
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={isSubmitting || !file}
                        >
                            {isSubmitting ? 'Uploading...' : 'Upload Document'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default EmployeeDocumentUpload;
