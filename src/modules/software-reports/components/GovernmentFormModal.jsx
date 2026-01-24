import React, { useState, useEffect } from "react";
import "../../../styles/shared/modern-ui.css";

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

    if (!editData && !file) {
      setValidationError("Please select a PDF file to upload");
      return;
    }

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
    <div className="modal-overlay" onClick={onClose} style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="modal-content fade-in" onClick={(e) => e.stopPropagation()} style={{
        backgroundColor: 'white', borderRadius: '12px', width: '90%', maxWidth: '500px',
        overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
      }}>
        <div className="modal-header" style={{
          padding: '20px', borderBottom: '1px solid #e2e8f0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>
            {editData ? "Replace Government Form" : "Upload New Government Form"}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>✕</button>
        </div>

        <div className="modal-body" style={{ padding: '24px' }}>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Form Code *</label>
            <input
              type="text"
              name="formCode"
              value={formData.formCode}
              onChange={handleInputChange}
              className="search-wrapper input"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              placeholder="e.g., PF_FORM_11"
              disabled={loading}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Form Name *</label>
            <input
              type="text"
              name="formName"
              value={formData.formName}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              placeholder="e.g., PF Declaration Form"
              disabled={loading}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>File Attachment (PDF) *</label>
            <div style={{
              border: '2px dashed #e2e8f0', borderRadius: '8px', padding: '20px',
              textAlign: 'center', cursor: 'pointer'
            }}>
              <input
                type="file"
                id="pdf-upload"
                accept=".pdf"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="pdf-upload" style={{ cursor: 'pointer' }}>
                {fileSelected ? (
                  <div style={{ color: '#16a34a', fontWeight: 600 }}>✓ {file.name}</div>
                ) : (
                  <div style={{ color: '#64748b' }}>Click to select PDF file</div>
                )}
              </label>
            </div>
          </div>

          {validationError && (
            <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '8px' }}>
              ⚠️ {validationError}
            </div>
          )}
        </div>

        <div className="modal-footer" style={{
          padding: '16px 24px', backgroundColor: '#f8fafc',
          display: 'flex', justifyContent: 'flex-end', gap: '12px'
        }}>
          <button className="btn-export" style={{ cursor: 'pointer' }} onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className="btn-primary" style={{ padding: '10px 24px' }} onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Upload Form"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GovernmentFormModal;
