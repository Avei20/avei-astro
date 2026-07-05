// Shared API fetch wrapper for browser islands.
// Replaces the old Nuxt `useFetchApi` composable. Used by the feedback form
// (home page) and the chat demo. Backend base URL defaults to the production
// Nest API and can be overridden via PUBLIC_API in .env.

const API_BASE = (import.meta.env.PUBLIC_API || "https://nest.avei.ovh").replace(/\/$/, "");

export interface ApiError extends Error {
  status?: number;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  // Backend returns JSON on both success and error ({ message: string }).
  const data = (await res.json().catch(() => ({}))) as { message?: string };

  if (!res.ok) {
    const err = new Error(data.message || `Request failed: ${res.status}`) as ApiError;
    err.status = res.status;
    throw err;
  }

  return data as T;
}
