import React, { useState, useEffect, useMemo } from "react";
import {
    getAvailableCompanyForms,
    uploadCompanyGovernmentForm,
    replaceCompanyGovernmentForm,
    deleteCompanyGovernmentForm,
    toggleCompanyGovernmentFormStatus
} from "../../../api/employees.api";
import PageHeader from "../../../components/ui/PageHeader";
import SummaryCards from "../../../components/ui/SummaryCards";
import FiltersBar from "../../../components/ui/FiltersBar";
import DataTable from "../../../components/ui/DataTable";
import StatusBadge from "../../../components/ui/StatusBadge";
import ActionButtons from "../../../components/ui/ActionButtons";
import GovernmentFormModal from "../components/GovernmentFormModal";
import { FaFilePdf, FaCheckCircle, FaExclamationCircle, FaSearch, FaEye, FaDownload, FaEdit, FaTrash, FaSync, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { useToast } from "../../../context/ToastContext";
import "../../../styles/shared/modern-ui.css";

const GovernmentForms = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);
    const toast = useToast();

    const fetchForms = async () => {
        setLoading(true);
        try {
            const res = await getAvailableCompanyForms();
            setData(res.data || res || []);
        } catch (err) {
            console.error("Failed to fetch government forms:", err);
            toast.error("Error loading government forms");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchForms();
    }, []);

    const filteredData = useMemo(() => {
        return data.filter(item => {
            const documentName = item.form_name || item.documentName || "";
            return documentName.toLowerCase().includes(search.toLowerCase());
        });
    }, [data, search]);

    const stats = useMemo(() => [
        {
            label: "Total Documents",
            value: data.length,
            icon: <FaFilePdf />,
            color: "blue"
        },
        {
            label: "Active Forms",
            value: data.filter(d => d.status === "ACTIVE" || d.status === "Active").length,
            icon: <FaCheckCircle />,
            color: "green"
        },
        {
            label: "Total Versions",
            value: data.length > 0 ? (data.reduce((acc, curr) => acc + (parseFloat(curr.version) || 1), 0)).toFixed(1) : "0.0",
            icon: <FaSync />,
            color: "orange"
        }
    ], [data]);

    const handleView = (item) => {
        if (item?.view_url) {
            window.open(item.view_url, "_blank");
        } else {
            toast.warn("View URL not available");
        }
    };

    const handleDownload = (item) => {
        if (item?.download_url) {
            window.open(item.download_url, "_blank");
        } else {
            toast.warn("Download URL not available");
        }
    };

    const handleToggleStatus = async (item) => {
        try {
            await toggleCompanyGovernmentFormStatus(item.id);
            toast.success("Status updated");
            fetchForms();
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    const handleDelete = async (item) => {
        if (!window.confirm("Delete this form permanently?")) return;
        try {
            await deleteCompanyGovernmentForm(item.id);
            toast.success("Form deleted");
            fetchForms();
        } catch (err) {
            toast.error("Failed to delete form");
        }
    };

    const handleSave = async (formData) => {
        setModalLoading(true);
        try {
            if (editingItem) {
                await replaceCompanyGovernmentForm(editingItem.id, formData);
                toast.success("Form replaced successfully");
            } else {
                await uploadCompanyGovernmentForm(formData);
                toast.success("Form uploaded successfully");
            }
            setIsModalOpen(false);
            fetchForms();
        } catch (err) {
            toast.error(err.message || "Failed to save form");
        } finally {
            setModalLoading(false);
        }
    };

    const columns = [
        { header: "SL No", render: (_, idx) => idx + 1 },
        { header: "Document Name", render: (item) => item.form_name || item.documentName },
        {
            header: "PDF File Name",
            className: "filename",
            render: (item) => item.original_file_name || item.file_name || "N/A"
        },
        { header: "Version", key: "version" },
        {
            header: "Status",
            render: (item) => (
                <StatusBadge
                    type={item.status === "ACTIVE" || item.status === "Active" ? "success" : "neutral"}
                    label={item.status || "Active"}
                />
            )
        },
        {
            header: "Actions",
            className: "text-right",
            render: (item) => (
                <ActionButtons
                    actions={[
                        {
                            icon: <FaEye />,
                            onClick: () => handleView(item),
                            title: "View"
                        },
                        {
                            icon: <FaDownload />,
                            onClick: () => handleDownload(item),
                            title: "Download"
                        },
                        {
                            icon: <FaEdit />,
                            onClick: () => { setEditingItem(item); setIsModalOpen(true); },
                            title: "Replace/Edit"
                        },
                        {
                            icon: (item.status === "ACTIVE" || item.status === "Active") ? <FaToggleOn /> : <FaToggleOff />,
                            onClick: () => handleToggleStatus(item),
                            title: "Toggle Status"
                        },
                        {
                            icon: <FaTrash />,
                            disabled: item.status === "ACTIVE" || item.status === "Active",
                            onClick: () => handleDelete(item),
                            title: "Delete"
                        }
                    ]}
                />
            )
        }
    ];

    return (
        <div className="page-container fade-in">
            <PageHeader
                title="Government Forms"
                subtitle="Manage statutory compliance documents and government-mandated registration forms."
                actions={
                    <button className="btn-primary" onClick={fetchForms}>
                        <FaSync className={loading ? "animate-spin" : ""} /> Refresh
                    </button>
                }
            />

            <SummaryCards cards={stats} />

            <FiltersBar
                search={search}
                onSearchChange={setSearch}
            >
                <button
                    className="btn-primary"
                    style={{ height: '40px' }}
                    onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
                >
                    + Upload New Form
                </button>
            </FiltersBar>

            <div className="table-section">
                <DataTable
                    columns={columns}
                    data={filteredData}
                    emptyState={{
                        title: "No government forms found",
                        subtitle: "Start by uploading your company's registration or compliance documents.",
                        icon: <FaFilePdf />
                    }}
                />
            </div>

            <GovernmentFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                editData={editingItem}
                loading={modalLoading}
            />
        </div>
    );
};

export default GovernmentForms;
