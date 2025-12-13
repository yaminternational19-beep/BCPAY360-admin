import React, { useMemo, useState } from "react";
import "../styles/Attendance.css";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { Pie, Line } from "react-chartjs-2";

import { makeEmployees } from "../utils/mockData.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

/* ===============================
   DATA
================================ */
const employees = makeEmployees(1000);
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const PAGE_SIZE = 20;

const genDay = () => {
  const r = Math.random();
  if (r < 0.1) return { status: "Leave" };
  if (r < 0.25) return { status: "Absent" };
  return { status: "Present", in: "09:00", out: "18:00" };
};

const genWeek = () =>
  DAYS.reduce((a, d) => {
    a[d] = genDay();
    return a;
  }, {});

/* ===============================
   COMPONENT
================================ */
export default function Attendance() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);

  const data = useMemo(
    () => employees.map((e) => ({ ...e, week: genWeek() })),
    []
  );

  const filtered = useMemo(() => {
    return data.filter((e) =>
      `${e.id} ${e.name} ${e.department} ${e.role}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [data, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const rows = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  /* Charts */
  const pieData = useMemo(() => {
    let p = 0, a = 0, l = 0;
    data.forEach((e) => {
      const s = e.week.Mon.status;
      if (s === "Present") p++;
      else if (s === "Absent") a++;
      else l++;
    });
    return {
      labels: ["Present", "Absent", "Leave"],
      datasets: [
        {
          data: [p, a, l],
          backgroundColor: ["#22c55e", "#ef4444", "#f59e0b"],
        },
      ],
    };
  }, [data]);

  const lineData = {
    labels: Array.from({ length: 30 }, (_, i) => i + 1),
    datasets: [
      {
        label: "Attendance %",
        data: Array.from({ length: 30 }, () =>
          (70 + Math.random() * 30).toFixed(1)
        ),
        borderColor: "#3b82f6",
        tension: 0.3,
      },
    ],
  };

  /* Export */
  const exportCSV = () => {
    const rows = filtered.map((e) => {
      const r = { ID: e.id, Name: e.name };
      DAYS.forEach((d) => {
        const x = e.week[d];
        r[d] =
          x.status === "Present"
            ? `${x.in}-${x.out}`
            : x.status === "Absent"
            ? "A"
            : "L";
      });
      return r;
    });

    const csv = [
      Object.keys(rows[0]).join(","),
      ...rows.map((r) => Object.values(r).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "attendance.csv";
    a.click();
  };

  return (
    <div className="attendance-page">
      <h2>Attendance Dashboard</h2>

      {/* Charts */}
      <div className="charts">
        <div className="card">
          <h4>Today</h4>
          <Pie data={pieData} />
        </div>
        <div className="card">
          <h4>Monthly Trend</h4>
          <Line data={lineData} />
        </div>
      </div>

      {/* Controls */}
      <div className="controls">
        <input
          placeholder="Search employee..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <button onClick={exportCSV}>Export Excel</button>
      </div>

      {/* Table */}
      <div className="table-box">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              {DAYS.map((d) => (
                <th key={d}>{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => (
              <tr key={e.id}>
                <td>{e.id}</td>
                <td>{e.name}</td>
                {DAYS.map((d) => {
                  const x = e.week[d];
                  return (
                    <td
                      key={d}
                      className={`cell ${x.status.toLowerCase()}`}
                      title={
                        x.status === "Present"
                          ? `In ${x.in} / Out ${x.out}`
                          : x.status
                      }
                      onClick={() =>
                        setModal({ emp: e, day: d, data: x })
                      }
                    >
                      {x.status === "Present"
                        ? `${x.in}-${x.out}`
                        : x.status === "Absent"
                        ? "A"
                        : "L"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span>
          Page {page} / {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {modal && (
        <div className="modal" onClick={() => setModal(null)}>
          <div onClick={(e) => e.stopPropagation()}>
            <h3>{modal.emp.name}</h3>
            <p>Day: {modal.day}</p>
            <p>Status: {modal.data.status}</p>
            {modal.data.in && (
              <>
                <p>In: {modal.data.in}</p>
                <p>Out: {modal.data.out}</p>
              </>
            )}
            <button onClick={() => setModal(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
