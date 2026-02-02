import React, { useEffect, useState } from "react";
import "../../../styles/Shifts.css";
import ShiftList from "./ShiftList";
import ShiftForm from "./ShiftForm";
import {
  getBranches,
  getShifts,
  createShift,
  updateShift,
  deleteShift as apiDeleteShift,
  toggleShiftStatus,
} from "../../../api/master.api";


export default function Shift({ user }) {
  const isAdmin = user?.role === "COMPANY_ADMIN";
  const isHR = user?.role === "HR";

  const canCreate = isAdmin;
  const canEdit = isAdmin || isHR;
  const canDelete = isAdmin;

  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [shifts, setShifts] = useState([]);
  const [mode, setMode] = useState('list');
  const [currentShift, setCurrentShift] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadBranches = async () => {
    try {
      const data = await getBranches();
      setBranches(data || []);
    } catch (error) {
      alert("Failed to load branches: " + error.message);
    }
  };

  const loadShifts = async (branchId) => {
    if (!branchId) {
      setShifts([]);
      return;
    }
    try {
      const data = await getShifts(branchId);
      setShifts(Array.isArray(data) ? data : []);
    } catch (error) {
      setShifts([]);
    }
  };

  useEffect(() => {
    loadBranches();
  }, []);

  useEffect(() => {
    loadShifts(selectedBranch);
  }, [selectedBranch]);

  const handleCreateShift = async (shiftData) => {
    if (!canCreate || !shiftData.shift_name.trim() || !shiftData.start_time || !shiftData.end_time || !selectedBranch) return;

    setLoading(true);
    try {
      await createShift({
        shift_name: shiftData.shift_name.trim(),
        start_time: shiftData.start_time,
        end_time: shiftData.end_time,
        description: shiftData.description || null,
        branch_id: Number(selectedBranch),
      });
      loadShifts(selectedBranch);
    } catch (error) {
      if (error.message && error.message.includes("already exists")) {
        alert(error.message);
      } else {
        alert("Failed to create shift: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateShift = async (id, shiftData) => {
    if (!canEdit) return;

    setLoading(true);
    try {
      await updateShift(id, {
        shift_name: shiftData.shift_name.trim(),
        start_time: shiftData.start_time,
        end_time: shiftData.end_time,
        description: shiftData.description || null,
      });
      loadShifts(selectedBranch);
    } catch (error) {
      if (error.message && error.message.includes("already exists")) {
        alert(error.message);
      } else {
        alert("Failed to update shift: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteShift = async (id) => {
    if (!canDelete) return;
    if (!confirm("Delete this shift?")) return;

    try {
      await apiDeleteShift(id);
      loadShifts(selectedBranch);
    } catch (error) {
      alert("Failed to delete shift: " + error.message);
    }
  };

  const handleToggleStatus = async (shift) => {
    try {
      await toggleShiftStatus(shift.id);
      loadShifts(selectedBranch);
    } catch (error) {
      alert("Failed to update status: " + error.message);
    }
  };

  const onAdd = () => {
    setMode('form');
    setCurrentShift(null);
  };

  const onEdit = (shift) => {
    setMode('form');
    setCurrentShift(shift);
  };

  const onSave = async (shiftData) => {
    if (currentShift) {
      await handleUpdateShift(currentShift.id, shiftData);
    } else {
      await handleCreateShift(shiftData);
    }
    setMode('list');
    setCurrentShift(null);
  };

  const onCancel = () => {
    setMode('list');
    setCurrentShift(null);
  };

  const onBranchChange = (branchId) => {
    setSelectedBranch(branchId);
  };

  return (
    <div className="shifts-page">
      {mode === 'list' ? (
        <ShiftList
          branches={branches}
          selectedBranch={selectedBranch}
          onBranchChange={onBranchChange}
          shifts={shifts}
          onAdd={onAdd}
          onEdit={onEdit}
          onDelete={handleDeleteShift}
          onToggleStatus={handleToggleStatus}
          user={user}
        />
      ) : (
        <ShiftForm
          onSave={onSave}
          onCancel={onCancel}
          initialData={currentShift}
          selectedBranch={selectedBranch}
          user={user}
          loading={loading}
        />
      )}
    </div>
  );
}