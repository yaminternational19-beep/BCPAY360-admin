import React, { useState, useEffect } from "react";

const GovtFormModal = ({ isOpen, onClose, onSave, editData = null }) => {
  const [formData, setFormData] = useState({
    documentName: "",
    fileName: "",
    version: "1.0",
    status: "Active",
  });

  const [fileSelected, setFileSelected] = useState(false);

  useEffect(() => {
    if (editData) {
      setFormData(editData);
      setFileSelected(true);
    } else {
      setFormData({
        documentName: "",
        fileName: "",
        version: "1.0",
        status: "Active",
      });
      setFileSelected(false);
    }
  }, [editData, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        fileName: file.name,
      }));
      setFileSelected(true);
    }
  };

  const handleSave = () => {
    if (!formData.documentName.trim()) {
      alert("Document Name is required");
      return;
    }
    if (!fileSelected) {
      alert("Please select a PDF file");
      return;
    }
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editData ? "Replace Form" : "Add New Form"}</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Document Name *</label>
            <input
              type="text"
              name="documentName"
              value={formData.documentName}
              onChange={handleInputChange}
              placeholder="e.g., PF Claim Form"
              maxLength="100"
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
              />
              <label htmlFor="pdf-upload" className="file-upload-label">
                📁 Choose File
              </label>
              {fileSelected && (
                <span className="file-selected">✓ {formData.fileName}</span>
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
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default GovtFormModal;
