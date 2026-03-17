import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { trpc } from "../trpc";
import { getLoginUrl } from "../const";

const DEMO_TOKEN = "demo";

/**
 * Wraps /app routes: requires auth, redirects to HWS Auth login if not authenticated.
 * If token is "demo", allows access without calling the API (no server needed).
 */
export function AppAuthGuard() {
  const isDemo = typeof window !== "undefined" && localStorage.getItem("neurosharp_token") === DEMO_TOKEN;
  const { isLoading, isError } = trpc.auth.me.useQuery(undefined, { retry: false, enabled: !isDemo });

  useEffect(() => {
    if (isDemo) return;
    if (!isLoading && isError) {
      window.location.href = getLoginUrl();
    }
  }, [isDemo, isLoading, isError]);

  if (isDemo) return <Outlet />;
  if (isLoading) {
    return (
      <div className="app-layout" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <p style={{ color: "var(--color-text-muted)" }}>Loading...</p>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="app-layout" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <p style={{ color: "var(--color-text-muted)" }}>Redirecting to login...</p>
      </div>
    );
  }
  return <Outlet />;
}
