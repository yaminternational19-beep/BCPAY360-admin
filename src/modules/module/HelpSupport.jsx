import React, { useState } from "react";
import { FaSearch, FaReply, FaUserCircle, FaCheck, FaComments } from "react-icons/fa";
import { Badge, Button, EmptyState } from "./components";
import "./module.css";

const MOCK_TICKETS = [
    {
        id: 1,
        employee: "John Doe",
        department: "Engineering",
        subject: "Login Issues",
        status: "Open",
        date: "2023-10-25",
        messages: [
            { sender: "John Doe", role: "user", text: "I cannot login to the employee portal. It says invalid credentials.", time: "10:00 AM" },
        ],
    },
    {
        id: 2,
        employee: "Jane Smith",
        department: "Marketing",
        subject: "Leave Balance Correction",
        status: "Closed",
        date: "2023-10-24",
        messages: [
            { sender: "Jane Smith", role: "user", text: "My leave balance shows 5 days, but I should have 7.", time: "09:30 AM" },
            { sender: "Admin", role: "admin", text: "Hi Jane, let me check that for you.", time: "09:45 AM" },
            { sender: "Admin", role: "admin", text: "I have updated your balance. Please check now.", time: "10:00 AM" },
            { sender: "Jane Smith", role: "user", text: "Thank you, it's correct now.", time: "10:05 AM" },
        ],
    },
    {
        id: 3,
        employee: "Mike Ross",
        department: "Legal",
        subject: "Payslip Discrepancy",
        status: "Open",
        date: "2023-10-23",
        messages: [
            { sender: "Mike Ross", role: "user", text: "There seems to be a deduction I don't recognize on my Oct payslip.", time: "11:20 AM" },
        ],
    },
    {
        id: 4,
        employee: "Sarah Connor",
        department: "Operations",
        subject: "Asset Request",
        status: "In Progress",
        date: "2023-10-22",
        messages: [
            { sender: "Sarah Connor", role: "user", text: "I need a new mouse for my workstation.", time: "02:00 PM" },
            { sender: "Admin", role: "admin", text: "We have placed an order.", time: "02:30 PM" },
        ],
    },
];

const getBadgeVariant = (status) => {
    switch (status) {
        case "Open": return "warning";
        case "Closed": return "success";
        case "In Progress": return "info";
        default: return "neutral";
    }
};

export default function HelpSupport() {
    const [tickets, setTickets] = useState(MOCK_TICKETS);
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [replyText, setReplyText] = useState("");

    const selectedTicket = tickets.find((t) => t.id === selectedTicketId);

    const handleSendReply = () => {
        if (!replyText.trim() || !selectedTicketId) return;

        const newMsg = {
            sender: "Admin",
            role: "admin",
            text: replyText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        const updatedTickets = tickets.map((ticket) => {
            if (ticket.id === selectedTicketId) {
                return {
                    ...ticket,
                    messages: [...ticket.messages, newMsg],
                    status: "In Progress", // Auto-update status
                };
            }
            return ticket;
        });

        setTickets(updatedTickets);
        setReplyText("");
    };

    const handleResolve = () => {
        if (!selectedTicketId) return;
        const updatedTickets = tickets.map((ticket) => {
            if (ticket.id === selectedTicketId) {
                return { ...ticket, status: "Closed" };
            }
            return ticket;
        });
        setTickets(updatedTickets);
    };

    return (
        <div className="module-container">
            <div className="module-header flex-between">
                <div>
                    <h1 className="module-title">Help & Support</h1>
                    <p className="module-subtitle">Manage employee support requests and inquiries.</p>
                </div>
                <div style={{ position: "relative" }}>
                    <FaSearch style={{ position: "absolute", left: "12px", top: "12px", color: "#9ca3af" }} />
                    <input
                        type="text"
                        placeholder="Search tickets..."
                        className="form-control"
                        style={{ paddingLeft: "36px", width: "250px" }}
                    />
                </div>
            </div>

            <div className="split-layout-container">
                {/* Ticket List */}
                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Employee</th>
                                <th>Subject</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map((ticket) => (
                                <tr
                                    key={ticket.id}
                                    onClick={() => setSelectedTicketId(ticket.id)}
                                    style={{
                                        cursor: "pointer",
                                        backgroundColor: selectedTicketId === ticket.id ? "#eff6ff" : "white",
                                    }}
                                >
                                    <td>
                                        <Badge variant={getBadgeVariant(ticket.status)}>{ticket.status}</Badge>
                                    </td>
                                    <td>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <FaUserCircle className="text-muted" size={16} />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: "500" }}>{ticket.employee}</div>
                                                <div className="text-muted text-sm" style={{ fontSize: "11px" }}>{ticket.department}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{ticket.subject}</td>
                                    <td className="text-muted text-sm">{ticket.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Conversation Detail */}
                {selectedTicket ? (
                    <div className="chat-panel">
                        <div className="ui-card-header" style={{ alignItems: "center" }}>
                            <div>
                                <h3 className="ui-card-title">{selectedTicket.subject}</h3>
                                <p className="ui-card-subtitle">
                                    Ticket #{selectedTicket.id} • {selectedTicket.employee} • {selectedTicket.department}
                                </p>
                            </div>
                            <div style={{ display: "flex", gap: "8px" }}>
                                <Badge variant={getBadgeVariant(selectedTicket.status)}>{selectedTicket.status}</Badge>
                                {selectedTicket.status !== "Closed" && (
                                    <Button size="small" variant="ghost" className="text-sm" startIcon={<FaCheck />} onClick={handleResolve}>
                                        Resolve
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="chat-messages">
                            {selectedTicket.messages.map((msg, index) => (
                                <div key={index} className={`message-bubble ${msg.role === "admin" ? "bubble-admin" : "bubble-user"}`}>
                                    <div className="bubble-meta">
                                        {msg.sender} • {msg.time}
                                    </div>
                                    <div>{msg.text}</div>
                                </div>
                            ))}
                        </div>

                        <div className="chat-input-area">
                            <textarea
                                className="form-control"
                                placeholder="Type your reply..."
                                style={{ height: "100px", marginBottom: "12px", resize: "none" }}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                            />
                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                <Button variant="primary" startIcon={<FaReply />} onClick={handleSendReply}>
                                    Send Reply
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="chat-panel" style={{ alignItems: "center", justifyContent: "center" }}>
                        <EmptyState
                            icon={<FaComments style={{ color: "#d1d5db" }} />}
                            title="No Ticket Selected"
                            description="Select a support ticket from the list to view conversations and reply."
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
