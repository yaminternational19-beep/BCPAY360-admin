import { useEffect, useState } from "react";
import "../../../styles/Branch.css";

const EMPTY_FORM = {
  branch_code: "",
  branch_name: "",
  location: "",
  address: "",
  phone: "",
  email: "",
  is_active: true,
};

const BranchForm = ({ initial, onSave, onClose, companies = [] }) => {
  const isEdit = Boolean(initial);

  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (initial) {
      setForm({
        ...EMPTY_FORM,
        ...initial,
        is_active: initial.is_active !== undefined ? initial.is_active : true,
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [initial]);

  const change = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      is_active: Boolean(form.is_active),
    };
    onSave(payload);
  };

  return (
    <div className="branch-modal-backdrop" onClick={onClose}>
      <div className="branch-modal" onClick={(e) => e.stopPropagation()}>
        <div className="branch-modal-header">
          <h3>{isEdit ? "Edit Branch" : "Add Branch"}</h3>
          <button onClick={onClose} className="close-btn">
            ✕
          </button>
        </div>

        <form className="branch-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Branch Code</label>
              <input
                placeholder="Auto-generated or manual"
                value={form.branch_code}
                onChange={(e) => change("branch_code", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Branch Name <span style={{ color: "#ef4444" }}>*</span></label>
              <input
                placeholder="Branch name"
                value={form.branch_name}
                onChange={(e) => change("branch_name", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              placeholder="City / Location"
              value={form.location}
              onChange={(e) => change("location", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea
              placeholder="Full address"
              value={form.address}
              onChange={(e) => change("address", e.target.value)}
              rows={3}
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                placeholder="Phone number"
                value={form.phone}
                onChange={(e) => change("phone", e.target.value.replace(/\D/g, ""))}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="branch@email.com"
                value={form.email}
                onChange={(e) => change("email", e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => change("is_active", e.target.checked)}
              />
              Active
            </label>
          </div>

          <div className="branch-form-footer">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary">
              {isEdit ? "Update Branch" : "Create Branch"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BranchForm;

