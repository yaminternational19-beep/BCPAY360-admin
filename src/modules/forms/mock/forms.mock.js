export const mockFormsData = {
    employees: [
        {
            employee_code: "EMP001",
            name: "Praveen Reddy",
            department: "IT",
            branch: "Main Office",
            pfEligible: true,
            esicEligible: true,
            forms: {
                pf: { available: true, updatedAt: "2026-01-10", status: "Available" },
                esic: { available: false, status: "Missing" },
                "income-tax": { available: true, updatedAt: "2025-12-15", status: "Available", year: "2025-26" },
                bonus: { available: true, updatedAt: "2026-01-05", status: "Available" },
                labour: { available: true, updatedAt: "2026-01-12", status: "Available" },
                factories: { available: false, status: "Missing" },
                gratuity: { available: false, status: "Missing" }
            }
        },
        {
            employee_code: "EMP002",
            name: "Anjali Sharma",
            department: "HR",
            branch: "Tech Park",
            pfEligible: true,
            esicEligible: false,
            forms: {
                pf: { available: true, updatedAt: "2026-01-11", status: "Available" },
                "income-tax": { available: false, status: "Missing" },
                bonus: { available: true, updatedAt: "2026-01-06", status: "Available" },
                labour: { available: true, updatedAt: "2026-01-15", status: "Available" }
            }
        },
        {
            employee_code: "EMP003",
            name: "Suresh Kumar",
            department: "Operations",
            branch: "Main Office",
            pfEligible: false,
            esicEligible: true,
            forms: {
                esic: { available: true, updatedAt: "2026-01-12", status: "Available" },
                bonus: { available: false, status: "Missing" },
                labour: { available: false, status: "Missing" }
            }
        },
        {
            employee_code: "EMP004",
            name: "Megha Gupta",
            department: "Finance",
            branch: "Tech Park",
            pfEligible: true,
            esicEligible: true,
            forms: {
                pf: { available: false, status: "Missing" },
                esic: { available: true, updatedAt: "2026-01-14", status: "Available" },
                "income-tax": { available: true, updatedAt: "2025-12-20", status: "Available", year: "2025-26" },
                labour: { available: true, updatedAt: "2026-01-18", status: "Available" }
            }
        },
        {
            employee_code: "EMP005",
            name: "Vikram Singh",
            department: "IT",
            branch: "Main Office",
            pfEligible: true,
            esicEligible: false,
            forms: {
                pf: { available: true, updatedAt: "2026-01-09", status: "Available" },
                "income-tax": { available: true, updatedAt: "2025-12-28", status: "Available", year: "2025-26" },
                bonus: { available: true, updatedAt: "2026-01-10", status: "Available" }
            }
        }
    ],
    branches: ["Main Office", "Tech Park", "Regional Hub"],
    departments: ["IT", "HR", "Operations", "Finance", "Legal"]
};
