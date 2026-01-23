import React, { useEffect, useState } from "react";
import { Printer } from "lucide-react";
import { getCompanyGovernmentForm } from "../../../../api/employees.api";

const DocumentEditorPanel = ({ formCode }) => {
  const [formMeta, setFormMeta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!formCode) return;

    setLoading(true);

    getCompanyGovernmentForm(formCode)
      .then((res) => {
        setFormMeta(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [formCode]);

  if (loading) {
    return <div className="doc-panel left">Loading document…</div>;
  }

  if (!formMeta || !formMeta.file?.signed_url) {
    return <div className="doc-panel left">Document not available</div>;
  }

  const handlePrint = () => {
    window.open(formMeta.file.signed_url, "_blank");
  };

  return (
    <div className="doc-panel left">
      <h2>{formMeta.form_name}</h2>
      <p style={{ fontSize: "12px", opacity: 0.7 }}>
        Version {formMeta.version}
      </p>

      <div
        style={{
          marginTop: "16px",
          border: "1px solid #ddd",
          height: "70vh",
        }}
      >
        <iframe
          src={formMeta.file.signed_url}
          title="Government Form Preview"
          width="100%"
          height="100%"
          style={{ border: "none" }}
        />
      </div>

      <div style={{ marginTop: "16px" }}>
        <button className="btn-secondary" onClick={handlePrint}>
          <Printer size={16} /> Open / Print
        </button>
      </div>
    </div>
  );
};

export default DocumentEditorPanel;
