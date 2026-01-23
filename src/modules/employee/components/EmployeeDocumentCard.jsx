import React from "react";
import {
    FileText,
    Eye,
    Printer,
    CheckCircle2,
    AlertCircle,
    Circle
} from "lucide-react";
import "../styles/EmployeeDocuments.css";

const EmployeeDocumentCard = ({ document, type, onAction }) => {
    /**
     * type:
     *  - "UPLOADED"  (employee provided → VIEW)
     *  - "COMPANY"   (company generated → GENERATE)
     */

    const isUploaded = type === "UPLOADED";
    const isGenerated = document.generated === true;

    let statusText = "PENDING";
    let statusClass = "pending";
    let StatusIcon = Circle;

    if (isUploaded || isGenerated) {
        statusText = "UPLOADED";
        statusClass = "active";
        StatusIcon = CheckCircle2;
    } else if (type === "COMPANY") {
        statusText = "NOT GENERATED";
        statusClass = "inactive";
        StatusIcon = AlertCircle;
    }

    return (
        <div className="doc-card-row">
            <div className="doc-info">
                <div className="doc-icon">
                    <FileText size={20} />
                </div>

                <div className="doc-text">
                    <h4>{document.form_name}</h4>

                    <div className="doc-status">
                        <span className={statusClass}>
                            <StatusIcon size={12} />
                            {statusText}
                        </span>
                    </div>
                </div>
            </div>

            <div className="doc-actions">
                <button className="hover-btn" onClick={() => onAction(document)}>
                    {isUploaded ? <Eye size={14} /> : <Printer size={14} />}
                    {isUploaded ? "VIEW" : "GENERATE"}
                </button>
            </div>
        </div>
    );
};

export default EmployeeDocumentCard;
