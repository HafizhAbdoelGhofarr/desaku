/**
 * REST API Client for Sistem Desa Ku Backend (FastAPI)
 * Connects Next.js Frontend with FastAPI Backend (http://localhost:8000)
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Helper for HTTP requests
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // Auto attach JWT token from localStorage if present
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("sdk_auth_token");
    if (token && !headers.has("Authorization") && !token.startsWith("mock-")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(errorBody.detail || `HTTP Error ${response.status}`);
    }

    return await response.json();
  } catch (err: unknown) {
    // Graceful error logging
    const message = err instanceof Error ? err.message : "Network error";
    console.warn(`[API Client Warning] Failed connecting to ${url}: ${message}`);
    throw err;
  }
}

// API Services
export const api = {
  // 1. Auth Services
  auth: {
    login: async (username: string, password: string): Promise<{ access_token: string; token_type: string }> => {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      return request("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });
    },

    getMe: async (): Promise<{
      id: number;
      username: string;
      email: string;
      role: string;
      village_id?: number;
    }> => {
      return request("/auth/me");
    },
  },

  // 2. Villages Services
  villages: {
    getAll: async (): Promise<Array<{
      id: number;
      name: string;
      kecamatan: string;
      kabupaten: string;
      provinsi: string;
      population?: number;
      latitude?: number;
      longitude?: number;
    }>> => {
      return request("/villages");
    },

    getById: async (id: number) => {
      return request(`/villages/${id}`);
    },

    getScores: async (id: number) => {
      return request(`/villages/${id}/scores`);
    },
  },

  // 3. Indicators & Indicator Values Services
  indicators: {
    getAll: async (): Promise<Array<{
      id: number;
      kategori: string;
      name: string;
      unit?: string;
      description?: string;
    }>> => {
      return request("/indicators");
    },

    getValues: async (params?: { status?: string; village_id?: number }) => {
      const query = new URLSearchParams();
      if (params?.status) query.append("status", params.status);
      if (params?.village_id) query.append("village_id", String(params.village_id));
      const qs = query.toString() ? `?${query.toString()}` : "";
      return request(`/indicator-values${qs}`);
    },

    submitValue: async (data: {
      indicator_id: number;
      nilai: number;
      periode?: string;
      village_id?: number;
      submitted_name?: string;
      catatan?: string;
    }) => {
      return request("/indicator-values", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    updateValue: async (
      id: number,
      data: {
        nilai?: number;
        catatan?: string;
        periode?: string;
      }
    ) => {
      return request(`/indicator-values/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },

    deleteValue: async (id: number) => {
      return request(`/indicator-values/${id}`, {
        method: "DELETE",
      });
    },

    verifyValue: async (
      id: number,
      data: {
        status: "verified" | "rejected";
        catatan?: string;
      }
    ) => {
      return request(`/indicator-values/${id}/verify`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
  },

  // 4. Reports / Aspirasi Warga Services
  reports: {
    getAll: async (params?: { village_id?: number; cat_id?: number }) => {
      const query = new URLSearchParams();
      if (params?.village_id) query.append("village_id", String(params.village_id));
      if (params?.cat_id) query.append("cat_id", String(params.cat_id));
      const qs = query.toString() ? `?${query.toString()}` : "";
      return request(`/reports${qs}`);
    },

    create: async (data: {
      village_id?: number;
      village_name: string;
      kecamatan: string;
      cat_id: number;
      title: string;
      description: string;
      location: string;
      author: string;
      status?: string;
    }) => {
      return request("/reports", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    upvote: async (id: number) => {
      return request(`/reports/${id}/upvote`, {
        method: "PATCH",
      });
    },

    respond: async (id: number, data: { status?: string; response_note?: string }) => {
      return request(`/reports/${id}/respond`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },

    delete: async (id: number) => {
      return request(`/reports/${id}`, {
        method: "DELETE",
      });
    },
  },

  // 5. Simulation Services
  simulation: {
    simulate: async (data: {
      village_id: number;
      periode: string;
      overrides: Array<{ indicator_id: number; nilai: number }>;
    }) => {
      return request("/simulate", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
  },

  // 6. Health Check
  health: async (): Promise<{ message: string }> => {
    return request("/");
  },
};

