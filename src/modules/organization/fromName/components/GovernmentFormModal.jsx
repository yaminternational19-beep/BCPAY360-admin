import React, { useEffect, useState } from "react";
import "../styles/styleforms.css";
import { useToast } from "../../../../context/ToastContext.jsx";
import { FaFileInvoice, FaTimes } from "react-icons/fa";

const GovernmentFormModal = ({
  isOpen,
  onClose,
  onSave,
  editData = null,
  loading = false
}) => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    formName: "",
    formCode: "",
    category: "",
    periodType: "FY",
    description: ""
  });

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
      toast.error("Form Name, Code, and Category are mandatory");
      return;
    }
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="gf-modal-overlay" onClick={onClose}>
      <div className="gf-modal" onClick={e => e.stopPropagation()}>
        <div className="gf-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <FaFileInvoice style={{ color: "var(--gf-primary)", fontSize: "20px" }} />
            <h3>{editData ? "Edit Configuration" : "Initialize Form"}</h3>
          </div>
          <button className="gf-close-btn" onClick={onClose}><FaTimes /></button>
        </div>

        <div className="gf-modal-body">
          <div className="gf-form-group">
            <label>Form Code <span style={{ color: "red" }}>*</span></label>
            <input name="formCode" placeholder="e.g. FORM-12A" value={formData.formCode} onChange={handleChange} />
          </div>
          <div className="gf-form-group">
            <label>Form Name <span style={{ color: "red" }}>*</span></label>
            <input name="formName" placeholder="e.g. PF Monthly Return" value={formData.formName} onChange={handleChange} />
          </div>
          <div className="gf-form-group">
            <label>Category <span style={{ color: "red" }}>*</span></label>
            <input name="category" placeholder="PF / ESI / INCOME TAX" value={formData.category} onChange={handleChange} />
          </div>
          <div className="gf-form-group">
            <label>Period Type</label>
            <select name="periodType" value={formData.periodType} onChange={handleChange}>
              <option value="FY">Financial Year</option>
              <option value="MONTH">Monthly</option>
              <option value="ONE_TIME">One Time</option>
            </select>
          </div>
          <div className="gf-form-group">
            <label>Description</label>
            <textarea
              name="description"
              rows={3}
              placeholder="Provide brief details about this form..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="gf-modal-footer">
          <button onClick={onClose} className="gf-btn-cancel">Dismiss</button>
          <button onClick={handleSubmit} className="gf-btn-save" disabled={loading}>
            {loading ? "Processing..." : (editData ? "Update Configuration" : "Save Configuration")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GovernmentFormModal;
