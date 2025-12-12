import React, { useState } from "react";
import "../styles/HolidaysModule.css";

export default function HolidaysModule() {
  const [holidays, setHolidays] = useState([
    {
      id: 1,
      title: "New Year",
      date: "2025-01-01",
      type: "Public",
    },
    {
      id: 2,
      title: "Company Foundation Day",
      date: "2025-04-12",
      type: "Company",
    },
  ]);

  const [form, setForm] = useState({
    title: "",
    date: "",
    type: "Public",
  });

  const addHoliday = (e) => {
    e.preventDefault();
    if (!form.title || !form.date) return;

    setHolidays((prev) => [
      {
        id: Date.now(),
        ...form,
      },
      ...prev,
    ]);

    setForm({ title: "", date: "", type: "Public" });

    // Placeholder for sending to mobile app backend
    alert("📅 Holiday added and pushed to app!");
  };

  const deleteHoliday = (id) => {
    if (!window.confirm("Delete this holiday?")) return;
    setHolidays((prev) => prev.filter((h) => h.id !== id));
  };

  const sortedHolidays = holidays.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return (
    <div className="hol-root">
      <h1 className="fade-in">Holidays & Calendar</h1>

      {/* Add Holiday */}
      <section className="card slide-up">
        <h2>Add Holiday</h2>

        <form className="hol-form" onSubmit={addHoliday}>
          <input
            placeholder="Holiday Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />

          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="Public">Public</option>
            <option value="Company">Company</option>
          </select>

          <button className="btn-primary">Add</button>
        </form>
      </section>

      {/* Holiday List */}
      <section className="card fade-in">
        <h2>Holiday List (Yearly)</h2>

        <div className="holiday-list">
          {sortedHolidays.map((h) => (
            <div key={h.id} className="holiday-item">

              <div className="holiday-left">
                <h3>{h.title}</h3>
                <p className="hol-date">
                  {new Date(h.date).toLocaleDateString("en-IN", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="holiday-right">
                <span className={`tag ${h.type.toLowerCase()}`}>
                  {h.type}
                </span>

                <button
                  className="btn-sm danger"
                  onClick={() => deleteHoliday(h.id)}
                >
                  Delete
                </button>
              </div>

            </div>
          ))}

          {holidays.length === 0 && (
            <div className="empty">No holidays added yet.</div>
          )}
        </div>
      </section>
    </div>
  );
}
