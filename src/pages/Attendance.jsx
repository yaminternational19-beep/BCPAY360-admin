import React, { useMemo, useState } from "react";
import "../styles/Attendance.css";

/* Chart.js + react-chartjs-2 */
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

/* -------------------------
   Dummy employee list
   ------------------------- */
const employeesData = [
  { id: 1, name: "Ravi Kumar", department: "IT", role: "Developer" },
  { id: 2, name: "Sneha Reddy", department: "HR", role: "HR Executive" },
  { id: 3, name: "Amit Verma", department: "Finance", role: "Accountant" },
  { id: 4, name: "Divya Patel", department: "IT", role: "Tester" },
  { id: 5, name: "Naveen Rao", department: "Sales", role: "Sales Executive" },
];

/* -------------------------
   Helpers: generate sample month data
   ------------------------- */
const daysInMonth = (y, m) => new Date(y, m, 0).getDate();

const generateRecordsForMonth = (year, month) => {
  // month: 1-12
  const days = daysInMonth(year, month);
  const records = [];

  employeesData.forEach((emp) => {
    for (let d = 1; d <= days; d++) {
      // random presence with slight bias for present
      const present = Math.random() > 0.12;
      // small chance of late
      const late = present && Math.random() < 0.08;
      const date = new Date(year, month - 1, d).toISOString().slice(0, 10);

      records.push({
        id: emp.id,
        name: emp.name,
        department: emp.department,
        role: emp.role,
        date,
        status: present ? "Present" : "Absent",
        checkIn: present ? (late ? "09:22" : "09:00") : "",
        checkOut: present ? "18:00" : "",
        late: late ? 1 : 0,
      });
    }
  });

  return records;
};

/* -------------------------
   Component
   ------------------------- */
const Attendance = () => {
  const today = new Date();
  const thisYear = today.getFullYear();
  const thisMonth = today.getMonth() + 1; // 1..12

  // COMPLETE SAMPLE monthly dataset (modifiable)
  const [records, setRecords] = useState(() =>
    generateRecordsForMonth(thisYear, thisMonth)
  );

  // Filters & UI state
  const [filterDate, setFilterDate] = useState("");
  const [dept, setDept] = useState("All");
  const [role, setRole] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalData, setModalData] = useState(null);

  // dropdown options
  const departments = useMemo(
    () => ["All", ...new Set(records.map((r) => r.department))],
    [records]
  );
  const roles = useMemo(() => ["All", ...new Set(records.map((r) => r.role))], [
    records,
  ]);

  // filtered view (daily table)
  const filtered = useMemo(() => {
    let list = [...records];
    if (filterDate) list = list.filter((r) => r.date === filterDate);
    if (dept !== "All") list = list.filter((r) => r.department === dept);
    if (role !== "All") list = list.filter((r) => r.role === role);
    if (statusFilter !== "All") list = list.filter((r) => r.status === statusFilter);
    return list;
  }, [records, filterDate, dept, role, statusFilter]);

  // Summary per employee for month
  const summary = useMemo(() => {
    return employeesData.map((emp) => {
      const empRecs = records.filter((r) => r.id === emp.id);
      const workingDays = empRecs.length;
      const present = empRecs.filter((r) => r.status === "Present").length;
      const absent = workingDays - present;
      const lateMarks = empRecs.reduce((s, x) => s + (x.late || 0), 0);
      const percent = workingDays ? ((present / workingDays) * 100).toFixed(1) : "0.0";
      return { ...emp, workingDays, present, absent, lateMarks, percent };
    });
  }, [records]);

  /* -------------------------
     Charts Data
     ------------------------- */

  // Bar chart: present vs absent per employee
  const barData = useMemo(() => {
    const labels = summary.map((s) => s.name);
    return {
      labels,
      datasets: [
        {
          label: "Present",
          data: summary.map((s) => s.present),
          backgroundColor: "#2563eb",
          borderRadius: 6,
        },
        {
          label: "Absent",
          data: summary.map((s) => s.absent),
          backgroundColor: "#ef4444",
          borderRadius: 6,
        },
      ],
    };
  }, [summary]);

  const barOptions = {
    responsive: true,
    plugins: { legend: { position: "top", labels: { color: "#0f172a" } } },
    scales: {
      x: { ticks: { color: "#0f172a" } },
      y: { ticks: { color: "#0f172a" }, beginAtZero: true },
    },
  };

  // Line chart: daily attendance % for the month
  const lineData = useMemo(() => {
    const days = daysInMonth(thisYear, thisMonth);
    const labels = Array.from({ length: days }, (_, i) => (i + 1).toString());
    const presentCounts = labels.map((lab, idx) => {
      const d = new Date(thisYear, thisMonth - 1, idx + 1).toISOString().slice(0, 10);
      const recs = records.filter((r) => r.date === d);
      if (!recs.length) return 0;
      const present = recs.filter((r) => r.status === "Present").length;
      return ((present / recs.length) * 100).toFixed(1);
    });

    return {
      labels,
      datasets: [
        {
          label: "Attendance % (daily)",
          data: presentCounts,
          borderColor: "#10b981",
          backgroundColor: "rgba(16,185,129,0.08)",
          fill: true,
          tension: 0.3,
          pointRadius: 3,
        },
      ],
    };
  }, [records, thisYear, thisMonth]);

  const lineOptions = {
    responsive: true,
    plugins: { legend: { position: "top", labels: { color: "#0f172a" } } },
    scales: {
      x: { ticks: { color: "#0f172a" } },
      y: { ticks: { color: "#0f172a" }, beginAtZero: true, max: 100 },
    },
  };
  
  /* -------------------------
     Actions: Save record (modal)
     ------------------------- */
  const saveRecord = () => {
    if (!modalData) return;
    const exists = records.some((r) => r.id === modalData.id && r.date === modalData.date);
    if (exists) {
      setRecords((prev) =>
        prev.map((r) => (r.id === modalData.id && r.date === modalData.date ? modalData : r))
      );
    } else {
      setRecords((prev) => [...prev, modalData]);
    }
    setModalData(null);
  };

  /* -------------------------
     CSV Export (filtered)
     ------------------------- */
  const exportCSV = () => {
    const rows = filtered.map((r) => ({
      id: r.id,
      name: r.name,
      department: r.department,
      role: r.role,
      date: r.date,
      status: r.status,
      checkIn: r.checkIn,
      checkOut: r.checkOut,
    }));
    if (!rows.length) {
      alert("No records to export for the current filters.");
      return;
    }
    const csv = [Object.keys(rows[0]).join(","), ...rows.map((r) => Object.values(r).map((v) => `"${v}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_export_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="attendance-container">
      {/* TOP ROW: Filters + actions */}
      <div className="att-controls">
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          title="Filter by date"
        />

        <select value={dept} onChange={(e) => setDept(e.target.value)}>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option>All</option>
          <option>Present</option>
          <option>Absent</option>
        </select>

        <button
          className="btn-add"
          onClick={() =>
            setModalData({
              id: "",
              name: "",
              department: "",
              role: "",
              date: "",
              status: "Present",
              checkIn: "",
              checkOut: "",
              late: 0,
            })
          }
        >
          Add Attendance
        </button>

        <button className="btn-export" onClick={exportCSV}>
          Export CSV
        </button>
      </div>

      {/* DASHBOARD GRID: charts + table */}
      <div className="att-grid">
        <div className="chart-card">
          <h4>Present vs Absent (per employee)</h4>
          <Bar data={barData} options={barOptions} />
        </div>

        <div className="chart-card">
          <h4>Attendance % (trend)</h4>
          <Line data={lineData} options={lineOptions} />
        </div>

        {/* Daily table */}
        <div className="table-card fullwidth">
          <table className="att-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Dept</th>
                <th>Role</th>
                <th>Date</th>
                <th>Status</th>
                <th>In</th>
                <th>Out</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length ? (
                filtered.map((r) => (
                  <tr key={`${r.id}-${r.date}`}>
                    <td>{r.id}</td>
                    <td>{r.name}</td>
                    <td>{r.department}</td>
                    <td>{r.role}</td>
                    <td>{r.date}</td>
                    <td className={r.status === "Absent" ? "absent" : "present"}>{r.status}</td>
                    <td>{r.checkIn}</td>
                    <td>{r.checkOut}</td>
                    <td>
                      <button
                        onClick={() =>
                          setModalData({
                            ...r,
                          })
                        }
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="no-data">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="table-card fullwidth">
          <h4 style={{ marginBottom: 12 }}>Monthly Attendance Summary</h4>
          <table className="summary-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Working Days</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Late Marks</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              {summary.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.workingDays}</td>
                  <td>{s.present}</td>
                  <td>{s.absent}</td>
                  <td>{s.lateMarks}</td>
                  <td>{s.percent}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add / Edit */}
      {modalData && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 style={{ marginBottom: 12 }}>{modalData.id ? "Edit Attendance" : "Add Attendance"}</h3>

            <label>Name</label>
            <input
              placeholder="Employee ID or name"
              value={modalData.name}
              onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
            />

            <label>Employee ID</label>
            <input
              placeholder="numeric id"
              value={modalData.id}
              onChange={(e) => setModalData({ ...modalData, id: Number(e.target.value) || "" })}
            />

            <label>Date</label>
            <input type="date" value={modalData.date} onChange={(e) => setModalData({ ...modalData, date: e.target.value })} />

            <label>Status</label>
            <select value={modalData.status} onChange={(e) => setModalData({ ...modalData, status: e.target.value })}>
              <option>Present</option>
              <option>Absent</option>
            </select>

            <label>Check In</label>
            <input value={modalData.checkIn} onChange={(e) => setModalData({ ...modalData, checkIn: e.target.value })} />

            <label>Check Out</label>
            <input value={modalData.checkOut} onChange={(e) => setModalData({ ...modalData, checkOut: e.target.value })} />

            <div className="modal-actions">
              <button className="save-btn" onClick={saveRecord}>
                Save
              </button>
              <button className="cancel-btn" onClick={() => setModalData(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
