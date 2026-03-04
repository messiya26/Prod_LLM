const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://prod-llm.onrender.com/api/v1";
export const API_HOST = API_BASE.replace("/api/v1", "");

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("lla_token");
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));
    throw new ApiError(res.status, body.message || res.statusText);
  }

  if (res.status === 204) return null as T;
  return res.json();
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, data?: unknown) =>
    request<T>(endpoint, { method: "POST", body: data ? JSON.stringify(data) : undefined }),
  put: <T>(endpoint: string, data?: unknown) =>
    request<T>(endpoint, { method: "PUT", body: data ? JSON.stringify(data) : undefined }),
  patch: <T>(endpoint: string, data?: unknown) =>
    request<T>(endpoint, { method: "PATCH", body: data ? JSON.stringify(data) : undefined }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: "DELETE" }),
  upload: async <T>(endpoint: string, formData: FormData): Promise<T> => {
    const token = getToken();
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}${endpoint}`, { method: "POST", headers, body: formData, credentials: "include" });
    if (!res.ok) { const body = await res.json().catch(() => ({ message: res.statusText })); throw new ApiError(res.status, body.message || res.statusText); }
    return res.json();
  },
};

export { ApiError };
export default api;
