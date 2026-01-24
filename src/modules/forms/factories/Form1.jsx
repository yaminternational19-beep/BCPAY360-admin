import React from "react";
import FormBase from "../FormBase";

const Form1 = () => {
    return (
        <FormBase
            formName="Form 1 (Application for Registration)"
            act="Factories Act, 1948"
        >
            <div className="form-info-table">
                <h3>Form 1 Details</h3>
                <p>Application for registration and grant or renewal of license.</p>
            </div>
        </FormBase>
    );
};

export default Form1;
