import React from "react";
import GovtFormsTable from "../../components/GovtFormsTable";

const FactoryActFormsTable = () => {
  const factoryForms = [
    {
      id: 1,
      documentName: "Form 14 - Register of Workmen",
      fileName: "FA_Form_14.pdf",
      version: "1.1",
      status: "Active",
    },
    {
      id: 2,
      documentName: "Form 21 - Register of Accidents",
      fileName: "FA_Form_21.pdf",
      version: "1.0",
      status: "Active",
    },
    {
      id: 3,
      documentName: "Form 22 - Abstract of Accidents & Cases",
      fileName: "FA_Form_22.pdf",
      version: "1.2",
      status: "Active",
    },
  ];

  return <GovtFormsTable category="Factory Act" initialData={factoryForms} />;
};

export default FactoryActFormsTable;
