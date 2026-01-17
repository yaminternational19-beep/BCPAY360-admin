import React, { useState } from "react";

const GovtFormPage = ({ formName, formDescription, formNumber }) => {
  const [showPreview, setShowPreview] = useState(false);

  const handleDownload = () => {
    alert(`${formName} downloaded (sample PDF)`);
  };

  return (
    <div className="sr-page">
      <div className="sr-header">
        <h1>{formName}</h1>
        <p>Form {formNumber} - {formDescription}</p>
      </div>

      <div className="form-container">
        <div className="form-info">
          <p className="form-desc">
            This is the standard government form required for compliance.
          </p>
        </div>

        <div className="form-actions">
          <button
            className="btn-primary"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? "✕ Close Preview" : "👁 Preview Form"}
          </button>
          <button className="btn-secondary" onClick={handleDownload}>
            ⬇ Download PDF
          </button>
        </div>

        {showPreview && (
          <div className="form-preview">
            <div className="preview-placeholder">
              <p>📄 Form {formNumber} Preview</p>
              <p className="preview-text">{formName}</p>
              <p className="preview-text">(Sample PDF preview would load here)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const FormF = () => (
  <GovtFormPage
    formName="Form F"
    formDescription="Return of New Employees/Workers"
    formNumber="F"
  />
);

export const MusterRoll = () => (
  <GovtFormPage
    formName="Muster Roll (Form 12 / 26)"
    formDescription="Daily Muster Roll Register"
    formNumber="12/26"
  />
);

export const AdultRegister = () => (
  <GovtFormPage
    formName="Adult Register"
    formDescription="Register of Adult Workmen"
    formNumber="Adult"
  />
);

export default FormF;
