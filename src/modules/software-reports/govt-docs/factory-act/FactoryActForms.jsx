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

export const Form14 = () => (
  <GovtFormPage
    formName="Form 14"
    formDescription="Register of Workmen (Factory Act)"
    formNumber="14"
  />
);

export const Form21 = () => (
  <GovtFormPage
    formName="Form 21"
    formDescription="Register of Accidents"
    formNumber="21"
  />
);

export const Form22 = () => (
  <GovtFormPage
    formName="Form 22"
    formDescription="Abstract of Accidents & Cases"
    formNumber="22"
  />
);

export default Form14;
