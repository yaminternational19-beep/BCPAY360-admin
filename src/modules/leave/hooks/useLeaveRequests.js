import { useEffect, useState, useCallback } from "react";
import {
  getPendingLeaveRequests,
  approveLeaveRequest,
  rejectLeaveRequest,
  getLeaveHistory
} from "../../../api/master.api.js";

export default function useLeaveRequests() {
  const [requests, setRequests] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPending = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getPendingLeaveRequests();
      if (res?.success) {
        setRequests(res.data);
      } else {
        setError(res.message || "Failed to load pending requests");
      }
    } catch (err) {
      setError("Failed to load pending requests");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getLeaveHistory();
      if (res?.success) {
        setHistory(res.data);
      } else {
        setError(res.message || "Failed to load leave history");
      }
    } catch (err) {
      setError("Failed to load leave history");
    } finally {
      setLoading(false);
    }
  }, []);

  const approve = useCallback(async (id) => {
    try {
      const res = await approveLeaveRequest(id);
      if (res.success) {
        await fetchPending();
        await fetchHistory();
      } else {
        setError(res.message || "Failed to approve request");
      }
      return res;
    } catch (err) {
      setError("Failed to approve request");
    }
  }, [fetchPending, fetchHistory]);

  const reject = useCallback(async (id, remarks) => {
    try {
      const res = await rejectLeaveRequest(id, remarks);
      if (res.success) {
        await fetchPending();
        await fetchHistory();
      } else {
        setError(res.message || "Failed to reject request");
      }
      return res;
    } catch (err) {
      setError("Failed to reject request");
    }
  }, [fetchPending, fetchHistory]);

  return {
    requests,
    history,
    loading,
    error,
    approve,
    reject,
    fetchPending,
    fetchHistory
  };
}
