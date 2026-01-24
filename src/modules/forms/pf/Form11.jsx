import React from "react";
import FormBase from "../FormBase";

const Form11 = () => {
    return (
        <FormBase
            formName="Form 11 (Self-Declaration Form)"
            act="The Employees' Provident Funds Scheme, 1952"
        >
            <div className="form-info-table">
                <h3>Form 11 Details</h3>
                <p>New employee self-declaration form for EPF and EPS.</p>
                {/* Actual form generation fields will go here */}
            </div>
        </FormBase>
    );
};

export default Form11;
