import { useState } from "react";
import { trpc } from "../../trpc";

export function AdminAffiliates() {
  const { data, isLoading } = trpc.admin.getAffiliateStats.useQuery();
  const createAffiliate = trpc.admin.createAffiliate.useMutation({
    onSuccess: () => window.location.reload(),
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  return (
    <>
      <h1 style={{ fontFamily: "var(--font-serif)", marginBottom: "0.5rem" }}>Afiliados</h1>
      <p style={{ color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
        Comissões totais: ${(data?.totalCommissions ?? 0).toFixed(2)}
      </p>

      <section style={{ marginBottom: "2rem", padding: "1rem", background: "var(--color-card)", borderRadius: "var(--radius)" }}>
        <h2 style={{ marginBottom: "0.75rem", fontSize: "1rem" }}>Novo afiliado</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createAffiliate.mutate({ name, email, password, code });
          }}
          style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "flex-end" }}
        >
          <div>
            <label className="form-label">Nome</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} style={{ padding: "0.5rem", borderRadius: "var(--radius)", border: "1px solid var(--color-border)", background: "var(--color-bg)", color: "var(--color-text)" }} />
          </div>
          <div>
            <label className="form-label">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: "0.5rem", borderRadius: "var(--radius)", border: "1px solid var(--color-border)", background: "var(--color-bg)", color: "var(--color-text)" }} />
          </div>
          <div>
            <label className="form-label">Senha</label>
            <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: "0.5rem", borderRadius: "var(--radius)", border: "1px solid var(--color-border)", background: "var(--color-bg)", color: "var(--color-text)" }} />
          </div>
          <div>
            <label className="form-label">Código</label>
            <input type="text" required value={code} onChange={(e) => setCode(e.target.value)} placeholder="JOHN_001" style={{ padding: "0.5rem", borderRadius: "var(--radius)", border: "1px solid var(--color-border)", background: "var(--color-bg)", color: "var(--color-text)" }} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={createAffiliate.isPending}>
            {createAffiliate.isPending ? "Criando..." : "Criar afiliado"}
          </button>
        </form>
      </section>

      <h2 style={{ fontSize: "1rem", marginBottom: "0.75rem" }}>Top performadores</h2>
      {isLoading ? (
        <p>Carregando...</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                <th style={{ textAlign: "left", padding: "0.75rem" }}>Nome</th>
                <th style={{ textAlign: "left", padding: "0.75rem" }}>Código</th>
                <th style={{ textAlign: "left", padding: "0.75rem" }}>Conversões</th>
                <th style={{ textAlign: "left", padding: "0.75rem" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {data?.topPerformers?.map((a: { name: string; code: string; conversions: string; total: string | null }, i: number) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <td style={{ padding: "0.75rem" }}>{a.name}</td>
                  <td style={{ padding: "0.75rem" }}>{a.code}</td>
                  <td style={{ padding: "0.75rem" }}>{a.conversions}</td>
                  <td style={{ padding: "0.75rem" }}>${Number(a.total ?? 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 style={{ fontSize: "1rem", marginTop: "2rem", marginBottom: "0.75rem" }}>Todos os afiliados</h2>
      {data?.affiliates?.length ? (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
              <th style={{ textAlign: "left", padding: "0.75rem" }}>Email</th>
              <th style={{ textAlign: "left", padding: "0.75rem" }}>Código</th>
              <th style={{ textAlign: "left", padding: "0.75rem" }}>Tier</th>
              <th style={{ textAlign: "left", padding: "0.75rem" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.affiliates.map((a: { email: string; code: string; tier: number; status: string }) => (
              <tr key={a.email} style={{ borderBottom: "1px solid var(--color-border)" }}>
                <td style={{ padding: "0.75rem" }}>{a.email}</td>
                <td style={{ padding: "0.75rem" }}>{a.code}</td>
                <td style={{ padding: "0.75rem" }}>{a.tier}</td>
                <td style={{ padding: "0.75rem" }}>{a.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ color: "var(--color-text-muted)" }}>Nenhum afiliado cadastrado.</p>
      )}
    </>
  );
}
