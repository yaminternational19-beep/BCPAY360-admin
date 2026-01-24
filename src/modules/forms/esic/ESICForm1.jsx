import React from "react";
import FormBase from "../FormBase";

const ESICForm1 = () => {
    return (
        <FormBase
            formName="ESIC Form 1 (Declaration Form)"
            act="Employees' State Insurance Act, 1948"
        >
            <div className="form-info-table">
                <h3>ESIC Form 1 Details</h3>
                <p>Declaration form for employee registration under ESIC.</p>
            </div>
        </FormBase>
    );
};

export default ESICForm1;
