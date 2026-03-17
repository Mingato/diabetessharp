import { Link } from "react-router-dom";
import { trpc } from "../trpc";
import { useAuth } from "../hooks/useAuth";
import { getLoginUrl } from "../const";

export function AffiliatePortal() {
  const { data: me, isLoading } = trpc.auth.me.useQuery(undefined, { retry: false });

  const isAffiliate = me?.user?.role === "affiliate";

  if (isLoading) {
    return (
      <div className="container" style={{ maxWidth: "420px", padding: "3rem 1.5rem", textAlign: "center" }}>
        <p style={{ color: "var(--color-text-muted)" }}>Carregando...</p>
      </div>
    );
  }

  if (me?.user && !isAffiliate) {
    return (
      <div className="container" style={{ maxWidth: "480px", padding: "3rem 1.5rem", textAlign: "center" }}>
        <p style={{ color: "var(--color-text-muted)" }}>Esta área é apenas para afiliados. Faça login com uma conta de afiliado.</p>
        <Link to="/" className="btn btn-secondary" style={{ marginTop: "1rem" }}>Voltar ao site</Link>
      </div>
    );
  }

  if (isAffiliate) {
    return <AffiliateDashboard />;
  }

  return (
    <div className="container" style={{ maxWidth: "420px", padding: "3rem 1.5rem" }}>
      <h1 style={{ fontFamily: "var(--font-serif)", marginBottom: "0.5rem" }}>Portal do Afiliado</h1>
      <p style={{ color: "var(--color-text-muted)", marginBottom: "2rem" }}>
        Faça login para acessar o dashboard de afiliados.
      </p>

      <a href={getLoginUrl()} className="btn btn-primary" style={{ width: "100%", display: "block", textAlign: "center" }}>
        Entrar
      </a>

      <p style={{ marginTop: "1.5rem" }}>
        <Link to="/">← Voltar ao site</Link>
      </p>
    </div>
  );
}

function AffiliateDashboard() {
  const { data, isLoading } = trpc.affiliate.getDashboard.useQuery();
  const { data: linkData } = trpc.affiliate.getReferralLink.useQuery();
  const { data: resources } = trpc.affiliate.getResources.useQuery();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="container" style={{ maxWidth: "720px", padding: "2rem 1.5rem 4rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", margin: 0 }}>Dashboard do Afiliado</h1>
        <button type="button" className="btn btn-secondary" onClick={handleLogout}>
          Sair
        </button>
      </div>

      {isLoading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
            <div style={{ padding: "1rem", background: "var(--color-card)", borderRadius: "var(--radius)" }}>
              <div style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>Cliques</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>{data?.totalClicks ?? 0}</div>
            </div>
            <div style={{ padding: "1rem", background: "var(--color-card)", borderRadius: "var(--radius)" }}>
              <div style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>Conversões</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>{data?.conversions ?? 0}</div>
            </div>
            <div style={{ padding: "1rem", background: "var(--color-card)", borderRadius: "var(--radius)" }}>
              <div style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>Comissão</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>${(data?.commissionEarned ?? 0).toFixed(2)}</div>
            </div>
          </section>

          <section style={{ marginBottom: "2rem", padding: "1rem", background: "var(--color-card)", borderRadius: "var(--radius)" }}>
            <h2 style={{ marginBottom: "0.75rem", fontSize: "1rem" }}>Seu link de referência</h2>
            <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>
              Código: <strong>{linkData?.code || "—"}</strong>
            </p>
            <code style={{ display: "block", padding: "0.75rem", background: "var(--color-bg)", borderRadius: "var(--radius)", fontSize: "0.85rem", wordBreak: "break-all" }}>
              {linkData?.link || "https://neurosharp.com/?ref=SEU_CODIGO"}
            </code>
          </section>

          {resources && (
            <section>
              <h2 style={{ marginBottom: "0.75rem", fontSize: "1rem" }}>Recursos</h2>
              <ul style={{ paddingLeft: "1.25rem", color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
                <li><strong>Traffic guide:</strong> TikTok, Meta, Native, Google</li>
                <li><strong>Swipe copy:</strong> emails, anúncios, posts</li>
                <li><strong>Video library:</strong> testemunhais, demos</li>
                <li><strong>Banners:</strong> 300x250, 728x90, 970x250</li>
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}
