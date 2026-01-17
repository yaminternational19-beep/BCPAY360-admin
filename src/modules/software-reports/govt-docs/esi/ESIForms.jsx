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

export const ESICForm1 = () => (
  <GovtFormPage
    formName="ESIC Form 1"
    formDescription="Particulars of Workman & Wages"
    formNumber="1"
  />
);

export const Annexure = () => (
  <GovtFormPage
    formName="Annexure"
    formDescription="Supporting Documents for ESIC"
    formNumber="Annexure"
  />
);

export const HalfYearly = () => (
  <GovtFormPage
    formName="Half Yearly Return"
    formDescription="Half Yearly ESIC Return Filing"
    formNumber="HY"
  />
);

export default ESICForm1;
