export default function ExportActions({
  context,          // DAILY | MONTHLY | HISTORY
  onExport,
  disabled = false
}) {
  return (
    <div className="export-actions">
      <button
        className="export-btn"
        onClick={() => onExport({ type: "EXCEL", context })}
        disabled={disabled}
      >
        Export Excel
      </button>

      <button
        className="export-btn"
        onClick={() => onExport({ type: "PDF", context })}
        disabled={disabled}
      >
        Export PDF
      </button>
    </div>
  );
}
