export const secureApi = async (path, options = {}) => {
  const token = localStorage.getItem("token");

  console.log("🔍 secureApi called:", path);
  console.log("🔑 token in localStorage:", token);

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  console.log("📤 Request headers:", headers);

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  console.log("📥 Response status:", res.status);

  if (res.status === 401) {
    console.log("❌ 401 from backend – logging out");
    localStorage.removeItem("token");
    localStorage.removeItem("auth_user");
    window.location.href = "/login";
    return;
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "API Error");
  }

  return res.json();
};
