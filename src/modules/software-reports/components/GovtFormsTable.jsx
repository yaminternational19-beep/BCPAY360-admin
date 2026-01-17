import React, { useState } from "react";
import GovtFormModal from "./GovtFormModal";

const GovtFormsTable = ({ category, initialData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const filteredData = data.filter((item) =>
    item.documentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNew = () => {
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (id) => {
    setEditingId(id);
    setIsModalOpen(true);
  };

  const handleSave = (formData) => {
    if (editingId !== null) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                ...formData,
                updatedAt: new Date().toLocaleDateString(),
              }
            : item
        )
      );
    } else {
      const newForm = {
        id: Math.max(...data.map((d) => d.id), 0) + 1,
        ...formData,
        createdAt: new Date().toLocaleDateString(),
      };
      setData((prev) => [...prev, newForm]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this form?")) {
      setData((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handlePreview = (fileName) => {
    alert(`Preview: ${fileName}\n\n(PDF preview would open in modal)`);
  };

  const handleDownload = (fileName) => {
    alert(`Downloading: ${fileName}`);
  };

  const handleRefresh = () => {
    setSearchTerm("");
  };

  const editingData = editingId
    ? data.find((item) => item.id === editingId)
    : null;

  return (
    <div className="sr-page">
      <div className="sr-header">
        <h1>{category} Forms</h1>
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
            />
          </div>

          <div className="toolbar-right">
            <button
              className="btn-secondary"
              onClick={handleRefresh}
              title="Refresh"
            >
              🔄 Refresh
            </button>
            <button
              className="btn-primary"
              onClick={handleAddNew}
            >
              ➕ Add New Form
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="sr-table-container">
          {filteredData.length === 0 ? (
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
                    <td>{item.documentName}</td>
                    <td className="filename">{item.fileName}</td>
                    <td>{item.version}</td>
                    <td>
                      <span
                        className={`status-badge ${item.status.toLowerCase()}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <div className="actions-group">
                        <button
                          className="action-btn preview"
                          onClick={() => handlePreview(item.fileName)}
                          title="Preview PDF"
                        >
                          👁
                        </button>
                        <button
                          className="action-btn download"
                          onClick={() => handleDownload(item.fileName)}
                          title="Download PDF"
                        >
                          ⬇
                        </button>
                        <button
                          className="action-btn replace"
                          onClick={() => handleEdit(item.id)}
                          title="Replace File"
                        >
                          🔄
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => handleDelete(item.id)}
                          title="Delete"
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
          {filteredData.length > 0 && (
            <div className="sr-summary">
              <p>Total Forms: <strong>{filteredData.length}</strong></p>
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

      {/* Modal */}
      <GovtFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editData={editingData}
      />
    </div>
  );
};

export default GovtFormsTable;
