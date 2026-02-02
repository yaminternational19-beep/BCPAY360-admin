import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../../../components/ui/PageHeader";
import SummaryCards from "../../../components/ui/SummaryCards";
import FiltersBar from "../../../components/ui/FiltersBar";
import DataTable from "../../../components/ui/DataTable";
import StatusBadge from "../../../components/ui/StatusBadge";
import { FaCheckCircle, FaExclamationCircle, FaUsers, FaEye, FaUpload, FaDownload, FaFileExport } from "react-icons/fa";
import { getEmployeesByForm, uploadEmployeeForm, replaceEmployeeForm, deleteEmployeeForm } from "../../../api/employees.api";
import { getBranches, getDepartments, getGovernmentForms } from "../../../api/master.api";
import { REPORTS_CONFIG } from "../config/reports.config";
import "../../../styles/shared/modern-ui.css";

const MONTH_MAP = {
    January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
    July: 7, August: 8, September: 9, October: 10, November: 11, December: 12
};

const SoftwareReportsPage = () => {
    const { reportType } = useParams();

    // Metadata State
    const [reportMetadata, setReportMetadata] = useState(null);
    const [fetchingMetadata, setFetchingMetadata] = useState(true);

    // Metadata Fetching
    useEffect(() => {
        const fetchMetadata = async () => {
            setFetchingMetadata(true);
            try {
                const res = await getGovernmentForms();
                const forms = res?.data || [];
                const currentForm = forms.find(f => f.formCode === reportType || f.form_code === reportType);

                if (currentForm) {
                    setReportMetadata({
                        title: currentForm.formName,
                        subtitle: `Compliance and analytical data for ${currentForm.formName}.`,
                        code: currentForm.formCode || currentForm.form_code,
                        periodType: currentForm.periodType,
                        emptyStateText: `No records found for ${currentForm.formName}.`
                    });
                } else {
                    // Fallback to config if available
                    const configFallback = REPORTS_CONFIG[reportType];
                    setReportMetadata({
                        title: configFallback?.title || reportType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') + " Report",
                        subtitle: `Report data for ${reportType}.`,
                        code: configFallback?.id || reportType,
                        periodType: configFallback?.periodType || "MONTH",
                        emptyStateText: `No records found for ${reportType}.`
                    });
                }
            } catch (error) {
                // silenced
            } finally {
                setFetchingMetadata(false);
            }
        };
        fetchMetadata();
    }, [reportType]);

    // API Data State
    const [availableList, setAvailableList] = useState([]);
    const [missingList, setMissingList] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Master Data
    const [branches, setBranches] = useState([]);
    const [departments, setDepartments] = useState([]);

    // UI State
    const [activeTab, setActiveTab] = useState("Available");
    const [selectedIds, setSelectedIds] = useState(new Set());

    // State for filters
    const [filters, setFilters] = useState({
        search: "",
        branchId: "",
        departmentId: "",
        month: new Date().toLocaleString('en-US', { month: 'long' }),
        year: new Date().getFullYear().toString(),
        financialYear: "2024-25"
    });

    // Clear selection on tab or filter change
    useEffect(() => {
        setSelectedIds(new Set());
    }, [activeTab, filters.branchId, filters.departmentId, filters.month, filters.year, filters.financialYear, reportType]);

    const fetchMasterData = async () => {
        try {
            const [bRes, dRes] = await Promise.all([
                getBranches(),
                filters.branchId ? getDepartments(filters.branchId) : Promise.resolve([])
            ]);
            setBranches(bRes || []);
            if (filters.branchId) {
                setDepartments(dRes || []);
            } else {
                setDepartments([]);
            }
        } catch (error) {
            alert("Error fetching master data: " + error.message);
        }
    };

    const fetchData = useCallback(async () => {
        if (!reportMetadata?.code) return;

        setLoading(true);
        try {
            const params = {
                formCode: reportMetadata.code,
                periodType: reportMetadata.periodType,
                branchId: filters.branchId,
                departmentId: filters.departmentId
            };

            // Add period parameters based on periodType
            if (reportMetadata.periodType === "FY") {
                params.financialYear = filters.financialYear;
            } else if (reportMetadata.periodType === "MONTH") {
                params.year = parseInt(filters.year);
                const monthVal = filters.month;
                params.month = MONTH_MAP[monthVal] || parseInt(monthVal);

                if (!params.month || isNaN(params.month)) {
                    alert(`Invalid month selected: ${monthVal}`);
                    return;
                }
            } else if (reportMetadata.periodType === "HALF_YEAR") {
                params.year = parseInt(filters.year);
            }

            const response = await getEmployeesByForm(params);
            setAvailableList(response.available || []);
            setMissingList(response.missing || []);
            setSummary(response.summary || null);
        } catch (error) {
            alert("Error fetching report data: " + error.message);
        } finally {
            setLoading(false);
        }
    }, [reportMetadata, filters]);

    useEffect(() => {
        fetchMasterData();
    }, [filters.branchId]);

    useEffect(() => {
        if (reportMetadata) {
            fetchData();
        }
    }, [fetchData, reportMetadata]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    // Stats calculation
    const stats = useMemo(() => {
        if (!summary) return [
            { label: "Total Employees", value: 0, icon: <FaUsers />, color: "blue" },
            { label: "Reports Available", value: 0, icon: <FaCheckCircle />, color: "green" },
            { label: "Reports Missing", value: 0, icon: <FaExclamationCircle />, color: "orange" }
        ];

        return [
            {
                label: "Total Employees",
                value: summary.total || 0,
                icon: <FaUsers />,
                color: "blue"
            },
            {
                label: "Reports Available",
                value: summary.available || 0,
                icon: <FaCheckCircle />,
                color: "green"
            },
            {
                label: "Reports Missing",
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
                formCode: reportMetadata.code,
                periodType: reportMetadata.periodType,
                file: file
            };

            if (reportMetadata.periodType === "FY") {
                uploadData.financialYear = filters.financialYear;
            } else if (reportMetadata.periodType === "MONTH") {
                uploadData.year = parseInt(filters.year);
                const monthVal = filters.month;
                uploadData.month = MONTH_MAP[monthVal] || parseInt(monthVal);
            } else if (reportMetadata.periodType === "HALF_YEAR") {
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
                formCode: reportMetadata.code,
                periodType: reportMetadata.periodType,
                file: file
            };

            if (reportMetadata.periodType === "FY") {
                replaceData.financialYear = filters.financialYear;
            } else if (reportMetadata.periodType === "MONTH") {
                replaceData.year = parseInt(filters.year);
                const monthVal = filters.month;
                replaceData.month = MONTH_MAP[monthVal] || parseInt(monthVal);
            } else if (reportMetadata.periodType === "HALF_YEAR") {
                replaceData.year = parseInt(filters.year);
            }

            await replaceEmployeeForm(replaceData);
            fetchData();
        } catch (error) {
            alert("Replace failed: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (emp) => {
        if (!window.confirm("Permanently delete this document?")) return;

        setUploading(true);
        try {
            const deleteData = {
                employeeId: emp.employee_id || emp.id,
                formCode: reportMetadata.code,
                periodType: reportMetadata.periodType
            };

            if (reportMetadata.periodType === "FY") {
                deleteData.financialYear = filters.financialYear;
            } else if (reportMetadata.periodType === "MONTH") {
                deleteData.year = parseInt(filters.year);
                const monthVal = filters.month;
                deleteData.month = MONTH_MAP[monthVal] || parseInt(monthVal);
            } else if (reportMetadata.periodType === "HALF_YEAR") {
                deleteData.year = parseInt(filters.year);
            }

            await deleteEmployeeForm(deleteData);
            fetchData();
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

        const headers = ["Employee Code", "Employee Name", "Phone", "Joining Date", "Branch", "Department", "Report Name", "Period", "Status"];
        const rows = selectedData.map(emp => [
            `"${emp.employee_code || ''}"`,
            `"${emp.full_name || ''}"`,
            `"${emp.phone || ''}"`,
            `"${emp.joining_date ? new Date(emp.joining_date).toLocaleDateString('en-GB').replace(/\//g, '-') : '-'}"`,
            `"${emp.branch_name || ''}"`,
            `"${emp.department_name || ''}"`,
            `"${reportMetadata.title || reportMetadata.code}"`,
            `"${reportMetadata.periodType === "FY" ? filters.financialYear : reportMetadata.periodType === "MONTH" ? `${filters.month} ${filters.year}` : reportMetadata.periodType === "LIFETIME" ? "N/A" : filters.year}"`,
            `"${activeTab}"`
        ]);

        const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Report_${reportMetadata.code}_${activeTab}_${new Date().toISOString().slice(0, 10)}.csv`);
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
            header: "Branch",
            render: (emp) => <span className="text-sm text-gray-600">{emp.branch_name || "—"}</span>
        },
        {
            header: "Department",
            render: (emp) => <span className="text-sm text-gray-600">{emp.department_name || "—"}</span>
        },
        {
            header: "Status",
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
                            <button className="action-btn view" onClick={() => handleView(emp)} title="View"><FaEye /></button>
                            <button className="action-btn download" onClick={() => handleDownload(emp)} title="Download"><FaDownload /></button>
                            <div className="relative">
                                <input type="file" style={{ display: "none" }} id={`replace-${emp.id || emp.employee_id}`} onChange={(e) => handleReplace(emp, e.target.files[0])} disabled={uploading} />
                                <label htmlFor={`replace-${emp.id || emp.employee_id}`} className={`action-btn replace ${uploading ? 'opacity-50' : 'cursor-pointer'}`} title="Replace"><FaUpload /></label>
                            </div>
                            <button className="action-btn delete" onClick={() => handleDelete(emp)} disabled={uploading} title="Delete"><FaExclamationCircle /></button>
                        </>
                    ) : (
                        <div className="relative">
                            <input type="file" style={{ display: "none" }} id={`upload-${emp.id || emp.employee_id}`} onChange={(e) => handleUpload(emp, e.target.files[0])} disabled={uploading} />
                            <label htmlFor={`upload-${emp.id || emp.employee_id}`} className={`action-btn upload ${uploading ? 'opacity-50' : 'cursor-pointer'}`} title="Upload"><FaUpload /></label>
                        </div>
                    )}
                </div>
            )
        }
    ], [activeTab, uploading, filteredData, selectedIds]);

    if (fetchingMetadata) return <div className="p-8 text-center">Loading Report Configuration...</div>;

    return (
        <div className="page-container fade-in">
            <PageHeader
                title={reportMetadata?.title}
                subtitle={reportMetadata?.subtitle}
                actions={
                    <div className="flex items-center gap-4">
                        <button className="btn-export" disabled={selectedIds.size === 0} onClick={handleExport}>
                            <FaFileExport /> Export Selected ({selectedIds.size})
                        </button>
                        <div className="selector-group">
                            {reportMetadata?.periodType === "FY" && (
                                <select value={filters.financialYear} onChange={(e) => handleFilterChange("financialYear", e.target.value)}>
                                    <option value="2023-24">FY 2023-24</option>
                                    <option value="2024-25">FY 2024-25</option>
                                    <option value="2025-26">FY 2025-26</option>
                                </select>
                            )}
                            {reportMetadata?.periodType === "MONTH" && (
                                <>
                                    <select value={filters.month} onChange={(e) => handleFilterChange("month", e.target.value)}>
                                        {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                    <select value={filters.year} onChange={(e) => handleFilterChange("year", e.target.value)}>
                                        {[2024, 2025, 2026].map(y => <option key={y} value={y.toString()}>{y}</option>)}
                                    </select>
                                </>
                            )}
                        </div>
                    </div>
                }
            />

            <SummaryCards cards={stats} />

            <FiltersBar search={filters.search} onSearchChange={(val) => handleFilterChange("search", val)}>
                <select value={filters.branchId} onChange={(e) => handleFilterChange("branchId", e.target.value)} className="filter-select-modern">
                    <option value="">All Branches</option>
                    {branches.map(b => <option key={b.id} value={b.id}>{b.branch_name}</option>)}
                </select>

                <select value={filters.departmentId} onChange={(e) => handleFilterChange("departmentId", e.target.value)} className="filter-select-modern" disabled={!filters.branchId}>
                    <option value="">All Departments</option>
                    {departments.map(d => <option key={d.id} value={d.id}>{d.department_name}</option>)}
                </select>

                <div className="tab-toggle-container ml-auto">
                    <button className={`tab-btn ${activeTab === 'Available' ? 'active' : 'inactive'}`} onClick={() => setActiveTab('Available')}>Available</button>
                    <button className={`tab-btn ${activeTab === 'Missing' ? 'active' : 'inactive'}`} onClick={() => setActiveTab('Missing')}>Missing</button>
                </div>
            </FiltersBar>

            <div className="table-section mt-6">
                <DataTable columns={columns} data={filteredData} isLoading={loading} emptyState={{ title: activeTab === "Available" ? "No available reports" : (reportMetadata?.emptyStateText || "No missing reports"), icon: "📄" }} />
            </div>
        </div>
    );
};

export default SoftwareReportsPage;
