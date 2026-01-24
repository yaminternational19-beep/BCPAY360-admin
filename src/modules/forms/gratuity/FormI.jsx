import React from "react";
import FormBase from "../FormBase";

const FormI = () => {
    return (
        <FormBase
            formName="Form I (Application for Gratuity)"
            act="Payment of Gratuity Act, 1972"
        >
            <div className="form-info-table">
                <h3>Form I Details</h3>
                <p>Application for payment of gratuity by an employee.</p>
            </div>
        </FormBase>
    );
};

export default FormI;
