import React, { useEffect, useMemo, useState } from "react";
import {
  getGovernmentForms,
  createGovernmentForm,
  updateGovernmentForm,
  deleteGovernmentForm
} from "../../../../api/master.api.js";

import { useToast } from "../../../../context/ToastContext.jsx";
import GovernmentFormsTable from "../components/GovernmentFormsTable";
import GovernmentFormModal from "../components/GovernmentFormModal";

import "../styles/styleforms.css";


/* normalize backend response */
const normalizeForm = (f) => ({
  id: f.id,
  formCode: f.formCode || f.form_code || "",
  formName: f.formName || f.form_name || "",
  category: f.category || "",
  periodType: f.periodType || f.period_type || "",
  description: f.description || "",
  status: f.status || "INACTIVE"
});

const GovernmentForms = () => {
  const toast = useToast();

  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingForm, setEditingForm] = useState(null);
  const [saving, setSaving] = useState(false);

  /* fetch */
  const fetchForms = async () => {
    setLoading(true);
    try {
      const res = await getGovernmentForms();
      setForms((res?.data || []).map(normalizeForm));
    } catch {
      toast.error("Failed to load government forms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  /* search */
  const filteredForms = useMemo(() => {
    const q = search.toLowerCase();
    return forms.filter(f =>
      f.formName.toLowerCase().includes(q) ||
      f.formCode.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q)
    );
  }, [forms, search]);

  /* save */
  const handleSave = async (payload) => {
    setSaving(true);
    try {
      const apiPayload = {
        form_code: payload.formCode,
        form_name: payload.formName,
        category: payload.category,
        period_type: payload.periodType,
        description: payload.description || ""
      };

      if (editingForm) {
        await updateGovernmentForm(editingForm.id, apiPayload);
        toast.success("Form updated");
      } else {
        await createGovernmentForm(apiPayload);
        toast.success("Form created");
      }

      setModalOpen(false);
      setEditingForm(null);
      fetchForms();
    } catch {
      toast.error("Failed to save form");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (form) => {
    if (!window.confirm("Delete this form permanently?")) return;
    try {
      await deleteGovernmentForm(form.id);
      toast.success("Form deleted");
      fetchForms();
    } catch {
      toast.error("Failed to delete form");
    }
  };

  return (
    <div className="gov-forms-container">
      <div className="gov-forms-header">
        <h2>Government Forms</h2>
        <button onClick={() => setModalOpen(true)}>+ New Form</button>
      </div>

      <input
        className="gov-search"
        placeholder="Search by name, code, category"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <GovernmentFormsTable
        data={filteredForms}
        loading={loading}
        onEdit={(f) => {
          setEditingForm(f);
          setModalOpen(true);
        }}
        onDelete={handleDelete}
      />

      <GovernmentFormModal
        isOpen={modalOpen}
        editData={editingForm}
        loading={saving}
        onClose={() => {
          setModalOpen(false);
          setEditingForm(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
};

export default GovernmentForms;
