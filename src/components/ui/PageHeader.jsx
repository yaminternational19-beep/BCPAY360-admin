import React from "react";
import { FaDownload } from "react-icons/fa";

const PageHeader = ({ title, subtitle, actions }) => {
    return (
        <header className="page-header">
            <div className="header-left">
                <h1>{title}</h1>
                {subtitle && <p>{subtitle}</p>}
            </div>

            <div className="header-actions">
                {actions}
                <button className="btn-export" disabled>
                    <FaDownload /> Export CSV
                </button>
            </div>
        </header>
    );
};

export default PageHeader;
