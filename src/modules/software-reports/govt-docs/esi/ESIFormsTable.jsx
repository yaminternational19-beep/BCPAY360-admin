import React from "react";
import GovtFormsTable from "../../components/GovtFormsTable";

const ESIFormsTable = () => {
  const esiForms = [
    {
      id: 1,
      documentName: "ESIC Form 1 - Particulars of Workman & Wages",
      fileName: "ESI_Form_1.pdf",
      version: "2.0",
      status: "Active",
    },
    {
      id: 2,
      documentName: "Annexure - Supporting Documents",
      fileName: "ESI_Annexure.pdf",
      version: "1.5",
      status: "Active",
    },
    {
      id: 3,
      documentName: "Half Yearly Return - ESIC Filing",
      fileName: "ESI_Half_Yearly.pdf",
      version: "1.2",
      status: "Active",
    },
  ];

  return <GovtFormsTable category="ESI" initialData={esiForms} />;
};

export default ESIFormsTable;
