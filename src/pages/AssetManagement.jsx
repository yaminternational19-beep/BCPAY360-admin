import React, { useState, useMemo } from "react";
import "../styles/AssetManagement.css";

function nowIso() {
  return new Date().toISOString();
}

export default function AssetManagement() {
  // Sample employees (replace with real data / API)
  const [employees] = useState([
    { id: 1, name: "Asha Patel", code: "E112" },
    { id: 2, name: "Rohit Sharma", code: "E207" },
    { id: 3, name: "Neha Rao", code: "E315" },
  ]);

  // Asset catalogue and instances
  const [catalog, setCatalog] = useState([
    { id: "cat-1", type: "Laptop", model: "Dell XPS 13" },
    { id: "cat-2", type: "Mobile", model: "Pixel 6" },
    { id: "cat-3", type: "SIM", model: "Vodafone 4G" },
    { id: "cat-4", type: "ID Card", model: "Staff ID" },
  ]);

  // Individual physical assets (unique tags)
  const [assets, setAssets] = useState([
    {
      id: "A-1001",
      catalogId: "cat-1",
      tag: "DL-1001",
      assignedTo: 1,
      status: "Assigned",
      assignedAt: "2025-06-01T09:00:00.000Z",
      history: [{ at: "2025-06-01T09:00:00.000Z", by: "Admin", action: "Assigned", to: 1 }],
    },
    {
      id: "A-1002",
      catalogId: "cat-2",
      tag: "MB-201",
      assignedTo: null,
      status: "Available",
      assignedAt: null,
      history: [{ at: nowIso(), by: "System", action: "Created" }],
    },
  ]);

  // UI state
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [newAsset, setNewAsset] = useState({ catalogId: "", tag: "" });
  const [assignState, setAssignState] = useState({ assetId: "", empId: "" });

  // Derived lists
  const catalogMap = useMemo(() => Object.fromEntries(catalog.map(c => [c.id, c])), [catalog]);
  const filteredAssets = useMemo(() => {
    const q = search.trim().toLowerCase();
    return assets.filter(a => {
      if (filterStatus !== "All" && a.status !== filterStatus) return false;
      if (!q) return true;
      const cat = catalogMap[a.catalogId] || {};
      return (
        (a.id && a.id.toLowerCase().includes(q)) ||
        (a.tag && a.tag.toLowerCase().includes(q)) ||
        (cat.type && cat.type.toLowerCase().includes(q)) ||
        (cat.model && cat.model.toLowerCase().includes(q))
      );
    });
  }, [assets, search, filterStatus, catalogMap]);

  // Create a new physical asset
  function createAsset(e) {
    e && e.preventDefault();
    if (!newAsset.catalogId || !newAsset.tag) return;
    const id = `A-${Date.now()}`;
    const created = {
      id,
      catalogId: newAsset.catalogId,
      tag: newAsset.tag.trim(),
      assignedTo: null,
      status: "Available",
      assignedAt: null,
      history: [{ at: nowIso(), by: "Admin", action: "Created" }],
    };
    setAssets(prev => [created, ...prev]);
    setNewAsset({ catalogId: "", tag: "" });
  }

  // Assign an asset to an employee
  function assignAsset(e) {
    e && e.preventDefault();
    const { assetId, empId } = assignState;
    if (!assetId || !empId) return;

    setAssets(prev => prev.map(a => {
      if (a.id !== assetId) return a;
      const updated = {
        ...a,
        assignedTo: Number(empId),
        status: "Assigned",
        assignedAt: nowIso(),
        history: [{ at: nowIso(), by: "Admin", action: "Assigned", to: Number(empId) }, ...(a.history || [])],
      };
      return updated;
    }));

    setAssignState({ assetId: "", empId: "" });
  }

  // Mark returned
  function markReturned(assetId) {
    setAssets(prev => prev.map(a => {
      if (a.id !== assetId) return a;
      const updated = {
        ...a,
        assignedTo: null,
        status: "Returned",
        assignedAt: null,
        history: [{ at: nowIso(), by: "Admin", action: "Returned" }, ...(a.history || [])],
      };
      return updated;
    }));
  }

  // Quick helper: get employee display
  function empLabel(empId) {
    const e = employees.find(x => x.id === empId);
    return e ? `${e.name} (${e.code})` : "—";
  }

  // Delete asset (soft removal from list)
  function removeAsset(assetId) {
    if (!confirm("Permanently delete this asset?")) return;
    setAssets(prev => prev.filter(a => a.id !== assetId));
  }

  // Add new catalog type
  function addCatalogType(type, model) {
    if (!type || !model) return;
    const id = `cat-${Date.now()}`;
    setCatalog(prev => [...prev, { id, type, model }]);
  }

  return (
    <div className="am-root">
      <header className="am-header">
        <h1>Asset Management</h1>
        <p className="am-sub">Assign assets, record returns, and track usage history</p>
      </header>

      <div className="am-grid">
        {/* Left: Create / Assign */}
        <div className="card am-col">
          <h2>Create Asset</h2>
          <form className="am-form" onSubmit={createAsset}>
            <label>
              Catalog
              <select value={newAsset.catalogId} onChange={e => setNewAsset({...newAsset, catalogId: e.target.value})}>
                <option value="">Select catalog</option>
                {catalog.map(c => <option key={c.id} value={c.id}>{c.type} — {c.model}</option>)}
              </select>
            </label>

            <label>
              Asset Tag (unique)
              <input value={newAsset.tag} onChange={e => setNewAsset({...newAsset, tag: e.target.value})} placeholder="e.g. DL-2002" />
            </label>

            <div className="am-actions">
              <button className="btn-primary" type="submit">Create Asset</button>
              <button type="button" className="btn-ghost" onClick={() => {
                const type = prompt("New catalog type (e.g. Tablet):");
                const model = type ? prompt("Model / details:") : "";
                if (type && model) addCatalogType(type.trim(), model.trim());
              }}>Add Catalog</button>
            </div>
          </form>

          <hr />

          <h2>Assign / Return</h2>
          <form className="am-form" onSubmit={assignAsset}>
            <label>
              Asset
              <select value={assignState.assetId} onChange={e => setAssignState({...assignState, assetId: e.target.value})}>
                <option value="">Select asset</option>
                {assets.map(a => {
                  const c = catalogMap[a.catalogId] || {};
                  return <option key={a.id} value={a.id}>{a.id} — {a.tag} ({c.type || 'Unknown'}) — {a.status}</option>;
                })}
              </select>
            </label>

            <label>
              Assign To (Employee)
              <select value={assignState.empId} onChange={e => setAssignState({...assignState, empId: e.target.value})}>
                <option value="">Select employee</option>
                {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name} — {emp.code}</option>)}
              </select>
            </label>

            <div className="am-actions">
              <button className="btn-primary" type="submit">Assign</button>
              <button type="button" className="btn-ghost" onClick={() => {
                if (!assignState.assetId) return alert("Select an asset first");
                markReturned(assignState.assetId);
                setAssignState({ assetId: "", empId: "" });
              }}>Mark Returned</button>
            </div>
          </form>
        </div>

        {/* Right: Asset list & history */}
        <div className="card am-col">
          <div className="am-tools">
            <input placeholder="Search assets, tags, model..." value={search} onChange={e => setSearch(e.target.value)} />
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option>All</option>
              <option>Available</option>
              <option>Assigned</option>
              <option>Returned</option>
            </select>
          </div>

          <div className="asset-list">
            {filteredAssets.length === 0 && <div className="empty">No assets found</div>}
            {filteredAssets.map(a => {
              const cat = catalogMap[a.catalogId] || {};
              return (
                <div key={a.id} className="asset-row">
                  <div className="asset-main">
                    <div className="asset-title">{cat.type || "---"} <span className="tag">{a.tag}</span></div>
                    <div className="asset-meta">{cat.model || "Unknown model"} • <span className={`status ${a.status.toLowerCase()}`}>{a.status}</span></div>
                    <div className="asset-sub">ID: {a.id} • Assigned to: {a.assignedTo ? empLabel(a.assignedTo) : '—'}</div>
                  </div>

                  <div className="asset-actions">
                    <button className="btn-sm" title="View history" onClick={() => {
                      const rows = (a.history || []).map(h => `${new Date(h.at).toLocaleString()} — ${h.action}${h.to ? ' → ' + empLabel(h.to) : ''} by ${h.by}`).join("\\n");
                      alert(rows || "No history");
                    }}>History</button>

                    {a.status === "Assigned" ? (
                      <button className="btn-sm danger" onClick={() => markReturned(a.id)}>Return</button>
                    ) : (
                      <button className="btn-sm" onClick={() => setAssignState({...assignState, assetId: a.id})}>Assign</button>
                    )}

                    <button className="btn-sm ghost" onClick={() => removeAsset(a.id)}>Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom: compact history timeline */}
      <section className="card am-history">
        <h3>Recent Activity</h3>
        <div className="timeline">
          {assets
            .flatMap(a => (a.history || []).map(h => ({ asset: a, event: h })))
            .sort((x, y) => new Date(y.event.at) - new Date(x.event.at))
            .slice(0, 12)
            .map((itm, idx) => (
              <div className="timeline-item" key={idx}>
                <div className="t-left">{new Date(itm.event.at).toLocaleString()}</div>
                <div className="t-right">
                  <b>{itm.event.action}</b> — {catalogMap[itm.asset.catalogId]?.type || 'Asset'} {itm.asset.tag} {itm.event.to ? `→ ${empLabel(itm.event.to)}` : ''} <span className="muted">by {itm.event.by}</span>
                </div>
              </div>
            ))
          }
          {assets.flatMap(a => a.history || []).length === 0 && <div className="empty">No activity yet</div>}
        </div>
      </section>
    </div>
  );
}
