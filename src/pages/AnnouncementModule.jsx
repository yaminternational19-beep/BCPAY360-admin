import React, { useState, useMemo } from "react";
import "../styles/AnnouncementModule.css";

export default function AnnouncementModule() {
  /* -----------------------------
     AUTH
  ----------------------------- */
  const user = JSON.parse(localStorage.getItem("auth_user")) || {};
  const isAdmin = user.role === "COMPANY_ADMIN";
  const isHR = user.role === "HR";

  /* -----------------------------
     STATE
  ----------------------------- */
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

  /* -----------------------------
     SORTED LIST
  ----------------------------- */
  const sortedAnnouncements = useMemo(() => {
    return [...announcements].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [announcements]);

  /* -----------------------------
     ADMIN ACTIONS
  ----------------------------- */
  const submitAnnouncement = (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    if (!form.title || !form.message) return;

    const newNotice = {
      id: Date.now(),
      title: form.title,
      message: form.message,
      createdAt: new Date().toISOString(),
      pinned: false,
      read: false,
    };

    setAnnouncements((prev) => [newNotice, ...prev]);
    setForm({ title: "", message: "" });

    alert("📢 Announcement published & push notification sent");
  };

  const togglePin = (id) => {
    if (!isAdmin) return;
    setAnnouncements((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, pinned: !n.pinned } : n
      )
    );
  };

  const deleteNotice = (id) => {
    if (!isAdmin) return;
    if (!window.confirm("Delete this announcement?")) return;
    setAnnouncements((prev) => prev.filter((n) => n.id !== id));
  };

  /* -----------------------------
     READ (ADMIN + HR)
  ----------------------------- */
  const toggleRead = (id) => {
    if (!isAdmin && !isHR) return;
    setAnnouncements((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read: !n.read } : n
      )
    );
  };

  /* =============================
     UI
  ============================== */
  return (
    <div className="announce-root">
      <h1 className="fade-in">Announcements & Notice Board</h1>

      {/* CREATE — ADMIN ONLY */}
      {isAdmin && (
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
            />

            <button className="btn-primary">Publish</button>
          </form>
        </section>
      )}

      {/* NOTICE BOARD */}
      <section className="card fade-in">
        <h2>Notice Board</h2>

        <div className="notice-list">
          {sortedAnnouncements.map((n) => (
            <div
              key={n.id}
              className={`notice-card ${n.pinned ? "pinned" : ""}`}
            >
              <div className="notice-header">
                <h3>
                  {n.title}
                  {n.pinned && (
                    <span className="pin-tag">📌 Pinned</span>
                  )}
                </h3>
                <span className="notice-date">
                  {new Date(n.createdAt).toLocaleString()}
                </span>
              </div>

              <p className="notice-msg">{n.message}</p>

              <div className="notice-actions">
                {/* ADMIN */}
                {isAdmin && (
                  <button
                    className="btn-sm"
                    onClick={() => togglePin(n.id)}
                  >
                    {n.pinned ? "Unpin" : "Pin"}
                  </button>
                )}

                {/* ADMIN + HR */}
                {(isAdmin || isHR) && (
                  <button
                    className="btn-sm"
                    onClick={() => toggleRead(n.id)}
                  >
                    {n.read ? "Mark Unread" : "Mark Read"}
                  </button>
                )}

                {/* ADMIN */}
                {isAdmin && (
                  <button
                    className="btn-sm danger"
                    onClick={() => deleteNotice(n.id)}
                  >
                    Delete
                  </button>
                )}
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
