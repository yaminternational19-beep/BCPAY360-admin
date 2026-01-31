import React, { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaChevronDown, FaChevronUp, FaQuestionCircle } from "react-icons/fa";
import { Button, Modal, EmptyState } from "./components";
import "./module.css";

const MOCK_FAQS = [
    { id: 1, question: "How do I reset my password?", answer: "Go to settings and click on change password." },
    { id: 2, question: "Where can I view my payslips?", answer: "Payslips can be found in the Payroll section of the app." },
    { id: 3, question: "How do I apply for leave?", answer: "Navigate to the Leave module and click 'Apply Leave'." },
    { id: 4, question: "Can I edit my attendance?", answer: "Attendance corrections can be requested via the Attendance module for approval." },
];

export default function FAQ() {
    const [faqs, setFaqs] = useState(MOCK_FAQS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ question: "", answer: "" });
    const [expandedId, setExpandedId] = useState(null);

    const handleOpenModal = (faq = null) => {
        if (faq) {
            setEditingId(faq.id);
            setFormData({ question: faq.question, answer: faq.answer });
        } else {
            setEditingId(null);
            setFormData({ question: "", answer: "" });
        }
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this FAQ?")) {
            setFaqs(faqs.filter((f) => f.id !== id));
            if (expandedId === id) setExpandedId(null);
        }
    };

    const handleSave = () => {
        if (!formData.question || !formData.answer) return;

        if (editingId) {
            setFaqs(faqs.map((f) => (f.id === editingId ? { ...f, ...formData } : f)));
        } else {
            setFaqs([...faqs, { id: Date.now(), ...formData }]);
        }
        setIsModalOpen(false);
    };

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="module-container">
            <div className="module-header flex-between">
                <div>
                    <h1 className="module-title">FAQ Management</h1>
                    <p className="module-subtitle">Create and manage frequently asked questions.</p>
                </div>
                <Button variant="primary" startIcon={<FaPlus />} onClick={() => handleOpenModal()}>
                    Create FAQ
                </Button>
            </div>

            <div className="faq-list">
                {faqs.length === 0 ? (
                    <EmptyState
                        title="No FAQs Created"
                        description="Get started by creating the first frequently asked question."
                        icon={<FaQuestionCircle style={{ color: "#d1d5db" }} />}
                        action={
                            <Button variant="primary" size="small" onClick={() => handleOpenModal()}>
                                Create Now
                            </Button>
                        }
                    />
                ) : (
                    faqs.map((faq) => (
                        <div key={faq.id} className="faq-card ui-card">
                            <button className="faq-trigger" onClick={() => toggleExpand(faq.id)}>
                                <div className="faq-question">{faq.question}</div>
                                <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                                    {expandedId === faq.id ? <FaChevronUp className="text-muted" /> : <FaChevronDown className="text-muted" />}
                                </div>
                            </button>

                            {expandedId === faq.id && (
                                <div className="faq-content">
                                    <p style={{ marginTop: 0 }}>{faq.answer}</p>
                                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "16px" }}>
                                        <Button
                                            size="small"
                                            variant="secondary"
                                            startIcon={<FaEdit />}
                                            onClick={() => handleOpenModal(faq)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="small"
                                            variant="danger"
                                            startIcon={<FaTrash />}
                                            onClick={() => handleDelete(faq.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingId ? "Edit FAQ" : "Add New FAQ"}
                size="medium"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button variant="primary" onClick={handleSave}>Save FAQ</Button>
                    </>
                }
            >
                <div className="form-field">
                    <label className="form-label">Question</label>
                    <input
                        type="text"
                        className="form-control"
                        value={formData.question}
                        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                        placeholder="e.g. How do I apply for leave?"
                    />
                </div>
                <div className="form-field">
                    <label className="form-label">Answer</label>
                    <textarea
                        className="form-control"
                        value={formData.answer}
                        onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                        placeholder="Provide a clear and concise answer..."
                        style={{ minHeight: "120px" }}
                    />
                </div>
            </Modal>
        </div>
    );
}
