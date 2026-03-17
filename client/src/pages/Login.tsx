import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { trpc } from "../trpc";

export function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      if (data.ok && data.user) {
        if (redirectTo?.startsWith("/")) {
          navigate(redirectTo);
        } else if (data.user.role === "admin") {
          navigate("/admin/orders");
        } else if (data.user.role === "affiliate") {
          navigate("/affiliates");
        } else {
          navigate("/app/dashboard");
        }
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate({ email, password });
  };

  return (
    <div className="min-h-screen min-h-[100dvh] app-bg flex items-center justify-center p-4 safe-area-pt" style={{ paddingTop: "max(1rem, var(--safe-top))", paddingBottom: "max(1rem, var(--safe-bottom))" }}>
      <div className="w-full max-w-[400px] animate-in-up">
        <div className="mb-8 text-center">
          <Link to="/home" className="inline-flex items-center gap-3 justify-center mb-4">
            <img src="/diabetessharp-logo.png" alt="DiabetesSharp" className="h-12 w-12 object-contain" />
            <span className="font-display font-bold text-xl text-[var(--color-text)]">DiabetesSharp</span>
          </Link>
          <h1 className="gradient-text text-2xl md:text-3xl font-bold mb-2">Log in</h1>
          <p className="text-[var(--color-text-muted)] text-sm">
            Use the email and password you received after purchase.
          </p>
        </div>

        <div className="glass-card p-6 mb-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Email (login)</label>
              <input
                type="text"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="form-label">Password</label>
              <input
                type="password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className="btn btn-primary w-full py-3.5 rounded-xl min-h-[48px]" disabled={login.isPending}>
              {login.isPending ? "Signing in..." : "Log in"}
            </button>
          </form>

          {login.isSuccess && !login.data?.ok && (
            <p className="text-[var(--color-warning)] text-sm mt-3">{login.data?.error}</p>
          )}
        </div>

        <p className="text-center text-sm text-[var(--color-text-muted)] mt-4">
          <Link to="/" className="hover:text-[var(--color-accent)] transition-colors">Back to home</Link>
        </p>
      </div>
    </div>
  );
}
