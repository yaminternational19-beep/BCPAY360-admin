import React, { useEffect, useMemo, useState } from "react";
import {
  getGovernmentForms,
  createGovernmentForm,
  updateGovernmentForm,
  deleteGovernmentForm
} from "../../../../api/master.api.js";

import { useToast } from "../../../../context/ToastContext.jsx";
import DocumentsTable from "../components/DocumentsTable";
import DocumentModal from "../components/DocumentModal";

import "../styles/styleforms.css";


/* normalize backend response */
const normalizeDocument = (f) => ({
  id: f.id,
  formCode: f.formCode || f.form_code || "",
  formName: f.formName || f.form_name || "",
  category: f.category || "",
  periodType: f.periodType || f.period_type || "",
  description: f.description || "",
  status: f.status || "INACTIVE"
});

const Documents = () => {
  const toast = useToast();

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [saving, setSaving] = useState(false);

  /* fetch */
  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await getGovernmentForms();
      setDocuments((res?.data || []).map(normalizeDocument));
    } catch {
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  /* search */
  const filteredDocs = useMemo(() => {
    const q = search.toLowerCase();
    return documents.filter(f =>
      f.formName.toLowerCase().includes(q) ||
      f.formCode.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q)
    );
  }, [documents, search]);

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

      if (editingDoc) {
        await updateGovernmentForm(editingDoc.id, apiPayload);
        toast.success("Document updated");
      } else {
        await createGovernmentForm(apiPayload);
        toast.success("Document created");
      }

      setModalOpen(false);
      setEditingDoc(null);
      fetchDocuments();
    } catch {
      toast.error("Failed to save document");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (doc) => {
    if (doc.status === "ACTIVE") {
      return toast.error("Active documents cannot be deleted! Please deactivate the document first.");
    }

    if (!window.confirm("Delete this document permanently?")) return;
    try {
      await deleteGovernmentForm(doc.id);
      toast.success("Document deleted");
      fetchDocuments();
    } catch {
      toast.error("Failed to delete document");
    }
  };

  const handleToggleStatus = async (doc) => {
    try {
      const newStatus = doc.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      await updateGovernmentForm(doc.id, { status: newStatus });
      toast.success(`Document ${newStatus.toLowerCase()}d successfully`);
      fetchDocuments();
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="gf-container">
      <div className="gf-header">
        <h2>Documents Setup</h2>
        <button className="gf-btn-new" onClick={() => setModalOpen(true)}>
          Add New Document
        </button>
      </div>

      <div className="gf-search-wrap">
        <input
          className="gf-search-input"
          placeholder="Search documents by name, code, category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <DocumentsTable
        data={filteredDocs}
        loading={loading}
        onEdit={(f) => {
          setEditingDoc(f);
          setModalOpen(true);
        }}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />

      <DocumentModal
        isOpen={modalOpen}
        editData={editingDoc}
        loading={saving}
        onClose={() => {
          setModalOpen(false);
          setEditingDoc(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
};

export default Documents;
