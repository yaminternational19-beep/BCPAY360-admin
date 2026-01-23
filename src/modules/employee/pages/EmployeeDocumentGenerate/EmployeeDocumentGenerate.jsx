import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "./EmployeeDocumentGenerate.css";
import DocumentEditorPanel from "./DocumentEditorPanel";
import EmployeeInfoPanel from "./EmployeeInfoPanel";

const EmployeeDocumentGenerate = () => {
  const { id, formCode } = useParams();
  const navigate = useNavigate();

  return (
    <>
     <div className="doc-header">
        <button className="back-link" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back
        </button>
      </div>
      <div className="doc-generate-page">
      
      {/* BACK BUTTON */}
     

      {/* LEFT: Document Preview */}
      <DocumentEditorPanel employeeId={id} formCode={formCode} />

      {/* RIGHT: Employee Details */}
      <EmployeeInfoPanel employeeId={id} />
    </div>
    
    </>
    
  );
};

export default EmployeeDocumentGenerate;
