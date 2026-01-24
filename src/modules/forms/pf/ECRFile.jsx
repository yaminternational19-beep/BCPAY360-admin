import React from "react";
import FormBase from "../FormBase";

const ECRFile = () => {
    return (
        <FormBase
            formName="Electronic Challan cum Return (ECR)"
            act="EPF Contribution Returns"
        >
            <div className="form-info-table">
                <h3>ECR File Generation</h3>
                <p>Monthly EPF return file for online portal upload.</p>
            </div>
        </FormBase>
    );
};

export default ECRFile;
