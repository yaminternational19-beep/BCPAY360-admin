import React, { useState } from "react";
import "../styles/AnnouncementModule.css";

export default function AnnouncementModule() {
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: "Holiday Announcement",
      message: "Office will remain closed on Monday due to maintenance.",
      createdAt: new Date().toISOString(),
      pinned: true,
      read: false,
    },
    {
      id: 2,
      title: "Payroll Update",
      message: "Salary will be credited on 28th this month.",
      createdAt: new Date().toISOString(),
      pinned: false,
      read: true,
    },
  ]);

  const [form, setForm] = useState({
    title: "",
    message: "",
  });

  const sortedAnnouncements = announcements.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // Add new announcement
  const submitAnnouncement = (e) => {
    e.preventDefault();
    if (!form.title || !form.message) return;

    const newNotice = {
      id: Date.now(),
      title: form.title,
      message: form.message,
      createdAt: new Date().toISOString(),
      pinned: false,
      read: false,
    };

    setAnnouncements([newNotice, ...announcements]);
    setForm({ title: "", message: "" });

    // Simulated push notification
    alert("📢 Push notification sent to all employees!");
  };

  // Toggle pinned
  const togglePin = (id) => {
    setAnnouncements((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
    );
  };

  // Toggle Read Status
  const toggleRead = (id) => {
    setAnnouncements((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  // Delete
  const deleteNotice = (id) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) return;
    setAnnouncements((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="announce-root">
      <h1 className="fade-in">Announcements & Notice Board</h1>

      {/* Add Announcement */}
      <section className="card slide-up">
        <h2>Create Announcement</h2>

        <form className="ann-form" onSubmit={submitAnnouncement}>
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />
          <textarea
            placeholder="Message..."
            rows="4"
            value={form.message}
            onChange={(e) =>
              setForm({ ...form, message: e.target.value })
            }
          ></textarea>

          <button className="btn-primary">Publish</button>
        </form>
      </section>

      {/* Notice List */}
      <section className="card fade-in">
        <h2>Notice Board</h2>

        <div className="notice-list">
          {sortedAnnouncements.map((n) => (
            <div key={n.id} className={`notice-card ${n.pinned ? "pinned" : ""}`}>

              <div className="notice-header">
                <h3>
                  {n.title}
                  {n.pinned && <span className="pin-tag">📌 Pinned</span>}
                </h3>
                <span className="notice-date">
                  {new Date(n.createdAt).toLocaleString()}
                </span>
              </div>

              <p className="notice-msg">{n.message}</p>

              <div className="notice-actions">
                <button
                  className="btn-sm"
                  onClick={() => togglePin(n.id)}
                >
                  {n.pinned ? "Unpin" : "Pin"}
                </button>

                <button
                  className="btn-sm"
                  onClick={() => toggleRead(n.id)}
                >
                  {n.read ? "Mark Unread" : "Mark Read"}
                </button>

                <button
                  className="btn-sm danger"
                  onClick={() => deleteNotice(n.id)}
                >
                  Delete
                </button>
              </div>

            </div>
          ))}

          {announcements.length === 0 && (
            <div className="empty">No announcements yet</div>
          )}
        </div>
      </section>
    </div>
  );
}
