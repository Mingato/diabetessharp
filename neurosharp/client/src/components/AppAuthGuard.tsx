import { useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { trpc } from "../trpc";

const DEMO_TOKEN = "demo";

/**
 * Wraps /app routes: requires auth, redirects to /login if not authenticated.
 * If token is "demo", allows access without calling the API (no server needed).
 */
export function AppAuthGuard() {
  const navigate = useNavigate();
  const location = useLocation();
  const isDemo = typeof window !== "undefined" && localStorage.getItem("neurosharp_token") === DEMO_TOKEN;
  const { isLoading, isError } = trpc.auth.me.useQuery(undefined, { retry: false, enabled: !isDemo });

  useEffect(() => {
    if (isDemo) return;
    if (!isLoading && isError) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`, { replace: true });
    }
  }, [isDemo, isLoading, isError, navigate, location.pathname]);

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
