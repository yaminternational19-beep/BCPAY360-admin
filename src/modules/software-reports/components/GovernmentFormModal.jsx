import React, { useState, useEffect } from "react";

const GovernmentFormModal = ({ isOpen, onClose, onSave, editData = null, loading = false }) => {
  const [formData, setFormData] = useState({
    formName: "",
    formCode: "",
    version: "1.0",
  });
  const [file, setFile] = useState(null);
  const [fileSelected, setFileSelected] = useState(false);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (editData) {
      setFormData({
        formName: editData.documentName || editData.form_name || "",
        formCode: editData.formCode || editData.form_code || "",
        version: editData.version || "1.0",
      });
      setFileSelected(false);
      setFile(null);
    } else {
      setFormData({
        formName: "",
        formCode: "",
        version: "1.0",
      });
      setFileSelected(false);
      setFile(null);
    }
    setValidationError("");
  }, [editData, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationError("");
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setValidationError("Please select a valid PDF file");
        setFile(null);
        setFileSelected(false);
        return;
      }
      setFile(selectedFile);
      setFileSelected(true);
      setValidationError("");
    }
  };

  const handleSave = () => {
    if (!formData.formName.trim()) {
      setValidationError("Form Name is required");
      return;
    }

    if (!formData.formCode.trim()) {
      setValidationError("Form Code is required");
      return;
    }

    // For new forms, file is required
    if (!editData && !file) {
      setValidationError("Please select a PDF file to upload");
      return;
    }

    // For editing, file should be optional/required depending on intent, usually required for replacement
    if (editData && !file) {
      setValidationError("Please select a PDF file to replace the existing one");
      return;
    }

    const submitData = {
      formName: formData.formName.trim(),
      formCode: formData.formCode.trim(),
      version: formData.version || "1.0",
      file: file,
    };

    onSave(submitData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editData ? "Replace Form" : "Add New Form"}</h2>
          <button className="modal-close" onClick={onClose} disabled={loading}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Form Code *</label>
            <input
              type="text"
              name="formCode"
              value={formData.formCode}
              onChange={handleInputChange}
              placeholder="e.g., FORM_11"
              maxLength="50"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Form Name *</label>
            <input
              type="text"
              name="formName"
              value={formData.formName}
              onChange={handleInputChange}
              placeholder="e.g., Application for Family Pension"
              maxLength="100"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Upload PDF *</label>
            <div className="file-upload">
              <input
                type="file"
                id="pdf-upload"
                accept=".pdf"
                onChange={handleFileChange}
                disabled={loading}
              />
              <label htmlFor="pdf-upload" className="file-upload-label">
                📁 Choose File
              </label>
              {fileSelected && file && (
                <span className="file-selected">✓ {file.name}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Version</label>
            <input
              type="text"
              name="version"
              value={formData.version}
              onChange={handleInputChange}
              placeholder="e.g., 1.0"
              maxLength="20"
              disabled={loading}
            />
          </div>

          {validationError && (
            <div className="form-error" style={{ color: "#d32f2f", marginBottom: "1rem" }}>
              ⚠️ {validationError}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSave} disabled={loading}>
            {loading ? "⏳ Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GovernmentFormModal;
