import React, { useState, useEffect } from "react";
import "../../../styles/Shifts.css";

export default function ShiftForm({ onSave, onCancel, initialData, selectedBranch, user, loading }) {
  const [shiftData, setShiftData] = useState({
    shift_name: "",
    start_time: "",
    end_time: "",
    description: "",
  });

  useEffect(() => {
    if (initialData) {
      setShiftData({
        shift_name: initialData.shift_name || initialData.name || "",
        start_time: initialData.start_time || "",
        end_time: initialData.end_time || "",
        description: initialData.description || "",
      });
    } else {
      setShiftData({
        shift_name: "",
        start_time: "",
        end_time: "",
        description: "",
      });
    }
  }, [initialData]);

  const canSubmit = shiftData.shift_name.trim() && shiftData.start_time && shiftData.end_time;

  return (
    <div className="shifts-container">
      <div className="shifts-form-container">
        <h3>{initialData ? "Edit Shift" : "Add New Shift"}</h3>

        <div className="form-group">
          <label>Shift Name</label>
          <input
            placeholder="e.g., General Shift, Night Shift"
            value={shiftData.shift_name}
            onChange={(e) =>
              setShiftData({ ...shiftData, shift_name: e.target.value })
            }
          />
        </div>

        <div className="form-group-row">
          <div className="form-group">
            <label>Start Time</label>
            <input
              type="time"
              value={shiftData.start_time}
              onChange={(e) =>
                setShiftData({ ...shiftData, start_time: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>End Time</label>
            <input
              type="time"
              value={shiftData.end_time}
              onChange={(e) =>
                setShiftData({ ...shiftData, end_time: e.target.value })
              }
            />
          </div>
        </div>

        <div className="form-group">
          <label>Description (Optional)</label>
          <textarea
            placeholder="Additional details about the shift"
            value={shiftData.description}
            onChange={(e) =>
              setShiftData({ ...shiftData, description: e.target.value })
            }
            rows={3}
          />
        </div>

        <div className="form-actions">
          <button className="btn-cancel" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button className="btn-save" onClick={() => onSave(shiftData)} disabled={loading || !canSubmit}>
            {initialData ? "Update Shift" : "Add Shift"}
          </button>
        </div>
      </div>
    </div>
  );
}
