import React, { useEffect, useState } from "react";
import "../styles/styleforms.css";

const GovernmentFormModal = ({
  isOpen,
  onClose,
  onSave,
  editData = null,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    formName: "",
    formCode: "",
    category: "",
    periodType: "FY",
    description: ""
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (editData) {
      setFormData({
        formName: editData.formName || "",
        formCode: editData.formCode || "",
        category: editData.category || "",
        periodType: editData.periodType || "FY",
        description: editData.description || ""
      });
    } else {
      setFormData({
        formName: "",
        formCode: "",
        category: "",
        periodType: "FY",
        description: ""
      });
    }
    setError("");
  }, [editData, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = () => {
    if (!formData.formName || !formData.formCode || !formData.category) {
      setError("Form Name, Form Code, and Category are required");
      return;
    }
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="gov-modal-overlay" onClick={onClose}>
      <div className="gov-modal" onClick={e => e.stopPropagation()}>
        <div className="gov-modal-header">
          <h3>{editData ? "Edit Government Form" : "Create Government Form"}</h3>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="gov-modal-body">
          <div className="form-group">
            <label>Form Code *</label>
            <input name="formCode" placeholder="Form Code" value={formData.formCode} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Form Name *</label>
            <input name="formName" placeholder="Form Name" value={formData.formName} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Category *</label>
            <input name="category" placeholder="Category (PF / ESI / IT)" value={formData.category} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Period Type</label>
            <select name="periodType" value={formData.periodType} onChange={handleChange}>
              <option value="FY">Financial Year</option>
              <option value="MONTH">Monthly</option>
              <option value="ONE_TIME">One Time</option>
            </select>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Description (optional)"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {error && <p className="error-text">{error}</p>}
        </div>

        <div className="gov-modal-footer">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={handleSubmit} className="btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GovernmentFormModal;
