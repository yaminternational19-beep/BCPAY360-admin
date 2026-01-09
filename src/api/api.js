import { API_BASE } from "../utils/apiBase";

export { API_BASE };


export const api = async (path, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // ✅ HANDLE QUERY PARAMS
  let url = `${API_BASE}${path}`;
  if (options.params) {
    const query = new URLSearchParams(options.params).toString();
    url += `?${query}`;
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (res.status === 204 || res.status === 304) {
    return null;
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "API Error");
  }

  return res.json();
};
