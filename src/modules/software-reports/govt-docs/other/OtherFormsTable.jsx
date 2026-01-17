import React from "react";
import GovtFormsTable from "../../components/GovtFormsTable";

const OtherFormsTable = () => {
  const otherForms = [
    {
      id: 1,
      documentName: "Form F - Return of New Employees/Workers",
      fileName: "Other_Form_F.pdf",
      version: "1.0",
      status: "Active",
    },
    {
      id: 2,
      documentName: "Muster Roll - Daily Attendance Register",
      fileName: "Muster_Roll.pdf",
      version: "1.3",
      status: "Active",
    },
    {
      id: 3,
      documentName: "Adult Register - Register of Adult Workmen",
      fileName: "Adult_Register.pdf",
      version: "1.1",
      status: "Active",
    },
  ];

  return <GovtFormsTable category="Other" initialData={otherForms} />;
};

export default OtherFormsTable;
