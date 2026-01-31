import React, { useState } from "react";
import { FaEdit, FaSave, FaFileSignature, FaShieldAlt, FaHandshake, FaMoneyBillWave, FaEnvelope, FaFileAlt, FaPlus, FaCheck } from "react-icons/fa";
import { Card, CardBody, Button, Modal, Loader } from "./components";
import "./module.css";

const INITIAL_SECTIONS = [
    { id: "about", label: "About Us", icon: <FaFileSignature />, color: "blue", lastUpdated: "2 days ago" },
    { id: "terms", label: "Terms & Conditions", icon: <FaHandshake />, color: "purple", lastUpdated: "1 week ago" },
    { id: "privacy", label: "Privacy Policy", icon: <FaShieldAlt />, color: "green", lastUpdated: "1 month ago" },
    { id: "refund", label: "Refund Policy", icon: <FaMoneyBillWave />, color: "orange", lastUpdated: "3 weeks ago" },
    { id: "contact", label: "Contact Information", icon: <FaEnvelope />, color: "blue", lastUpdated: "5 days ago" },
    { id: "other", label: "Additional Page", icon: <FaFileAlt />, color: "purple", lastUpdated: "Just now" },
];

export default function ManageContent() {
    const [sections, setSections] = useState(INITIAL_SECTIONS);
    const [activeSection, setActiveSection] = useState(null);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Editor State
    const [content, setContent] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // Creation State
    const [newSectionTitle, setNewSectionTitle] = useState("");
    const [newSectionColor, setNewSectionColor] = useState("blue");

    // Handle opening the content editor
    const handleEdit = (section) => {
        setActiveSection(section);
        // Simulate fetching content
        setContent(`Content for ${section.label} takes place here. This is a rich text area placeholder.`);
        setIsEditorOpen(true);
    };

    // Handle saving content
    const handleSaveContent = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setIsEditorOpen(false);
            // Update the "last updated" text for simulation
            setSections(sections.map(s => s.id === activeSection.id ? { ...s, lastUpdated: "Just now" } : s));
            alert(`${activeSection.label} updated successfully!`);
        }, 800);
    };

    // Handle creating a new section
    const handleCreateSection = () => {
        if (!newSectionTitle.trim()) return;

        const newSection = {
            id: `custom-${Date.now()}`,
            label: newSectionTitle,
            icon: <FaFileAlt />, // Default icon
            color: newSectionColor,
            lastUpdated: "New"
        };

        setSections([...sections, newSection]);
        setNewSectionTitle("");
        setNewSectionColor("blue");
        setIsCreateOpen(false);
    };

    return (
        <div className="module-container">
            <div className="module-header flex-between">
                <div>
                    <h1 className="module-title">Manage Content</h1>
                    <p className="module-subtitle">Update and manage your organization's static content pages.</p>
                </div>
                <Button variant="primary" startIcon={<FaPlus />} onClick={() => setIsCreateOpen(true)}>
                    Add New Page
                </Button>
            </div>

            <div className="content-grid">
                {sections.map((section) => (
                    <Card key={section.id} className="interactive" onClick={() => handleEdit(section)}>
                        <CardBody style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <div className={`section-icon-wrapper icon-${section.color}`}>
                                {section.icon}
                            </div>
                            <h3 className="ui-card-title">{section.label}</h3>
                            <p className="ui-card-subtitle" style={{ marginBottom: "16px" }}>Last updated: {section.lastUpdated}</p>

                            <Button variant="secondary" size="small" startIcon={<FaEdit />}>
                                Edit Content
                            </Button>
                        </CardBody>
                    </Card>
                ))}
            </div>

            {/* Content Editor Modal */}
            <Modal
                isOpen={isEditorOpen}
                onClose={() => setIsEditorOpen(false)}
                title={activeSection ? `Edit ${activeSection.label}` : "Edit Content"}
                size="large"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setIsEditorOpen(false)}>Cancel</Button>
                        <Button variant="primary" onClick={handleSaveContent} isLoading={isSaving} startIcon={<FaSave />}>
                            Save Changes
                        </Button>
                    </>
                }
            >
                <div className="form-field">
                    <label className="form-label">Page Content</label>
                    <textarea
                        className="form-control"
                        style={{ minHeight: "300px", fontFamily: "monospace" }}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Type your content here..."
                    />
                    <p className="text-sm text-muted" style={{ marginTop: "8px" }}>
                        Basic HTML formatting is supported.
                    </p>
                </div>
            </Modal>

            {/* Create Section Modal */}
            <Modal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                title="Add New Content Page"
                size="small"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                        <Button variant="primary" onClick={handleCreateSection} startIcon={<FaCheck />}>
                            Create Page
                        </Button>
                    </>
                }
            >
                <div className="form-field">
                    <label className="form-label">Page Title</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Employee Handbook"
                        value={newSectionTitle}
                        onChange={(e) => setNewSectionTitle(e.target.value)}
                        autoFocus
                    />
                </div>

                <div className="form-field">
                    <label className="form-label">Color Theme</label>
                    <div style={{ display: "flex", gap: "12px" }}>
                        {["blue", "purple", "green", "orange"].map(color => (
                            <div
                                key={color}
                                onClick={() => setNewSectionColor(color)}
                                style={{
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "50%",
                                    cursor: "pointer",
                                    backgroundColor: color === "blue" ? "#e0f2fe" :
                                        color === "purple" ? "#f3e8ff" :
                                            color === "green" ? "#dcfce7" : "#ffedd5",
                                    border: newSectionColor === color ? `2px solid #4f46e5` : "2px solid transparent",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: color === "blue" ? "#0284c7" :
                                        color === "purple" ? "#9333ea" :
                                            color === "green" ? "#16a34a" : "#ea580c"
                                }}
                            >
                                <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "currentColor" }}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>
        </div>
    );
}
