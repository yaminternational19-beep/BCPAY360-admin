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

export const Form11 = () => (
  <GovtFormPage
    formName="Form 11"
    formDescription="Application for Family Pension"
    formNumber="11"
  />
);

export const Form12A = () => (
  <GovtFormPage
    formName="Form 12A"
    formDescription="Intimation of Defect / Deficiency in an Application"
    formNumber="12A"
  />
);

export const Form2 = () => (
  <GovtFormPage
    formName="Form 2"
    formDescription="Nomination/Change of Nominee by Member"
    formNumber="2"
  />
);

export const Form3A = () => (
  <GovtFormPage
    formName="Form 3A"
    formDescription="Application for Withdrawal of Accumulations"
    formNumber="3A"
  />
);

export const Form5 = () => (
  <GovtFormPage
    formName="Form 5"
    formDescription="Claim for Refund of Member's Contribution"
    formNumber="5"
  />
);

export const Form10 = () => (
  <GovtFormPage
    formName="Form 10"
    formDescription="Claim for Superannuation Benefits"
    formNumber="10"
  />
);

export const Form19 = () => (
  <GovtFormPage
    formName="Form 19 & 10C"
    formDescription="Claim for Exemption from/Withdrawal from Coverage"
    formNumber="19 & 10C"
  />
);

export default Form11;
