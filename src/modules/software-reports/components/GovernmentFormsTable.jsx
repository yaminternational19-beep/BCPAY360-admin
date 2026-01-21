
import React, { useState } from "react";
import GovernmentFormModal from "./GovernmentFormModal";
// Removed downloadCompanyGovernmentForm as it does not exist in the new master.api.js

const GovernmentFormsTable = ({
  data = [],
  loading = false,
  error = null,
  onRefresh,
  onView,
  onDownload,
  onUpload,
  onReplace,
  onDelete,
  onToggle,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const filteredData = data.filter((item) => {
    const documentName = item.form_name || item.documentName || "";
    const formCode = item.form_code || "";
    const searchLower = searchTerm.toLowerCase();
    return (
      documentName.toLowerCase().includes(searchLower) ||
      formCode.toLowerCase().includes(searchLower)
    );
  });

  const handleAddNew = () => {
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (id) => {
    setEditingId(id);
    setIsModalOpen(true);
  };

  const handleSave = async (formData) => {
    setModalLoading(true);
    try {
      if (editingId !== null) {
        // Replace existing form
        const success = await onReplace(editingId, formData);
        if (success) {
          setIsModalOpen(false);
        }
      } else {
        // Upload new form
        const success = await onUpload(formData);
        if (success) {
          setIsModalOpen(false);
        }
      }
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = (id) => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete this form? This action cannot be undone."
      )
    ) {
      onDelete(id);
    }
  };

  const handleRefresh = () => {
    setSearchTerm("");
    if (onRefresh) {
      onRefresh();
    }
  };

  const editingData = editingId ? data.find((item) => item.id === editingId) : null;

  // Display error state
  if (error) {
    return (
      <div className="sr-page">
        <div className="sr-header">
          <h1>Government Forms</h1>
          <p>Manage government compliance forms and documents</p>
        </div>
        <div className="sr-content">
          <div className="sr-empty-state" style={{ color: "#d32f2f" }}>
            <p>⚠️ Error loading forms</p>
            <p className="empty-subtitle">{error}</p>
            <button className="btn-primary" onClick={handleRefresh}>
              🔄 Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sr-page">
      <div className="sr-header">
        <h1>Government Forms</h1>
        <p>Manage government compliance forms and documents</p>
      </div>

      <div className="sr-content">
        {/* Top Bar Controls */}
        <div className="forms-toolbar">
          <div className="toolbar-left">
            <input
              type="text"
              className="search-input"
              placeholder="🔍 Search by document name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="toolbar-right">
            <button
              className="btn-secondary"
              onClick={handleRefresh}
              title="Refresh"
              disabled={loading}
            >
              {loading ? "⏳ Loading..." : "🔄 Refresh"}
            </button>
            <button
              className="btn-primary"
              onClick={handleAddNew}
              disabled={loading}
            >
              ➕ Add New Form
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="sr-table-container">
          {loading ? (
            <div className="sr-empty-state">
              <p>⏳ Loading forms...</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="sr-empty-state">
              <p>📄 No forms found</p>
              <p className="empty-subtitle">
                {searchTerm
                  ? "Try adjusting your search"
                  : "Click 'Add New Form' to get started"}
              </p>
            </div>
          ) : (
            <table className="sr-table">
              <thead>
                <tr>
                  <th>SL No</th>
                  <th>Document Name</th>
                  <th>PDF File Name</th>
                  <th>Version</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.form_name || item.documentName}</td>
                    <td className="filename">{item.original_file_name || item.file_name || item.fileName || "N/A"}</td>
                    <td>{item.version}</td>
                    <td>
                      <span
                        className={`status-badge ${(item.status || "active").toLowerCase()}`}
                      >
                        {item.status || "Active"}
                      </span>
                    </td>
                    <td>
                      <div className="actions-group">
                        <button
                          className="action-btn preview"
                          onClick={() => onView && onView(item.id)}
                          title="View"
                        >
                          👁
                        </button>
                        <button
                          className="action-btn download"
                          onClick={() => onDownload && onDownload(item.id)}
                          title="Download (New Tab)"
                        >
                          ⬇
                        </button>
                        <button
                          className="action-btn replace"
                          onClick={() => handleEdit(item.id)}
                          title="Replace"
                        >
                          🔄
                        </button>
                        <button
                          className="action-btn toggle"
                          onClick={() => onToggle && onToggle(item.id)}
                          title={item.status === "ACTIVE" ? "Deactivate" : "Activate"}
                        >
                          {item.status === "ACTIVE" ? "🚫" : "✅"}
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => handleDelete(item.id)}
                          title="Delete"
                          disabled={item.status === "ACTIVE"}
                          style={{ opacity: item.status === "ACTIVE" ? 0.5 : 1, cursor: item.status === "ACTIVE" ? "not-allowed" : "pointer" }}
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Summary */}
          {!loading && filteredData.length > 0 && (
            <div className="sr-summary">
              <p>
                Total Forms: <strong>{filteredData.length}</strong>
              </p>
              <p>
                Active:
                <strong>
                  {filteredData.filter((d) => d.status === "Active").length}
                </strong>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Upload/Replace Modal */}
      <GovernmentFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editData={editingData}
        loading={modalLoading}
      />
    </div>
  );
};

export default GovernmentFormsTable;