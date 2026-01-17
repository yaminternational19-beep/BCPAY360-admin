import React from "react";
import GovtFormsTable from "../../components/GovtFormsTable";

const PFFormsTable = () => {
  const pfForms = [
    {
      id: 1,
      documentName: "Form 11 - Application for Family Pension",
      fileName: "PF_Form_11.pdf",
      version: "1.2",
      status: "Active",
    },
    {
      id: 2,
      documentName: "Form 12A - Intimation of Defect",
      fileName: "PF_Form_12A.pdf",
      version: "1.1",
      status: "Active",
    },
    {
      id: 3,
      documentName: "Form 2 - Nomination/Change of Nominee",
      fileName: "PF_Form_2.pdf",
      version: "1.0",
      status: "Active",
    },
    {
      id: 4,
      documentName: "Form 3A - Application for Withdrawal",
      fileName: "PF_Form_3A.pdf",
      version: "1.3",
      status: "Active",
    },
    {
      id: 5,
      documentName: "Form 5 - Claim for Refund",
      fileName: "PF_Form_5.pdf",
      version: "1.1",
      status: "Active",
    },
    {
      id: 6,
      documentName: "Form 10 - Claim for Superannuation",
      fileName: "PF_Form_10.pdf",
      version: "1.2",
      status: "Active",
    },
    {
      id: 7,
      documentName: "Form 19 & 10C - Exemption from Coverage",
      fileName: "PF_Form_19_10C.pdf",
      version: "1.0",
      status: "Inactive",
    },
  ];

  return <GovtFormsTable category="PF" initialData={pfForms} />;
};

export default PFFormsTable;
