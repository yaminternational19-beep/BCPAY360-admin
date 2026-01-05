import React, { useEffect, useMemo, useState } from "react";
import "../styles/Attendance.css";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import {
  getAdminAttendanceEmployees,
  getAdminAttendanceMatrix,
  approveAttendanceRequest,
  rejectAttendanceRequest,
  getBranches,
  getDepartments,
} from "../api/master.api";

ChartJS.register(ArcElement, Tooltip, Legend);

const PAGE_SIZE = 20;

/* =============================
   HELPERS
============================= */
const getDateRange = (from, to) => {
  const dates = [];
  const start = new Date(from + "-01");
  const end = new Date(to + "-01");
  end.setMonth(end.getMonth() + 1);

  while (start < end) {
    if (start.getDay() !== 0) {
      dates.push(start.toISOString().slice(0, 10));
    }
    start.setDate(start.getDate() + 1);
  }
  return dates;
};

/* =============================
   COMPONENT
============================= */
export default function Attendance() {
  const user = JSON.parse(localStorage.getItem("auth_user"));
  if (!user?.role) return <h3 style={{ padding: 20 }}>Unauthorized</h3>;

  /* Filters */
  const [branchId, setBranchId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [search, setSearch] = useState("");
  const [designation, setDesignation] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [fromMonth, setFromMonth] = useState("2024-06");
  const [toMonth, setToMonth] = useState("2024-07");

  /* Pagination */
  const [page, setPage] = useState(1);

  /* Master Data */
  const [branches, setBranches] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);

  /* Attendance Matrix */
  const [attendance, setAttendance] = useState({});

  /* =============================
     LOADERS
============================= */
  useEffect(() => {
    getBranches().then(setBranches);
  }, []);

  useEffect(() => {
    if (branchId) {
      getDepartments(branchId).then(setDepartments);
    } else {
      setDepartments([]);
      setDepartmentId("");
    }
  }, [branchId]);

  useEffect(() => {
    getAdminAttendanceEmployees().then(setEmployees);
  }, []);

  const loadMatrix = async () => {
    const matrix = await getAdminAttendanceMatrix({
      from: fromMonth,
      to: toMonth,
      branch_id: branchId,
      department_id: departmentId,
    });
    setAttendance(matrix || {});
    setPage(1);
  };

  useEffect(() => {
    if (employees.length) loadMatrix();
  }, [employees, fromMonth, toMonth, branchId, departmentId]);

  /* =============================
     DERIVED
============================= */
  const dates = useMemo(
    () => getDateRange(fromMonth, toMonth),
    [fromMonth, toMonth]
  );

  const filteredEmployees = useMemo(() => {
    return employees.filter(e => {
      if (branchId && e.branch_id !== Number(branchId)) return false;
      if (departmentId && e.department_id !== Number(departmentId)) return false;

      const matchSearch =
        e.id.toLowerCase().includes(search.toLowerCase()) ||
        e.name.toLowerCase().includes(search.toLowerCase());

      const matchRole = !designation || e.role === designation;

      const matchStatus =
        !statusFilter ||
        Object.values(attendance[e.id] || {}).some(
          d => d.status === statusFilter
        );

      return matchSearch && matchRole && matchStatus;
    });
  }, [
    employees,
    attendance,
    search,
    designation,
    statusFilter,
    branchId,
    departmentId,
  ]);

  const totalPages = Math.ceil(filteredEmployees.length / PAGE_SIZE);
  const paginatedEmployees = filteredEmployees.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const pendingRequests = useMemo(() => {
    const list = [];
    paginatedEmployees.forEach(emp => {
      Object.entries(attendance[emp.id] || {}).forEach(([day, d]) => {
        if (d.request?.state === "PENDING") {
          list.push({
            emp,
            day,
            log_id: d.request.log_id,
          });
        }
      });
    });
    return list;
  }, [paginatedEmployees, attendance]);

  /* =============================
     ACTIONS
============================= */
  const actOnRequest = async (log_id, decision) => {
    if (decision === "APPROVE") {
      await approveAttendanceRequest(log_id);
    } else {
      await rejectAttendanceRequest({
        log_id,
        reason: "Rejected by admin",
      });
    }
    await loadMatrix();
  };

  /* =============================
     PIE
============================= */
  const pieData = useMemo(() => {
    let p = 0, a = 0, l = 0, m = 0;
    filteredEmployees.forEach(e =>
      Object.values(attendance[e.id] || {}).forEach(d => {
        if (d.status === "P") p++;
        else if (d.status === "A") a++;
        else if (d.status === "L") l++;
        else if (d.status === "M") m++;
      })
    );
    return {
      labels: ["Present", "Absent", "Leave", "Missing"],
      datasets: [{
        data: [p, a, l, m],
        backgroundColor: ["#22c55e", "#ef4444", "#f59e0b", "#8b5cf6"],
      }],
    };
  }, [attendance, filteredEmployees]);

  /* =============================
     RENDER
============================= */
  return (
    <div className="attendance-page">
      <h2>Attendance</h2>

      <div className="charts">
        <div className="card"><Pie data={pieData} /></div>

        <div className="card hr-panel">
          <h4>Pending Requests</h4>
          {pendingRequests.length === 0 && <p>No pending requests</p>}
          {pendingRequests.map((r, i) => (
            <div key={i} className="request-row">
              <div>
                <strong>{r.emp.name}</strong>
                <div>{r.emp.role} — {r.day}</div>
              </div>
              <div>
                <button onClick={() => actOnRequest(r.log_id, "APPROVE")}>
                  Approve
                </button>
                <button className="danger"
                  onClick={() => actOnRequest(r.log_id, "REJECT")}>
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="controls">
        <select onChange={e => setBranchId(e.target.value)}>
          <option value="">All Branches</option>
          {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>

        <select onChange={e => setDepartmentId(e.target.value)}>
          <option value="">All Departments</option>
          {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>

        <input placeholder="Search ID / Name" onChange={e => setSearch(e.target.value)} />
        <input type="month" value={fromMonth} onChange={e => setFromMonth(e.target.value)} />
        <input type="month" value={toMonth} onChange={e => setToMonth(e.target.value)} />
      </div>

      {/* TABLE + PAGINATION remain unchanged */}
    </div>
  );
}
