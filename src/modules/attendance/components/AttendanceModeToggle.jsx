export default function AttendanceModeToggle({ mode, onChange }) {
  return (
    <div className="mode-toggle">
      <button
        className={mode === "DAILY" ? "active" : ""}
        onClick={() => onChange("DAILY")}
      >
        Daily
      </button>
      <button
        className={mode === "MONTHLY" ? "active" : ""}
        onClick={() => onChange("MONTHLY")}
      >
        Monthly
      </button>
    </div>
  );
}
