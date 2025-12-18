// Central source for API base URL used by the frontend
// Set VITE_API_BASE_URL in your .env file (e.g. VITE_API_BASE_URL=http://localhost:5000)
export const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
