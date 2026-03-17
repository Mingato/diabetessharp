import { useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { trpc } from "../trpc";

const DEMO_TOKEN = "demo";

/**
 * Wraps /app routes: requires auth, redirects to /login if not authenticated.
 * If no token or token is "demo", never calls the API — app works offline / without backend.
 */
export function AppAuthGuard() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = typeof window !== "undefined" ? localStorage.getItem("neurosharp_token") : null;
  const isDemo = token === DEMO_TOKEN;
  const hasNoToken = !token || token === "";

  const { isLoading, isError } = trpc.auth.me.useQuery(undefined, {
    retry: false,
    enabled: !hasNoToken && !isDemo,
  });

  useEffect(() => {
    if (hasNoToken) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`, { replace: true });
      return;
    }
    if (isDemo) return;
    if (!isLoading && isError) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`, { replace: true });
    }
  }, [hasNoToken, isDemo, isLoading, isError, navigate, location.pathname]);

  if (hasNoToken) {
    return (
      <div className="app-layout" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <p style={{ color: "var(--color-text-muted)" }}>Redirecting to login...</p>
      </div>
    );
  }
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
