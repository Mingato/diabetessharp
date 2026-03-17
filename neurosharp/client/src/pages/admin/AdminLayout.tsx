import { useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { trpc } from "../../trpc";

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data, isLoading, isError } = trpc.auth.me.useQuery(undefined, { retry: false });

  useEffect(() => {
    if (isLoading) return;
    if (isError || !data?.user) {
      navigate("/login?redirect=" + encodeURIComponent(location.pathname));
      return;
    }
    if (data.user.role !== "admin") {
      navigate("/");
    }
  }, [data, isLoading, isError, navigate, location.pathname]);

  if (isLoading || !data?.user || data.user.role !== "admin") {
    return (
      <div className="container" style={{ padding: "3rem", textAlign: "center" }}>
        Carregando...
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <nav className="admin-nav" style={{ background: "var(--color-card)", borderBottom: "1px solid var(--color-border)", padding: "0.75rem 1.5rem" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <Link to="/admin/orders" style={{ fontWeight: 700 }}>NeuroSharp Admin</Link>
            <Link to="/admin/orders" style={{ color: location.pathname === "/admin/orders" ? "var(--color-accent)" : "var(--color-text-muted)" }}>Pedidos</Link>
            <Link to="/admin/affiliates" style={{ color: location.pathname === "/admin/affiliates" ? "var(--color-accent)" : "var(--color-text-muted)" }}>Afiliados</Link>
            <Link to="/admin/support" style={{ color: location.pathname === "/admin/support" ? "var(--color-accent)" : "var(--color-text-muted)" }}>Suporte</Link>
            <Link to="/admin/settings" style={{ color: location.pathname === "/admin/settings" ? "var(--color-accent)" : "var(--color-text-muted)" }}>Configurações</Link>
          </div>
          <Link to="/">Sair do admin</Link>
        </div>
      </nav>
      <main className="container" style={{ padding: "2rem 1.5rem 4rem" }}>
        <Outlet />
      </main>
    </div>
  );
}
