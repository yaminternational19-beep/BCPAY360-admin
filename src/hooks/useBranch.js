import { useState, useEffect } from "react";
import { getBranches } from "../api/master.api";

export function useBranch() {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null); // null = ALL
  const [isSingleBranch, setIsSingleBranch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [branchStatus, setBranchStatus] = useState("LOADING"); 
  // LOADING | NO_BRANCH | SINGLE | MULTIPLE | ERROR

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setIsLoading(true);
        setBranchStatus("LOADING");

        const res = await getBranches();
        const branchList = res?.data || [];

        setBranches(branchList);

        // 🚫 NO BRANCH
        if (branchList.length === 0) {
          setBranchStatus("NO_BRANCH");
          setSelectedBranch(null);
          setIsSingleBranch(false);
          localStorage.removeItem("selected_branch");
          return;
        }

        // ✅ SINGLE BRANCH → auto select
        if (branchList.length === 1) {
          const id = branchList[0].id;
          setBranchStatus("SINGLE");
          setSelectedBranch(id);
          setIsSingleBranch(true);
          localStorage.setItem("selected_branch", String(id));
          return;
        }

        // 🔀 MULTIPLE BRANCHES
        setBranchStatus("MULTIPLE");
        setIsSingleBranch(false);

        const saved = localStorage.getItem("selected_branch");
        const savedId = saved ? Number(saved) : null;

        if (savedId && branchList.some(b => b.id === savedId)) {
          setSelectedBranch(savedId);
        } else {
          // DEFAULT → ALL BRANCHES
          setSelectedBranch(null);
          localStorage.removeItem("selected_branch");
        }

      } catch (err) {
        console.error("Branch fetch failed", err);
        setBranchStatus("ERROR");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBranches();
  }, []);

  const changeBranch = (branchId) => {
    // null = ALL branches
    if (branchId === null) {
      setSelectedBranch(null);
      localStorage.removeItem("selected_branch");
      return;
    }

    const id = Number(branchId);
    if (!branches.some(b => b.id === id)) return;

    setSelectedBranch(id);
    localStorage.setItem("selected_branch", String(id));
  };

  return {
    branches,
    selectedBranch,   // number | null
    changeBranch,
    isSingleBranch,
    isLoading,
    branchStatus
  };
}
