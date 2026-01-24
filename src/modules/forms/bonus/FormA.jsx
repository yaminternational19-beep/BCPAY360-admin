import React from "react";
import FormBase from "../FormBase";

const FormA = () => {
    return (
        <FormBase
            formName="Form A (Payment of Bonus)"
            act="Payment of Bonus Act, 1965"
        >
            <div className="form-info-table">
                <h3>Form A Details</h3>
                <p>Computation of allocable surplus for payment of bonus.</p>
            </div>
        </FormBase>
    );
};

export default FormA;
