import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, FileText, Printer, Download, CheckCircle2, AlertCircle } from "lucide-react";
import "../styles/EmployeeView.css";
// import { generateEmployeeDocument } from "../../../api/employees.api";
import { useToast } from "../../../context/ToastContext";

const EmployeeDocumentGenerate = () => {
    const { id, formCode } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();

    const [docName, setDocName] = useState("Document");
    const [generating, setGenerating] = useState(false);
    const [generatedUrl, setGeneratedUrl] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (location.state?.docName) {
            setDocName(location.state.docName);
        }
    }, [location.state]);

    const handleGenerate = async () => {
        setGenerating(true);
        setError(null);
        try {
            const res = await generateEmployeeDocument(id, formCode);
            if (res && (res.view_url || res.url)) {
                setGeneratedUrl(res.view_url || res.url);
                toast.success(`${docName} generated successfully`);
            } else {
                throw new Error("Invalid response from server");
            }
        } catch (err) {
            console.error("Generation failed:", err);
            setError(err.message || "Failed to generate document");
            toast.error(err.message || "Failed to generate document");
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="employee-view-container" style={{ maxWidth: '800px' }}>
            <div className="view-nav">
                <button className="btn-ghost" onClick={() => navigate(-1)}>
                    <ArrowLeft size={18} /> Back to Profile
                </button>
            </div>

            <div className="profile-hero-card" style={{ flexDirection: 'column', padding: '0', overflow: 'hidden' }}>
                <div style={{
                    padding: 'var(--space-lg)',
                    borderBottom: '1px solid var(--border-default)',
                    backgroundColor: 'var(--bg-muted)',
                    width: '100%'
                }}>
                    <h1 style={{ fontSize: 'var(--text-xl)', margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                        <Printer size={20} />
                        Generate Document: {docName}
                    </h1>
                </div>

                <div style={{ padding: 'var(--space-2xl)', textAlign: 'center', width: '100%' }}>
                    {generatedUrl ? (
                        <div className="success-state">
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: 'var(--radius-full)',
                                backgroundColor: 'var(--success-light)', // Assuming you have this var, or use #dcfce7
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto var(--space-lg) auto',
                                color: 'var(--success)' // #16a34a
                            }}>
                                <CheckCircle2 size={40} />
                            </div>
                            <h2 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-md)' }}>Document Ready</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>
                                Dictionary generated successfully. You can now view or download it.
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-md)' }}>
                                <button
                                    className="btn-secondary"
                                    onClick={() => window.open(generatedUrl, '_blank')}
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                >
                                    <FileText size={16} /> View
                                </button>
                                <button
                                    className="btn-primary"
                                    onClick={() => {
                                        const link = document.createElement('a');
                                        link.href = generatedUrl;
                                        link.download = `${docName}.pdf`; // Best effort download
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                    }}
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                >
                                    <Download size={16} /> Download PDF
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="initial-state">
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: 'var(--radius-full)',
                                backgroundColor: 'var(--primary-light)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto var(--space-lg) auto',
                                color: 'var(--primary)'
                            }}>
                                <FileText size={40} />
                            </div>

                            <h2 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-md)' }}>Preview & Generate</h2>
                            <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto var(--space-xl) auto' }}>
                                Generate the <strong>{docName}</strong> for this employee. This will start the generation process using the latest employee data.
                            </p>

                            {error && (
                                <div style={{
                                    marginBottom: '20px',
                                    padding: '12px',
                                    backgroundColor: '#fee2e2',
                                    color: '#b91c1c',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    maxWidth: '400px',
                                    margin: '0 auto 20px auto'
                                }}>
                                    <AlertCircle size={16} />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-md)' }}>
                                <button
                                    className="btn-primary"
                                    onClick={handleGenerate}
                                    disabled={generating}
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '150px', justifyContent: 'center' }}
                                >
                                    {generating ? <div className="spinner-sm"></div> : <Printer size={16} />}
                                    {generating ? "Generating..." : "Generate Now"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmployeeDocumentGenerate;
