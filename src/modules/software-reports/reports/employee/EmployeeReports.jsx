import React, { useEffect, useState } from "react";
import { listEmployees, getEmployeeDocuments } from "../../../../api/employees.api.js";

const EmployeeReports = () => {
  const [filters, setFilters] = useState({
    search: "",
    branch_id: "",
    department_id: "",
    status: "",
  });

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);

  const [documents, setDocuments] = useState({});
  const [selectedDocs, setSelectedDocs] = useState([]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await listEmployees(filters);
      setEmployees(res.data || res); // backend dependent
      setShowTable(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async (employee_code) => {
    if (documents[employee_code]) return;
    const res = await getEmployeeDocuments(employee_code);
    setDocuments(prev => ({
      ...prev,
      [employee_code]: res.data || []
    }));
  };

  const toggleDocSelection = (doc) => {
    setSelectedDocs(prev =>
      prev.includes(doc)
        ? prev.filter(d => d !== doc)
        : [...prev, doc]
    );
  };

  const downloadSelected = () => {
    selectedDocs.forEach(doc => {
      window.open(doc.file_url, "_blank");
    });
  };

  return (
    <div className="sr-page">
      <h1>Employee Reports</h1>

      {/* FILTERS */}
      <div className="sr-filters">
        <input
          name="search"
          placeholder="Search employee"
          onChange={handleFilterChange}
        />

        <select name="status" onChange={handleFilterChange}>
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>

        <button onClick={fetchEmployees}>
          🔍 Apply Filters
        </button>
      </div>

      {/* TABLE */}
      {showTable && (
        <table className="sr-table">
          <thead>
            <tr>
              <th>Emp Code</th>
              <th>Name</th>
              <th>Branch</th>
              <th>Department</th>
              <th>Status</th>
              <th>Documents</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id}>
                <td>{emp.employee_code}</td>
                <td>{emp.full_name}</td>
                <td>{emp.branch_name}</td>
                <td>{emp.department_name}</td>
                <td>{emp.employee_status}</td>

                {/* DOCUMENTS */}
                <td
                  onMouseEnter={() => fetchDocuments(emp.employee_code)}
                  className="doc-cell"
                >
                  View Docs
                  <div className="doc-hover">
                    {(documents[emp.employee_code] || []).map(doc => (
                      <div key={doc.id} className="doc-item">
                        <input
                          type="checkbox"
                          onChange={() => toggleDocSelection(doc)}
                        />
                        <span>{doc.document_name}</span>

                        {/* PREVIEW */}
                        {doc.file_type.startsWith("image") && (
                          <img
                            src={doc.file_url}
                            alt=""
                            className="doc-preview"
                          />
                        )}

                        <button onClick={() => window.open(doc.file_url)}>
                          👁 View
                        </button>
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* EXPORT */}
      {selectedDocs.length > 0 && (
        <button onClick={downloadSelected}>
          ⬇ Download Selected Files
        </button>
      )}

      {loading && <p>Loading...</p>}
    </div>
  );
};

export default EmployeeReports;
