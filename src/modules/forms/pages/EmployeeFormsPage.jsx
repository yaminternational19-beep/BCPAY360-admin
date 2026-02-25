import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { FORMS_CONFIG } from "../config/forms.config";
import PageHeader from "../../../components/ui/PageHeader";
import SummaryCards from "../../../components/ui/SummaryCards";
import FiltersBar from "../../../components/ui/FiltersBar";
import DataTable from "../../../components/ui/DataTable";
import StatusBadge from "../../../components/ui/StatusBadge";
import ActionButtons from "../../../components/ui/ActionButtons";
import { FaCheckCircle, FaExclamationCircle, FaUsers, FaEye, FaUpload, FaDownload, FaFileExport } from "react-icons/fa";
import { getEmployeesByForm, uploadEmployeeForm, replaceEmployeeForm, deleteEmployeeForm } from "../../../api/employees.api";
import { getDepartments } from "../../../api/master.api";
import "../../../styles/shared/modern-ui.css";
import "../Forms.css";
import { useBranch } from "../../../hooks/useBranch"; // Import Hook

const MONTH_MAP = {
    January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
    July: 7, August: 8, September: 9, October: 10, November: 11, December: 12
};

const EmployeeFormsPage = () => {
    const { branches, selectedBranch, changeBranch, isSingleBranch } = useBranch();
    const { formType } = useParams();
    const config = useMemo(() => {
        const baseConfig = FORMS_CONFIG[formType];
        if (baseConfig) return baseConfig;

        // Fallback for unknown form types
        return {
            title: formType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') + " Forms",
            subtitle: `Compliance documents for ${formType}.`,
            emptyStateText: `No records found for ${formType}.`,
            forms: []
        };
    }, [formType]);

    // Selected form from nested forms array
    const [selectedFormCode, setSelectedFormCode] = useState("");

    // Determine the actual form to use
    const selectedForm = useMemo(() => {
        if (!config.forms || config.forms.length === 0) {
            return { code: formType, name: config.title, periodType: "MONTH" };
        }

        const form = config.forms.find(f => f.code === selectedFormCode) || config.forms[0];
        return form;
    }, [config, selectedFormCode, formType]);

    // Initialize selectedFormCode when config changes
    useEffect(() => {
        if (config.forms && config.forms.length > 0 && !selectedFormCode) {
            setSelectedFormCode(config.forms[0].code);
        }
    }, [config, selectedFormCode]);

    // API Data State
    const [availableList, setAvailableList] = useState([]);
    const [missingList, setMissingList] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Master Data
    const [departments, setDepartments] = useState([]);

    // UI State
    const [activeTab, setActiveTab] = useState("Available");
    const [selectedIds, setSelectedIds] = useState(new Set());

    // State for filters
    const [filters, setFilters] = useState({
        search: "",
        departmentId: "",
        month: new Date().toLocaleString('en-US', { month: 'long' }),
        year: new Date().getFullYear().toString(),
        financialYear: "2024-25"
    });

    // Clear selection on tab or filter change
    useEffect(() => {
        setSelectedIds(new Set());
    }, [activeTab, selectedBranch, filters.departmentId, filters.month, filters.year, filters.financialYear, selectedFormCode]);

    const fetchMasterData = async () => {
        try {
            if (selectedBranch) {
                const response = await getDepartments(selectedBranch);
                setDepartments(response || []);
            } else {
                setDepartments([]);
                handleFilterChange("departmentId", "");
            }
        } catch (error) {
            alert("Error fetching master data: " + error.message);
        }
    };

    const fetchData = useCallback(async () => {
        if (!selectedForm.code) return;

        setLoading(true);
        try {
            const params = {
                formCode: selectedForm.code,
                periodType: selectedForm.periodType,
                branchId: selectedBranch,
                departmentId: filters.departmentId
            };

            // Add period parameters based on periodType
            if (selectedForm.periodType === "FY") {
                params.financialYear = filters.financialYear;
            } else if (selectedForm.periodType === "MONTH") {
                params.year = parseInt(filters.year);
                const monthVal = filters.month;
                params.month = MONTH_MAP[monthVal] || parseInt(monthVal);

                if (!params.month || isNaN(params.month)) {
                    alert(`Invalid month selected: ${monthVal}`);
                    return;
                }
            } else if (selectedForm.periodType === "HALF_YEAR") {
                params.year = parseInt(filters.year);
            }
            // LIFETIME forms don't need period parameters

            const response = await getEmployeesByForm(params);
            setAvailableList(response.available || []);
            setMissingList(response.missing || []);
            setSummary(response.summary || null);
            setSelectedIds(new Set());
        } catch (error) {
            alert("Error fetching form data: " + error.message);
        } finally {
            setLoading(false);
        }
    }, [selectedForm, filters, selectedBranch]);

    useEffect(() => {
        fetchMasterData();
    }, [selectedBranch]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    // Stats calculation
    const stats = useMemo(() => {
        if (!summary) return [
            { label: "Total Employees", value: 0, icon: <FaUsers />, color: "blue" },
            { label: "Documents Available", value: 0, icon: <FaCheckCircle />, color: "green" },
            { label: "Documents Missing", value: 0, icon: <FaExclamationCircle />, color: "orange" }
        ];

        return [
            {
                label: "Total Employees",
                value: summary.total || 0,
                icon: <FaUsers />,
                color: "blue"
            },
            {
                label: "Documents Available",
                value: summary.available || 0,
                icon: <FaCheckCircle />,
                color: "green"
            },
            {
                label: "Documents Missing",
                value: summary.missing || 0,
                icon: <FaExclamationCircle />,
                color: "orange"
            }
        ];
    }, [summary]);

    const handleView = (emp) => {
        if (emp.view_url) {
            window.open(emp.view_url, "_blank");
        }
    };

    const handleDownload = (emp) => {
        if (emp.download_url) {
            window.open(emp.download_url, "_blank");
        }
    };

    const handleUpload = async (emp, file) => {
        if (!file) return;
        setUploading(true);
        try {
            const uploadData = {
                employeeId: emp.employee_id || emp.id,
                formCode: selectedForm.code,
                periodType: selectedForm.periodType,
                file: file
            };

            if (selectedForm.periodType === "FY") {
                uploadData.financialYear = filters.financialYear;
            } else if (selectedForm.periodType === "MONTH") {
                uploadData.year = parseInt(filters.year);
                const monthVal = filters.month;
                uploadData.month = MONTH_MAP[monthVal] || parseInt(monthVal);

                if (!uploadData.month || isNaN(uploadData.month)) {
                    alert(`Invalid month selected: ${monthVal}`);
                    return;
                }
            } else if (selectedForm.periodType === "HALF_YEAR") {
                uploadData.year = parseInt(filters.year);
            }

            await uploadEmployeeForm(uploadData);
            fetchData();
        } catch (error) {
            alert("Upload failed: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleReplace = async (emp, file) => {
        if (!file) return;
        if (!window.confirm("Replace existing document?")) return;

        setUploading(true);
        try {
            const replaceData = {
                employeeId: emp.employee_id || emp.id,
                formCode: selectedForm.code,
                periodType: selectedForm.periodType,
                file: file
            };

            if (selectedForm.periodType === "FY") {
                replaceData.financialYear = filters.financialYear;
            } else if (selectedForm.periodType === "MONTH") {
                replaceData.year = parseInt(filters.year);
                const monthVal = filters.month;
                replaceData.month = MONTH_MAP[monthVal] || parseInt(monthVal);
            } else if (selectedForm.periodType === "HALF_YEAR") {
                replaceData.year = parseInt(filters.year);
            }

            await replaceEmployeeForm(replaceData);
            fetchData(); // Refresh list
        } catch (error) {
            alert("Replace failed: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (emp) => {
        if (!window.confirm("Permanently delete this document?")) return;

        setUploading(true); // Re-use uploading state for loading indicator
        try {
            const deleteData = {
                employeeId: emp.employee_id || emp.id,
                formCode: selectedForm.code,
                periodType: selectedForm.periodType
            };

            if (selectedForm.periodType === "FY") {
                deleteData.financialYear = filters.financialYear;
            } else if (selectedForm.periodType === "MONTH") {
                deleteData.year = parseInt(filters.year);
                const monthVal = filters.month;
                deleteData.month = MONTH_MAP[monthVal] || parseInt(monthVal);
            } else if (selectedForm.periodType === "HALF_YEAR") {
                deleteData.year = parseInt(filters.year);
            }

            await deleteEmployeeForm(deleteData);
            fetchData(); // Refresh list
        } catch (error) {
            alert("Delete failed: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    // Filtered list based on tab and searching
    const currentList = useMemo(() => {
        return activeTab === "Available" ? availableList : missingList;
    }, [activeTab, availableList, missingList]);

    const filteredData = useMemo(() => {
        if (!filters.search) return currentList;

        const searchLower = filters.search.toLowerCase();
        return currentList.filter(emp =>
            (emp.full_name || "").toLowerCase().includes(searchLower) ||
            (emp.employee_code || "").toLowerCase().includes(searchLower)
        );
    }, [currentList, filters.search]);

    // Selection Handlers
    const toggleSelectAll = () => {
        if (selectedIds.size === filteredData.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredData.map(emp => emp.id || emp.employee_id)));
        }
    };

    const toggleSelect = (id) => {
        const next = new Set(selectedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedIds(next);
    };

    // Export Handler
    const handleExport = () => {
        const selectedData = filteredData.filter(emp => selectedIds.has(emp.id || emp.employee_id));
        if (selectedData.length === 0) return;

        const headers = ["Employee Code", "Employee Name", "Phone", "Joining Date", "Branch", "Department", "Form Name", "Period", "Status"];
        const rows = selectedData.map(emp => [
            `"${emp.employee_code || ''}"`,
            `"${emp.full_name || ''}"`,
            `"${emp.phone || ''}"`,
            `"${emp.joining_date ? new Date(emp.joining_date).toLocaleDateString('en-GB').replace(/\//g, '-') : '-'}"`,
            `"${emp.branch_name || ''}"`,
            `"${emp.department_name || ''}"`,
            `"${selectedForm.name || selectedForm.code}"`,
            `"${selectedForm.periodType === "FY" ? filters.financialYear : selectedForm.periodType === "MONTH" ? `${filters.month} ${filters.year}` : selectedForm.periodType === "LIFETIME" ? "N/A" : filters.year}"`,
            `"${activeTab}"`
        ]);

        const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Forms_${selectedForm.code}_${activeTab}_${new Date().toISOString().slice(0, 10)}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setSelectedIds(new Set());
    };

    // Column definitions for DataTable
    const columns = useMemo(() => [
        {
            header: (
                <input
                    type="checkbox"
                    className="form-checkbox header-checkbox"
                    checked={filteredData.length > 0 && selectedIds.size === filteredData.length}
                    onChange={toggleSelectAll}
                />
            ),
            render: (emp) => (
                <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={selectedIds.has(emp.id || emp.employee_id)}
                    onChange={() => toggleSelect(emp.id || emp.employee_id)}
                />
            )
        },
        {
            header: "Employee Code",
            render: (emp) => <span className="emp-code">{emp.employee_code}</span>
        },
        {
            header: "Employee Name",
            render: (emp) => (
                <div className="emp-name-cell">
                    <span className="emp-name">{emp.full_name}</span>
                </div>
            )
        },
        {
            header: "Phone",
            render: (emp) => <span className="text-sm text-gray-600 font-mono">{emp.phone || "—"}</span>
        },
        {
            header: "Joining Date",
            render: (emp) => (
                <span className="text-sm text-gray-600">
                    {emp.joining_date ? new Date(emp.joining_date).toLocaleDateString('en-GB').replace(/\//g, '-') : "—"}
                </span>
            )
        },
        {
            header: "Branch",
            render: (emp) => <span className="text-sm text-gray-600">{emp.branch_name || "—"}</span>
        },
        {
            header: "Department",
            render: (emp) => <span className="text-sm text-gray-600">{emp.department_name || "—"}</span>
        },
        {
            header: "Document Status",
            render: (emp) => (
                <StatusBadge
                    type={activeTab === "Available" ? "success" : "warning"}
                    icon={activeTab === "Available" ? "🟢" : "🟡"}
                    label={activeTab === "Available" ? "Available" : "Missing"}
                />
            )
        },
        {
            header: "Actions",
            className: "text-right",
            render: (emp) => (
                <div className="actions-group">
                    {activeTab === "Available" ? (
                        <>
                            <button
                                className="action-btn view"
                                onClick={() => handleView(emp)}
                                title="View Document"
                            >
                                <FaEye />
                            </button>
                            <button
                                className="action-btn download"
                                onClick={() => handleDownload(emp)}
                                title="Download"
                            >
                                <FaDownload />
                            </button>

                            {/* Replace */}
                            <div className="relative">
                                <input
                                    type="file"
                                    style={{ display: "none" }}
                                    id={`replace-${emp.id || emp.employee_id}`}
                                    onChange={(e) => handleReplace(emp, e.target.files[0])}
                                    disabled={uploading}
                                />
                                <label
                                    htmlFor={`replace-${emp.id || emp.employee_id}`}
                                    className={`action-btn replace ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                    title="Replace Document"
                                >
                                    <FaUpload />
                                </label>
                            </div>

                            {/* Delete */}
                            <button
                                className="action-btn delete"
                                onClick={() => handleDelete(emp)}
                                disabled={uploading}
                                title="Delete Document"
                            >
                                <FaExclamationCircle />
                            </button>
                        </>
                    ) : (
                        <div className="relative">
                            <input
                                type="file"
                                style={{ display: "none" }}
                                id={`upload-${emp.id || emp.employee_id}`}
                                onChange={(e) => handleUpload(emp, e.target.files[0])}
                                disabled={uploading}
                            />
                            <label
                                htmlFor={`upload-${emp.id || emp.employee_id}`}
                                className={`action-btn upload ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                title="Upload Document"
                            >
                                <FaUpload />
                            </label>
                        </div>
                    )}
                </div>
            )
        }
    ], [activeTab, uploading, filteredData, selectedIds]);

    return (
        <div className="page-container fade-in">
            <PageHeader
                title={config.title}
                subtitle={config.subtitle}
                actions={
                    <div className="flex items-center gap-4">
                        <button
                            className="btn-export"
                            disabled={selectedIds.size === 0}
                            onClick={handleExport}
                        >
                            <FaFileExport /> Export Selected ({selectedIds.size})
                        </button>
                        <div className="selector-group">
                            {config.forms && config.forms.length > 0 && (
                                <select
                                    value={selectedFormCode}
                                    onChange={(e) => setSelectedFormCode(e.target.value)}
                                    className="form-select"
                                >
                                    {config.forms.map(form => (
                                        <option key={form.code} value={form.code}>{form.name}</option>
                                    ))}
                                </select>
                            )}
                            {selectedForm.periodType === "FY" && (
                                <select
                                    value={filters.financialYear}
                                    onChange={(e) => handleFilterChange("financialYear", e.target.value)}
                                >
                                    <option value="2023-24">FY 2023-24</option>
                                    <option value="2024-25">FY 2024-25</option>
                                    <option value="2025-26">FY 2025-26</option>
                                </select>
                            )}
                            {selectedForm.periodType === "MONTH" && (
                                <>
                                    <select
                                        value={filters.month}
                                        onChange={(e) => handleFilterChange("month", e.target.value)}
                                    >
                                        {[
                                            "January", "February", "March", "April", "May", "June",
                                            "July", "August", "September", "October", "November", "December"
                                        ].map(m => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={filters.year}
                                        onChange={(e) => handleFilterChange("year", e.target.value)}
                                    >
                                        {[2024, 2025, 2026].map(y => (
                                            <option key={y} value={y.toString()}>{y}</option>
                                        ))}
                                    </select>
                                </>
                            )}
                            {(selectedForm.periodType === "HALF_YEAR" || selectedForm.periodType === "LIFETIME") && selectedForm.periodType !== "LIFETIME" && (
                                <select
                                    value={filters.year}
                                    onChange={(e) => handleFilterChange("year", e.target.value)}
                                >
                                    {[2024, 2025, 2026].map(y => (
                                        <option key={y} value={y.toString()}>{y}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>
                }
            />

            <SummaryCards cards={stats} />

            <FiltersBar
                search={filters.search}
                onSearchChange={(val) => handleFilterChange("search", val)}
            >
                {!isSingleBranch && (
                    <select
                        value={selectedBranch === null ? "ALL" : selectedBranch}
                        onChange={(e) => {
                            const val = e.target.value;
                            changeBranch(val === "ALL" ? null : Number(val));
                        }}
                        className="filter-select-modern"
                    >
                        {branches.length > 1 && <option value="ALL">All Branches</option>}
                        {branches.map(b => (
                            <option key={b.id} value={b.id}>{b.branch_name}</option>
                        ))}
                    </select>
                )}

                <select
                    value={filters.departmentId}
                    onChange={(e) => handleFilterChange("departmentId", e.target.value)}
                    className="filter-select-modern"
                    disabled={!selectedBranch}
                >
                    <option value="">{selectedBranch ? "All Departments" : "Select Branch First"}</option>
                    {departments.map(d => <option key={d.id} value={d.id}>{d.department_name}</option>)}
                </select>

                <div className="tab-toggle-container ml-auto">
                    <button
                        className={`tab-btn ${activeTab === 'Available' ? 'active' : 'inactive'}`}
                        onClick={() => setActiveTab('Available')}
                    >
                        Available
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'Upload' ? 'active' : 'inactive'}`}
                        onClick={() => setActiveTab('Upload')}
                    >
                        Upload
                    </button>
                </div>
            </FiltersBar>

            <div className="table-section mt-6">
                <DataTable
                    columns={columns}
                    data={filteredData}
                    isLoading={loading}
                    emptyState={{
                        title: activeTab === "Available" ? "No available documents" : (config.emptyStateText || "No documents for upload"),
                        icon: "📄"
                    }}
                />
            </div>
        </div>
    );
};

export default EmployeeFormsPage;
