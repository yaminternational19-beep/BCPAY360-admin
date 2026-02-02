import React, { useState, useEffect, useMemo } from "react";
import { FaSearch, FaPaperPlane, FaUserCircle, FaCheckCircle, FaFilter, FaInbox, FaSitemap, FaClock, FaIdBadge } from "react-icons/fa";
import { Badge, Button, EmptyState, Loader } from "./components";
import { getSupportTickets, getSupportTicketById, respondToSupportTicket, getBranches } from "../../api/master.api";
import "./HelpSupport.css";

export default function HelpSupport() {
    const [tickets, setTickets] = useState([]);
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [detailLoading, setDetailLoading] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [replyText, setReplyText] = useState("");

    // Filter States
    const [searchQuery, setSearchQuery] = useState("");
    const [branchFilter, setBranchFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");

    // Fetch data on mount and when filters change
    useEffect(() => {
        fetchBranches();
    }, []);

    useEffect(() => {
        fetchTickets();
    }, [searchQuery, branchFilter, statusFilter]);

    const fetchBranches = async () => {
        try {
            const response = await getBranches();
            if (response && response.success) {
                setBranches(response.data || []);
            } else if (Array.isArray(response)) {
                setBranches(response);
            }
        } catch (error) {
            // silenced
        }
    };

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const params = {};
            if (searchQuery) params.search = searchQuery;
            if (branchFilter !== "All") params.branch_id = branchFilter;
            if (statusFilter !== "All") params.status = statusFilter;

            const response = await getSupportTickets(params);
            if (response.success) {
                setTickets(response.data || []);
            }
        } catch (error) {
            alert("Failed to fetch tickets: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleTicketSelect = async (id) => {
        setSelectedTicketId(id);
        setDetailLoading(true);
        try {
            const response = await getSupportTicketById(id);
            if (response.success) {
                setSelectedTicket(response.data);
            }
        } catch (error) {
            alert("Failed to fetch ticket details: " + error.message);
        } finally {
            setDetailLoading(false);
        }
    };

    const handleSendAndClose = async () => {
        if (!replyText.trim() || !selectedTicketId) return;

        try {
            const response = await respondToSupportTicket(selectedTicketId, { response: replyText });
            if (response.success) {
                setReplyText("");
                // Update local state to reflect closure
                setSelectedTicket(prev => ({ ...prev, adminReply: replyText, status: "Closed" }));
                setTickets(prev => prev.map(t =>
                    t.id === selectedTicketId ? { ...t, status: "Closed" } : t
                ));
                alert("Response sent and ticket closed successfully.");
            }
        } catch (error) {
            alert("Failed to send response: " + error.message);
        }
    };

    const getStatusVariant = (status) => {
        const s = status?.toUpperCase();
        switch (s) {
            case "OPEN": return "warning";
            case "CLOSED": return "success";
            default: return "neutral";
        }
    };

    return (
        <div className="module-container">
            <div className="module-header flex-between">
                <div>
                    <h1 className="module-title">Help & Support</h1>
                    <p className="module-subtitle">Resolve employee queries with a single, efficient response mechanism.</p>
                </div>
            </div>

            {/* Filters Section */}
            <div className="filters-container glass-panel" style={{ display: "flex", gap: "16px", padding: "16px", marginBottom: "20px", borderRadius: "12px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <div style={{ flex: 1, position: "relative" }}>
                    <FaSearch style={{ position: "absolute", left: "12px", top: "12px", color: "#94a3b8" }} />
                    <input
                        className="form-control"
                        placeholder="Search employee, email or subject..."
                        style={{ paddingLeft: "36px" }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <select
                    className="form-control"
                    style={{ width: "180px" }}
                    value={branchFilter}
                    onChange={(e) => setBranchFilter(e.target.value)}
                >
                    <option value="All">All Branches</option>
                    {branches.map(b => (
                        <option key={b.id} value={b.id}>{b.branch_name || b.name}</option>
                    ))}
                </select>
                <select
                    className="form-control"
                    style={{ width: "150px" }}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="All">All Status</option>
                    <option value="OPEN">Open</option>
                    <option value="CLOSED">Closed</option>
                </select>
            </div>

            <div className="split-layout-container" style={{ display: "flex", gap: "24px", flex: 1, minHeight: 0 }}>
                {/* Tickets Table Panel */}
                <div className="data-table-container glass-panel" style={{ flex: 1.2, overflowY: "auto", borderRadius: "12px", background: "#fff", border: "1px solid #e2e8f0", position: "relative" }}>
                    {loading && <Loader overlay />}
                    <table className="data-table">
                        <thead style={{ position: "sticky", top: 0, background: "#f1f5f9", zIndex: 1 }}>
                            <tr>
                                <th>Status</th>
                                <th>Employee</th>
                                <th>Branch</th>
                                <th>Subject</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map((ticket) => {
                                const branch = branches.find(b => b.id === ticket.branch_id);
                                return (
                                    <tr
                                        key={ticket.id}
                                        onClick={() => handleTicketSelect(ticket.id)}
                                        className={selectedTicketId === ticket.id ? "active-row" : ""}
                                    >
                                        <td>
                                            <Badge variant={getStatusVariant(ticket.status)}>{ticket.status}</Badge>
                                        </td>
                                        <td>
                                            <div className="emp-name">{ticket.employee_name || 'N/A'}</div>
                                            <div className="emp-email">{ticket.employee_email}</div>
                                        </td>
                                        <td>{branch ? (branch.branch_name || branch.name) : `ID: ${ticket.branch_id}`}</td>
                                        <td className="subject-cell">
                                            <span className="category-tag">{ticket.category}</span>
                                            {ticket.subject && <span className="subject-text"> - {ticket.subject}</span>}
                                        </td>
                                    </tr>
                                );
                            })}
                            {!loading && tickets.length === 0 && (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                                        No tickets found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Resolution Detail Panel */}
                <div className="detail-panel glass-panel" style={{ flex: 1, display: "flex", flexDirection: "column", borderRadius: "12px", background: "#fff", border: "1px solid #e2e8f0", padding: "24px", position: "relative" }}>
                    {detailLoading && <Loader overlay />}
                    {selectedTicket ? (
                        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                            <div className="detail-header">
                                <div className="detail-title-area">
                                    <h2 className="detail-title">{selectedTicket.category} {selectedTicket.subject ? `- ${selectedTicket.subject}` : ''}</h2>
                                    <Badge variant={getStatusVariant(selectedTicket.status)}>{selectedTicket.status}</Badge>
                                </div>
                                <div className="detail-info-grid">
                                    <div className="info-chip"><FaUserCircle /> {selectedTicket.employee_name}</div>
                                    <div className="info-chip"><FaSitemap /> {branches.find(b => b.id === selectedTicket.branch_id)?.branch_name || selectedTicket.branch_id}</div>
                                    <div className="info-chip"><FaIdBadge /> {selectedTicket.department || 'General'}</div>
                                    <div className="info-chip"><FaClock /> {new Date(selectedTicket.created_at).toLocaleDateString()}</div>
                                </div>
                            </div>

                            <div className="message-section">
                                <label className="section-label">Employee Description</label>
                                <div className="message-bubble">
                                    {selectedTicket.reason || selectedTicket.message || selectedTicket.description || 'No description provided.'}
                                </div>
                            </div>

                            <div className="admin-resolution-container" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                                <label className="section-label">Admin Resolution</label>
                                {selectedTicket.status?.toUpperCase() === "OPEN" ? (
                                    <>
                                        <textarea
                                            className="form-control"
                                            placeholder="Provide a final resolution to the employee..."
                                            style={{ flex: 1, minHeight: "150px", resize: "none", padding: "12px", fontSize: "14px", marginBottom: "16px" }}
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                        />
                                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                            <Button
                                                variant="primary"
                                                startIcon={<FaPaperPlane />}
                                                onClick={handleSendAndClose}
                                                disabled={!replyText.trim()}
                                            >
                                                Send & Close Ticket
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <div style={{ padding: "16px", background: "#f0fdf4", borderRadius: "8px", border: "1px solid #bbf7d0", color: "#166534", lineHeight: "1.6" }}>
                                        <div style={{ fontWeight: "700", marginBottom: "4px", fontSize: "12px" }}>Resolved:</div>
                                        {selectedTicket.adminReply}
                                        <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#15803d" }}>
                                            <FaCheckCircle /> This ticket has been resolved and closed.
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <EmptyState
                                icon={<FaInbox style={{ color: "#e2e8f0", fontSize: "48px" }} />}
                                title="No Ticket Selected"
                                description="Select a support ticket from the list to provide a resolution."
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
