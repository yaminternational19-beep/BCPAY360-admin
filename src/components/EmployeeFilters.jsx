// small placeholder; real filters are in EmployeeList but keep this for layout extension
import React from "react";
import "../styles/EmployeeFilters.css";

const EmployeeFilters = () => {
  return (
    <div className="filters-bar">
      {/* reserved area for more advanced filters (date range, department multi-select, export presets) */}
      <div className="filters-left">Filters</div>
      <div className="filters-right">Quick filters</div>
    </div>
  );
};

export default EmployeeFilters;
