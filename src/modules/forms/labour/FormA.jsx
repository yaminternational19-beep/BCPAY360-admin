import React from "react";
import FormBase from "../FormBase";

const FormA = () => {
    return (
        <FormBase
            formName="Form A (Employee Register)"
            act="The Code on Wages, 2019"
        >
            <div className="form-info-table">
                <h3>Form A Details</h3>
                <p>Register of employees covering wages, deductions, and attendance.</p>
            </div>
        </FormBase>
    );
};

export default FormA;
