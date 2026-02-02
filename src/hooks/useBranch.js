import { useState, useEffect } from "react";
import { getBranches } from "../api/master.api";

export function useBranch() {
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState("");
    const [isSingleBranch, setIsSingleBranch] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [branchStatus, setBranchStatus] = useState("LOADING"); // LOADING | NO_BRANCH | SINGLE | MULTIPLE
    const [canProceed, setCanProceed] = useState(false);

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                setIsLoading(true);
                setBranchStatus("LOADING");
                const res = await getBranches();
                const branchList = res?.data || res || [];
                setBranches(branchList);

                if (branchList.length === 0) {
                    // ZERO BRANCHES
                    setBranchStatus("NO_BRANCH");
                    setIsSingleBranch(false);
                    setSelectedBranch("");
                    setCanProceed(false);
                    localStorage.removeItem("selected_branch");

                } else if (branchList.length === 1) {
                    // SINGLE BRANCH
                    const singleId = branchList[0].id;
                    setBranchStatus("SINGLE");
                    setIsSingleBranch(true);
                    setSelectedBranch(singleId);
                    setCanProceed(true);
                    localStorage.setItem("selected_branch", singleId);

                } else {
                    // MULTIPLE BRANCHES
                    setBranchStatus("MULTIPLE");
                    setIsSingleBranch(false);
                    setCanProceed(true);

                    const savedBranch = localStorage.getItem("selected_branch");
                    if (savedBranch && branchList.find(b => b.id === savedBranch)) {
                        setSelectedBranch(savedBranch);
                    } else {
                        // For multiple, we might want to force selection or default to first
                        // For now, keeping it empty if no persistent selection
                    }
                }
            } catch (err) {
                // silenced
                setBranchStatus("ERROR");
                setCanProceed(false);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBranches();
    }, []);

    const changeBranch = (branchId) => {
        if (!branches.find(b => b.id === branchId)) return;
        setSelectedBranch(branchId);
        localStorage.setItem("selected_branch", branchId);
    };

    return {
        branches,
        selectedBranch,
        changeBranch,
        isSingleBranch,
        isLoading,
        branchStatus,
        canProceed
    };
}
