import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { FORMS_CONFIG } from "../config/forms.config";
import { mockFormsData } from "../mock/forms.mock";
import PageHeader from "../../../components/ui/PageHeader";
import SummaryCards from "../../../components/ui/SummaryCards";
import FiltersBar from "../../../components/ui/FiltersBar";
import DataTable from "../../../components/ui/DataTable";
import StatusBadge from "../../../components/ui/StatusBadge";
import ActionButtons from "../../../components/ui/ActionButtons";
import { FaCheckCircle, FaExclamationCircle, FaUsers, FaEye, FaUpload, FaDownload, FaTrashAlt } from "react-icons/fa";
import "../../../styles/shared/modern-ui.css";

const EmployeeFormsPage = () => {
    const { formType } = useParams();
    const config = FORMS_CONFIG[formType] || FORMS_CONFIG.pf;

    // State for filters
    const [filters, setFilters] = useState({
        search: "",
        branch: "",
        department: "",
        status: "All",
        month: "January",
        year: "2025-26"
    });

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    // Filtered Data
    const filteredEmployees = useMemo(() => {
        return mockFormsData.employees.filter(emp => {
            const matchesSearch = emp.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                emp.employee_code.toLowerCase().includes(filters.search.toLowerCase());
            const matchesBranch = !filters.branch || emp.branch === filters.branch;
            const matchesDept = !filters.department || emp.department === filters.department;

            const formData = emp.forms[formType] || { status: "Missing", available: false };
            const matchesStatus = filters.status === "All" || formData.status === filters.status;

            // Special rule for Form-16: Only show employees who HAVE the form
            if (formType === "income-tax" && !formData.available) return false;

            return matchesSearch && matchesBranch && matchesDept && matchesStatus;
        });
    }, [formType, filters]);

    // Stats calculation
    const stats = useMemo(() => {
        const relevantEmployees = mockFormsData.employees.filter(emp => {
            if (config.eligibilityKey) return emp[config.eligibilityKey];
            return true;
        });

        return [
            {
                label: "Total Employees",
                value: relevantEmployees.length,
                icon: <FaUsers />,
                color: "blue"
            },
            {
                label: "Documents Available",
                value: relevantEmployees.filter(emp => emp.forms[formType]?.available).length,
                icon: <FaCheckCircle />,
                color: "green"
            },
            ...(config.allowMissingState ? [{
                label: "Documents Missing",
                value: relevantEmployees.filter(emp => !emp.forms[formType]?.available).length,
                icon: <FaExclamationCircle />,
                color: "orange"
            }] : [])
        ];
    }, [formType, config]);

    const handleView = (emp) => {
        console.log("Viewing form for:", emp.name);
        alert(`Viewing ${config.title} for ${emp.name}`);
    };

    const handleUpload = (emp) => {
        console.log("Uploading form for:", emp.name);
        alert(`Upload trigger for ${emp.name}`);
    };

    const handleDownload = (emp) => {
        console.log("Downloading form for:", emp.name);
        alert(`Downloading ${config.title} for ${emp.name}`);
    };

    // Column definitions for DataTable
    const columns = useMemo(() => [
        {
            header: "Employee Code",
            render: (emp) => <span className="emp-code">{emp.employee_code}</span>
        },
        {
            header: "Employee Name",
            render: (emp) => (
                <div className="emp-name-cell">
                    <span className="emp-name">{emp.name}</span>
                    <span className="emp-branch">{emp.branch}</span>
                </div>
            )
        },
        { header: "Department", key: "department" },
        ...(config.showEligibility ? [{
            header: "Eligibility",
            render: (emp) => {
                const isEligible = config.eligibilityKey ? emp[config.eligibilityKey] : true;
                return (
                    <span className={`eligibility-pill ${isEligible ? "eligible" : "not-eligible"}`}>
                        {isEligible ? "Eligible" : "Not Eligible"}
                    </span>
                );
            }
        }] : []),
        {
            header: "Document Status",
            render: (emp) => {
                const formData = emp.forms[formType] || { status: "Missing", available: false };
                return (
                    <StatusBadge
                        type={formData.available ? "success" : "warning"}
                        icon={formData.available ? "🟢" : "🟡"}
                        label={formData.status}
                    />
                );
            }
        },
        {
            header: "Last Updated",
            render: (emp) => emp.forms[formType]?.updatedAt || "—"
        },
        {
            header: "Actions",
            className: "text-right",
            render: (emp) => (
                <ActionButtons
                    actions={[
                        {
                            icon: <FaEye />,
                            onClick: () => handleView(emp),
                            disabled: !emp.forms[formType]?.available,
                            title: "View Document",
                            type: "view"
                        },
                        ...(emp.forms[formType]?.available ? [{
                            icon: <FaDownload />,
                            onClick: () => handleDownload(emp),
                            title: "Download",
                            type: "download"
                        }] : [{
                            icon: <FaUpload />,
                            onClick: () => handleUpload(emp),
                            title: "Upload Document",
                            type: "upload"
                        }]),
                        {
                            icon: <FaTrashAlt />,
                            disabled: true,
                            title: "Delete (Coming Soon)",
                            type: "delete"
                        }
                    ]}
                />
            )
        }
    ], [formType, config]);

    return (
        <div className="page-container fade-in">
            <PageHeader
                title={config.title}
                subtitle={config.subtitle}
                actions={
                    <div className="selector-group">
                        <select
                            value={filters.year}
                            onChange={(e) => handleFilterChange("year", e.target.value)}
                        >
                            <option value="2024-25">FY 2024-25</option>
                            <option value="2025-26">FY 2025-26</option>
                        </select>
                        {formType !== "income-tax" && (
                            <select
                                value={filters.month}
                                onChange={(e) => handleFilterChange("month", e.target.value)}
                            >
                                <option value="January">January</option>
                                <option value="February">February</option>
                                <option value="March">March</option>
                            </select>
                        )}
                    </div>
                }
            />

            <SummaryCards cards={stats} />

            <FiltersBar
                search={filters.search}
                onSearchChange={(val) => handleFilterChange("search", val)}
            >
                <select
                    value={filters.branch}
                    onChange={(e) => handleFilterChange("branch", e.target.value)}
                    className="filter-select-modern"
                >
                    <option value="">All Branches</option>
                    {mockFormsData.branches.map(b => <option key={b} value={b}>{b}</option>)}
                </select>

                <select
                    value={filters.department}
                    onChange={(e) => handleFilterChange("department", e.target.value)}
                    className="filter-select-modern"
                >
                    <option value="">All Departments</option>
                    {mockFormsData.departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>

                {config.allowMissingState && (
                    <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange("status", e.target.value)}
                        className="filter-select-modern"
                    >
                        <option value="All">All Status</option>
                        <option value="Available">Available</option>
                        <option value="Missing">Missing</option>
                    </select>
                )}
            </FiltersBar>

            <div className="table-section">
                <DataTable
                    columns={columns}
                    data={filteredEmployees}
                    emptyState={{
                        title: config.emptyStateText,
                        icon: "📄"
                    }}
                />
            </div>
        </div>
    );
};

export default EmployeeFormsPage;
