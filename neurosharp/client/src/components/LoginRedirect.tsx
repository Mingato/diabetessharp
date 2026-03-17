import { useEffect } from "react";
import { getLoginUrl } from "../const";

/**
 * Redirects to HWS Auth login. Used for /login route.
 */
export function LoginRedirect() {
  useEffect(() => {
    window.location.href = getLoginUrl();
  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center app-bg">
      <p className="text-[var(--color-text-muted)]">Redirecting to login...</p>
    </div>
  );
}
