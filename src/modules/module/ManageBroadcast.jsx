import React, { useState } from "react";
import { FaPaperPlane, FaUsers, FaHistory, FaCheckCircle, FaBullhorn } from "react-icons/fa";
import { Button, Modal, Card, CardBody, Badge, EmptyState } from "./components";
import "./module.css";

const MOCK_EMPLOYEES = [
    { id: 1, name: "John Doe", department: "Engineering" },
    { id: 2, name: "Jane Smith", department: "Marketing" },
    { id: 3, name: "Mike Ross", department: "Legal" },
    { id: 4, name: "Rachel Green", department: "Operations" },
    { id: 5, name: "Harvey Specter", department: "Management" },
];

const MOCK_HISTORY = [
    { id: 101, message: "Office will be closed tomorrow due to maintenance operations in the main server room.", audience: "All Employees", date: "2023-10-20 09:00 AM", sentBy: "Admin", count: 142 },
    { id: 102, message: "Please submit your tax proofs by Friday.", audience: "John Doe, Jane Smith", date: "2023-10-18 02:30 PM", sentBy: "Admin", count: 2 },
];

export default function ManageBroadcast() {
    const [history, setHistory] = useState(MOCK_HISTORY);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [target, setTarget] = useState("all");
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);

    const toggleEmployee = (id) => {
        if (selectedEmployees.includes(id)) {
            setSelectedEmployees(selectedEmployees.filter((e) => e !== id));
        } else {
            setSelectedEmployees([...selectedEmployees, id]);
        }
    };

    const handleSend = () => {
        if (!message.trim()) return;
        if (target === "specific" && selectedEmployees.length === 0) {
            alert("Select at least one employee.");
            return;
        }

        setIsSending(true);
        setTimeout(() => {
            const count = target === "all" ? 150 : selectedEmployees.length; // Mock count
            const audienceLabel = target === "all" ? "All Employees" : `${count} Recipients`;

            const newBroadcast = {
                id: Date.now(),
                message,
                audience: audienceLabel,
                date: new Date().toLocaleString(),
                sentBy: "Admin",
                count
            };

            setHistory([newBroadcast, ...history]);
            setMessage("");
            setSelectedEmployees([]);
            setTarget("all");
            setIsSending(false);
            setIsModalOpen(false);
        }, 1000);
    };

    const openComposer = () => {
        setIsModalOpen(true);
    };

    return (
        <div className="module-container">
            <div className="module-header flex-between">
                <div>
                    <h1 className="module-title">Manage Broadcast</h1>
                    <p className="module-subtitle">Send announcements to your organization.</p>
                </div>
                <Button variant="primary" startIcon={<FaPaperPlane />} onClick={openComposer}>
                    New Broadcast
                </Button>
            </div>

            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                <h3 style={{ marginBottom: "20px", color: "#374151" }}>Recent Activity</h3>

                {history.length === 0 ? (
                    <EmptyState
                        icon={<FaHistory style={{ color: "#d1d5db" }} />}
                        title="No Broadcasts Sent"
                        description="Your history of sent announcements will appear here."
                    />
                ) : (
                    <div className="history-list">
                        {history.map((item) => (
                            <div key={item.id} className="history-item sent" style={{ marginLeft: "12px" }}>
                                <div className="history-date">{item.date}</div>
                                <Card style={{ marginBottom: "0" }}>
                                    <CardBody style={{ padding: "16px" }}>
                                        <p className="history-msg">{item.message}</p>
                                        <div className="flex-between" style={{ marginTop: "12px" }}>
                                            <div className="history-meta" style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                                <Badge variant="neutral">{item.audience}</Badge>
                                                <span style={{ fontSize: "12px", color: "#6b7280" }}>• Sent by {item.sentBy}</span>
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#059669", fontWeight: "600" }}>
                                                <FaCheckCircle /> Delivered ({item.count})
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <FaBullhorn style={{ color: "#4f46e5" }} /> Compose Broadcast
                    </div>
                }
                size="medium"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button variant="primary" onClick={handleSend} isLoading={isSending} endIcon={<FaPaperPlane />}>
                            Send Announcement
                        </Button>
                    </>
                }
            >
                <div className="form-field">
                    <label className="form-label">Target Audience</label>
                    <div className="audience-selector">
                        <label className="radio-label">
                            <input type="radio" name="target" checked={target === "all"} onChange={() => setTarget("all")} />
                            All Employees
                        </label>
                        <label className="radio-label">
                            <input type="radio" name="target" checked={target === "specific"} onChange={() => setTarget("specific")} />
                            Specific Employees
                        </label>
                    </div>
                </div>

                {target === "specific" && (
                    <div className="form-field">
                        <label className="form-label">Select Recipients</label>
                        <div className="checkbox-list">
                            {MOCK_EMPLOYEES.map((emp) => (
                                <label key={emp.id} className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        checked={selectedEmployees.includes(emp.id)}
                                        onChange={() => toggleEmployee(emp.id)}
                                        style={{ marginRight: "12px" }}
                                    />
                                    <div>
                                        <div style={{ fontWeight: "500", fontSize: "14px" }}>{emp.name}</div>
                                        <div style={{ fontSize: "12px", color: "#6b7280" }}>{emp.department}</div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                <div className="form-field">
                    <label className="form-label">Message Content</label>
                    <textarea
                        className="form-control"
                        placeholder="Type your announcement here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        style={{ resize: "none", minHeight: "150px" }}
                    />
                    <p className="text-sm text-muted" style={{ marginTop: "6px" }}>
                        This message will be sent immediately to the selected recipients.
                    </p>
                </div>
            </Modal>
        </div>
    );
}
