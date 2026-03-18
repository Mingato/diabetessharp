/**
 * Token Refresh Utility
 *
 * Handles access token renewal by calling the server-side refresh endpoint.
 * Uses credentials: "include" to send refresh token cookie.
 */

let refreshPromise: Promise<boolean> | null = null;

export async function refreshAccessToken(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = performRefresh();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

async function performRefresh(): Promise<boolean> {
  try {
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
