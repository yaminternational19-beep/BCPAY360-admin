import React, { useState } from "react";
import FormBase from "../FormBase";

const Form16 = () => {
    const [filters, setFilters] = useState({
        search: "",
        branch: "",
        department: "",
        month: "January",
        year: "2026"
    });

    const [loading, setLoading] = useState(false);

    // Mock data for demonstration
    const dummyEmployees = [
        { id: 1, employee_code: "EMP001", full_name: "Ram Lakhan Rathore", branch: "Delhi", department: "IT" },
        { id: 2, employee_code: "EMP002", full_name: "Shyam Singh", branch: "Delhi", department: "HR" },
    ];

    const handlers = {
        onSearch: (val) => setFilters(f => ({ ...f, search: val })),
        onBranchChange: (val) => setFilters(f => ({ ...f, branch: val })),
        onDepartmentChange: (val) => setFilters(f => ({ ...f, department: val })),
        onMonthChange: (val) => setFilters(f => ({ ...f, month: val })),
        onYearChange: (val) => setFilters(f => ({ ...f, year: val })),
    };

    return (
        <FormBase
            formName="Form 16 (TDS Certificate)"
            act="Income Tax Act, 1961"
            filters={filters}
            handlers={handlers}
            employees={dummyEmployees}
            loading={loading}
            onView={(emp) => alert(`Viewing Form 16 for ${emp.full_name}`)}
            onUpload={(emp) => alert(`Uploading Form 16 for ${emp.full_name}`)}
            onDelete={(emp) => alert(`Deleting Form 16 for ${emp.full_name}`)}
            branches={["Delhi", "Mumbai", "Bangalore"]}
            departments={["IT", "HR", "Sales"]}
        >
            <div className="form-info-table">
                <h3>Form 16 (Part A & B)</h3>
                <p>Annual TDS certificate for salary issued to employees.</p>
            </div>
        </FormBase>
    );
};

export default Form16;
