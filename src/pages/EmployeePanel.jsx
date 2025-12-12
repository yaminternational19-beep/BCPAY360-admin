import React, { useMemo, useState } from "react";
import "../styles/EmployeePanel.css";
import { makeEmployees } from "../utils/mockData";
import EmployeeList from "../components/EmployeeList";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeFilters from "../components/EmployeeFilters";

// initial dummy data
const initialEmployees = makeEmployees(1000);

const EmployeePanel = () => {
  const [employees, setEmployees] = useState(initialEmployees);
  const [selected, setSelected] = useState(null); // for edit / view
  const [showForm, setShowForm] = useState(false);

  // create or update employee
  const handleSave = (emp) => {
    if (emp.id) {
      setEmployees(prev => prev.map(p => p.id === emp.id ? {...p, ...emp} : p));
    } else {
      const newId = employees.length ? Math.max(...employees.map(e=>e.id)) + 1 : 1;
      setEmployees(prev => [{...emp, id: newId, active: true}, ...prev]);
    }
    setShowForm(false);
    setSelected(null);
  };

  const handleEdit = (id) => {
    const e = employees.find(x=>x.id===id);
    if (e) {
      setSelected(e);
      setShowForm(true);
    }
  };

  const handleDeactivate = (id) => {
    setEmployees(prev => prev.map(p => p.id === id ? {...p, active: false} : p));
  };

  const handleActivate = (id) => {
    setEmployees(prev => prev.map(p => p.id === id ? {...p, active: true} : p));
  };

  const handleBulkUploadDocs = (id, docs) => {
    setEmployees(prev => prev.map(p => p.id === id ? {...p, docs: {...p.docs, ...docs}} : p));
  };

  // derived counts
  const stats = useMemo(()=>({
    total: employees.length,
    active: employees.filter(e=>e.active).length,
    inactive: employees.filter(e=>!e.active).length
  }), [employees]);

  return (
    <div className="employee-panel">
      <div className="employee-header">
        <h2>Employee Management</h2>
        <div className="header-actions">
          <button className="btn" onClick={()=>{ setSelected(null); setShowForm(true); }}>Add Employee</button>
          <div className="stat-mini">
            <span>Total</span><strong>{stats.total}</strong>
          </div>
          <div className="stat-mini">
            <span>Active</span><strong>{stats.active}</strong>
          </div>
          <div className="stat-mini">
            <span>Inactive</span><strong>{stats.inactive}</strong>
          </div>
        </div>
      </div>

      <div className="employee-body">
        <EmployeeFilters />
        <EmployeeList
          employees={employees}
          onEdit={handleEdit}
          onDeactivate={handleDeactivate}
          onActivate={handleActivate}
          onSaveDocs={handleBulkUploadDocs}
          onDelete={(id)=> setEmployees(prev => prev.filter(p => p.id !== id))}
          onSave={handleSave}
        />
      </div>

      { showForm && (
        <EmployeeForm
          initial={selected}
          onClose={() => { setShowForm(false); setSelected(null); }}
          onSave={handleSave}
        />
      ) }
    </div>
  );
};

export default EmployeePanel;
