import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getLoginUrl } from "../const";

/**
 * Wraps /app routes: requires auth, redirects to HWS Auth login if not authenticated.
 */
export function AppAuthGuard() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [isAuthenticated, loading]);

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
