import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { TRPCClientError } from "@trpc/client";
import { useAuth } from "../hooks/useAuth";
import { getLoginUrl } from "../const";

/**
 * Wraps /app routes: requires auth, redirects to HWS Auth login if not authenticated.
 * Quando auth.me retorna 401, o handleUnauthorizedError (main.tsx) tenta refresh e redireciona.
 * Evitamos redirect duplicado aqui quando já há erro 401.
 */
export function AppAuthGuard() {
  const { isAuthenticated, loading, error } = useAuth();

  useEffect(() => {
    if (loading) return;
    // 401 é tratado pelo handleUnauthorizedError (refresh + redirect) — evita loop
    if (error instanceof TRPCClientError && error.data?.code === "UNAUTHORIZED") return;
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [isAuthenticated, loading, error]);

  if (loading) {
    return (
      <div className="app-layout" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <p style={{ color: "var(--color-text-muted)" }}>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="app-layout" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <p style={{ color: "var(--color-text-muted)" }}>Redirecting to login...</p>
      </div>
    );
  }

  return <Outlet />;
}
