import React, { useMemo, useState } from "react";
import "../styles/AssetManagement.css";
import { makeEmployees } from "../utils/employeeGenerator";
import { makeAssets } from "../utils/assetGenerator";

/* ===============================
   HELPERS
================================ */
const nowIso = () => new Date().toISOString();

/* ===============================
   COMPONENT
================================ */
export default function AssetManagement() {
  /* -----------------------------
     AUTH
  ----------------------------- */
  const user = JSON.parse(localStorage.getItem("auth_user")) || {};
  const isAdmin = user.role === "COMPANY_ADMIN";
  const isHR = user.role === "HR";

  if (!isAdmin && !isHR) {
    return (
      <div className="am-root">
        <h2>Access Restricted</h2>
        <p>You don’t have permission to access Asset Management.</p>
      </div>
    );
  }

  /* -----------------------------
     EMPLOYEES (SOURCE OF TRUTH)
  ----------------------------- */
  const allEmployees = useMemo(() => makeEmployees(200), []);

  const employees = useMemo(() => {
    if (isAdmin) return allEmployees;
    return allEmployees.filter(
      (e) => e.department === user.department
    );
  }, [allEmployees, isAdmin, user.department]);

  /* -----------------------------
     ASSETS (GENERATED FROM EMPLOYEES)
  ----------------------------- */
  const initialAssets = useMemo(
    () => makeAssets(allEmployees, 80),
    [allEmployees]
  );

  const [assets, setAssets] = useState(initialAssets);

  /* -----------------------------
     HR / ADMIN VISIBILITY
  ----------------------------- */
  const visibleAssets = useMemo(() => {
    if (isAdmin) return assets;
    return assets.filter(
      (a) => a.department === user.department
    );
  }, [assets, isAdmin, user.department]);

  /* -----------------------------
     UI STATE
  ----------------------------- */
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [assign, setAssign] = useState({
    assetId: "",
    emp_id: "",
  });

  /* -----------------------------
     FILTERED ASSETS
  ----------------------------- */
  const filteredAssets = useMemo(() => {
    const q = search.toLowerCase().trim();

    return visibleAssets.filter((a) => {
      if (statusFilter !== "All" && a.status !== statusFilter) return false;
      if (!q) return true;

      return (
        a.id.toLowerCase().includes(q) ||
        a.tag.toLowerCase().includes(q) ||
        a.type.toLowerCase().includes(q)
      );
    });
  }, [visibleAssets, search, statusFilter]);

  /* -----------------------------
     ASSIGN ASSET
  ----------------------------- */
  function assignAsset() {
    if (!assign.assetId || !assign.emp_id) return;

    const emp = employees.find((e) => e.id === assign.emp_id);
    if (!emp) return;

    setAssets((prev) =>
      prev.map((a) =>
        a.id !== assign.assetId
          ? a
          : {
              ...a,
              assignedTo: emp.id,
              department: emp.department,
              status: "Assigned",
              history: [
                {
                  at: nowIso(),
                  action: "Assigned",
                  to: emp.id,
                  by: user.role,
                },
                ...a.history,
              ],
            }
      )
    );

    setAssign({ assetId: "", emp_id: "" });
  }

  /* -----------------------------
     RETURN ASSET
  ----------------------------- */
  function returnAsset(assetId) {
    setAssets((prev) =>
      prev.map((a) =>
        a.id !== assetId
          ? a
          : {
              ...a,
              assignedTo: null,
              department: null,
              status: "Returned",
              history: [
                { at: nowIso(), action: "Returned", by: user.role },
                ...a.history,
              ],
            }
      )
    );
  }

  /* -----------------------------
     DELETE ASSET (ADMIN ONLY)
  ----------------------------- */
  function deleteAsset(assetId) {
    if (!isAdmin) return;
    if (!window.confirm("Delete this asset permanently?")) return;
    setAssets((prev) => prev.filter((a) => a.id !== assetId));
  }

  /* ===============================
     UI
  =============================== */
  return (
    <div className="am-root">
      <header className="am-header">
        <h1>Asset Management</h1>
        <p>
          {isAdmin
            ? "Admin — All departments"
            : `HR — ${user.department} department`}
        </p>
      </header>

      {/* FILTERS */}
      <section className="card">
        <div className="am-tools">
          <input
            placeholder="Search asset ID / tag / type"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All</option>
            <option>Available</option>
            <option>Assigned</option>
            <option>Returned</option>
          </select>
        </div>

        {/* ASSET LIST */}
        <div className="asset-list">
          {filteredAssets.length === 0 && (
            <div className="empty">No assets found</div>
          )}

          {filteredAssets.map((a) => (
            <div className="asset-row" key={a.id}>
              <div>
                <b>{a.type}</b> — {a.tag}
                <div className="muted">
                  ID: {a.id} • Status: {a.status}
                </div>
                {a.assignedTo && (
                  <div className="muted">
                    Assigned to: {a.assignedTo}
                  </div>
                )}
              </div>

              <div className="asset-actions">
                {a.status !== "Assigned" ? (
                  <>
                    <select
                      value={assign.assetId === a.id ? assign.emp_id : ""}
                      onChange={(e) =>
                        setAssign({
                          assetId: a.id,
                          emp_id: e.target.value,
                        })
                      }
                    >
                      <option value="">Assign to</option>
                      {employees.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.name} — {e.department}
                        </option>
                      ))}
                    </select>

                    {assign.assetId === a.id && (
                      <button className="btn-sm" onClick={assignAsset}>
                        Confirm
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    className="btn-sm"
                    onClick={() => returnAsset(a.id)}
                  >
                    Return
                  </button>
                )}

                {isAdmin && (
                  <button
                    className="btn-sm danger"
                    onClick={() => deleteAsset(a.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
