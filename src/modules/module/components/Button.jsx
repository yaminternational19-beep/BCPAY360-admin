import React from "react";
import { FaSpinner } from "react-icons/fa";
import "../module.css";

export const Button = ({
    children,
    variant = "primary",  // primary, secondary, danger, ghost, outline
    size = "medium",      // small, medium, large
    isLoading = false,
    startIcon,
    endIcon,
    disabled,
    className = "",
    ...props
}) => {
    return (
        <button
            className={`ui-btn btn-${variant} btn-${size} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <FaSpinner className="spinner-icon" />}
            {!isLoading && startIcon && <span className="btn-icon-start">{startIcon}</span>}
            {children}
            {!isLoading && endIcon && <span className="btn-icon-end">{endIcon}</span>}
        </button>
    );
};
