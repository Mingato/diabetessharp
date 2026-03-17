import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { trpc } from "../trpc";

export function AffiliatePortal() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { data: me } = trpc.auth.me.useQuery(undefined, { retry: false });
  const login = trpc.auth.login.useMutation({
    onSuccess: (d) => {
      if (d.ok && d.token) {
        localStorage.setItem("neurosharp_token", d.token);
        window.location.reload();
      }
    },
  });

  const isAffiliate = me?.user?.role === "affiliate";

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
        Entre com o e-mail e senha fornecidos ao cadastrar como afiliado.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          login.mutate({ email, password });
        }}
      >
        <div style={{ marginBottom: "1rem" }}>
          <label className="form-label">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "0.75rem", borderRadius: "var(--radius)", border: "1px solid var(--color-border)", background: "var(--color-bg)", color: "var(--color-text)" }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label className="form-label">Senha</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "0.75rem", borderRadius: "var(--radius)", border: "1px solid var(--color-border)", background: "var(--color-bg)", color: "var(--color-text)" }}
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={login.isPending}>
          {login.isPending ? "Entrando..." : "Entrar"}
        </button>
      </form>

      {login.isSuccess && !login.data.ok && (
        <p style={{ color: "var(--color-warning)", marginTop: "1rem" }}>{login.data.error}</p>
      )}

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

  const handleLogout = () => {
    localStorage.removeItem("neurosharp_token");
    window.location.href = "/affiliates";
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
