import { FileSpreadsheet, FileText } from "lucide-react";

export default function ExportActions({
  context,          // DAILY | MONTHLY | HISTORY
  onExport,
  disabled = false
}) {
  return (
    <div className="export-actions" style={{ display: 'flex', gap: '8px' }}>
      <button
        onClick={() => onExport({ type: "EXCEL", context })}
        disabled={disabled}
        title={`Export ${context} to Excel`}
        className="btn-export-new"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          border: '1px solid #10b981',
          backgroundColor: '#10b981',
          color: 'white',
          borderRadius: '6px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          fontSize: '13px',
          fontWeight: 500
        }}
        onMouseOver={(e) => !disabled && (e.target.style.backgroundColor = '#059669')}
        onMouseOut={(e) => !disabled && (e.target.style.backgroundColor = '#10b981')}
      >
        <FileSpreadsheet size={16} /> Excel
      </button>

      <button
        onClick={() => onExport({ type: "PDF", context })}
        disabled={disabled}
        title={`Export ${context} to PDF`}
        className="btn-export-new"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          border: '1px solid #ef4444',
          backgroundColor: '#ef4444',
          color: 'white',
          borderRadius: '6px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          fontSize: '13px',
          fontWeight: 500
        }}
        onMouseOver={(e) => !disabled && (e.target.style.backgroundColor = '#dc2626')}
        onMouseOut={(e) => !disabled && (e.target.style.backgroundColor = '#ef4444')}
      >
        <FileText size={16} /> PDF
      </button>
    </div>
  );
}
