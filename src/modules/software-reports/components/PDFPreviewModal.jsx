import React, { useState, useEffect } from "react";

const PDFPreviewModal = ({ isOpen, onClose, formId, formName, fileUrl }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && fileUrl) {
      loadPreview();
    }
  }, [isOpen, fileUrl]);

  const loadPreview = async () => {
    setLoading(true);
    setError(null);
    try {
      if (fileUrl) {
        setPreviewUrl(fileUrl);
      } else {
        throw new Error("No document URL provided");
      }
    } catch (err) {
      setError("Failed to load preview: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (previewUrl) {
      try {
        // Create a temporary anchor element to download
        const link = document.createElement("a");
        link.href = previewUrl;
        link.download = `${formName}.pdf` || "form.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        alert("Download started!");
      } catch (err) {
        console.error("Download error:", err);
        // Fallback: open in new tab
        if (previewUrl.startsWith("http")) {
          window.open(previewUrl, "_blank");
        }
      }
    }
  };

  const handleOpenInNewTab = () => {
    if (previewUrl) {
      window.open(previewUrl, "_blank");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content pdf-preview-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "90vw",
          maxHeight: "90vh",
          width: "900px",
          height: "700px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="modal-header">
          <h2>📄 Preview: {formName}</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div
          className="modal-body"
          style={{
            flex: 1,
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f5f5f5",
            padding: "20px",
          }}
        >
          {loading && (
            <div style={{ textAlign: "center" }}>
              <p>⏳ Loading preview...</p>
            </div>
          )}

          {error && (
            <div
              style={{
                backgroundColor: "#ffebee",
                border: "1px solid #ef5350",
                borderRadius: "4px",
                padding: "15px",
                maxWidth: "500px",
                textAlign: "center",
                color: "#c62828",
              }}
            >
              <p>⚠️ {error}</p>
              <p style={{ fontSize: "12px", marginTop: "10px" }}>
                You can still download the file using the button below
              </p>
            </div>
          )}

          {previewUrl && !error && (
            <iframe
              src={previewUrl}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                borderRadius: "4px",
              }}
              title={`Preview of ${formName}`}
              onError={() => {
                setError("Could not load PDF preview in browser");
              }}
            />
          )}
        </div>

        <div className="modal-footer" style={{ borderTop: "1px solid #ddd" }}>
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
          <button
            className="btn-secondary"
            onClick={handleOpenInNewTab}
            style={{ marginRight: "10px" }}
          >
            🔗 Open in New Tab
          </button>
          <button className="btn-primary" onClick={handleDownload}>
            ⬇ Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default PDFPreviewModal;
