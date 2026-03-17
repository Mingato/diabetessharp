import { useState } from "react";
import { trpc } from "../../trpc";

export function AdminOrders() {
  const { data, isLoading } = trpc.admin.getOrders.useQuery();
  const createTest = trpc.admin.createTestOrder.useMutation({
    onSuccess: () => window.location.reload(),
  });

  const [testEmail, setTestEmail] = useState("");
  const [testFirstName, setTestFirstName] = useState("");
  const [testLastName, setTestLastName] = useState("");

  return (
    <>
      <h1 style={{ fontFamily: "var(--font-serif)", marginBottom: "0.5rem" }}>Pedidos</h1>
      <p style={{ color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
        Lista dos últimos pedidos do funil.
      </p>

      <section style={{ marginBottom: "2rem", padding: "1rem", background: "var(--color-card)", borderRadius: "var(--radius)" }}>
        <h2 style={{ marginBottom: "0.75rem", fontSize: "1rem" }}>Criar pedido de teste</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createTest.mutate({ email: testEmail, firstName: testFirstName, lastName: testLastName });
          }}
          style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "flex-end" }}
        >
          <div>
            <label className="form-label">Email</label>
            <input type="email" required value={testEmail} onChange={(e) => setTestEmail(e.target.value)} style={{ padding: "0.5rem", borderRadius: "var(--radius)", border: "1px solid var(--color-border)", background: "var(--color-bg)", color: "var(--color-text)" }} />
          </div>
          <div>
            <label className="form-label">Nome</label>
            <input type="text" required value={testFirstName} onChange={(e) => setTestFirstName(e.target.value)} style={{ padding: "0.5rem", borderRadius: "var(--radius)", border: "1px solid var(--color-border)", background: "var(--color-bg)", color: "var(--color-text)" }} />
          </div>
          <div>
            <label className="form-label">Sobrenome</label>
            <input type="text" required value={testLastName} onChange={(e) => setTestLastName(e.target.value)} style={{ padding: "0.5rem", borderRadius: "var(--radius)", border: "1px solid var(--color-border)", background: "var(--color-bg)", color: "var(--color-text)" }} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={createTest.isPending}>
            {createTest.isPending ? "Criando..." : "Criar pedido teste"}
          </button>
        </form>
        {createTest.data?.credentials && (
          <p style={{ marginTop: "0.75rem", fontSize: "0.9rem", color: "var(--color-success)" }}>
            Credenciais: {createTest.data.credentials.email} / {createTest.data.credentials.password}
          </p>
        )}
      </section>

      {isLoading ? (
        <p>Carregando pedidos...</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                <th style={{ textAlign: "left", padding: "0.75rem" }}>ID</th>
                <th style={{ textAlign: "left", padding: "0.75rem" }}>Nome</th>
                <th style={{ textAlign: "left", padding: "0.75rem" }}>Email</th>
                <th style={{ textAlign: "left", padding: "0.75rem" }}>Status</th>
                <th style={{ textAlign: "left", padding: "0.75rem" }}>Valor</th>
                <th style={{ textAlign: "left", padding: "0.75rem" }}>Data</th>
              </tr>
            </thead>
            <tbody>
              {data?.orders?.map((o: { id: number; firstName: string; lastName: string; email: string; status: string; amountPaid: number; created_at: string }) => (
                <tr key={o.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <td style={{ padding: "0.75rem" }}>{o.id}</td>
                  <td style={{ padding: "0.75rem" }}>{o.firstName} {o.lastName}</td>
                  <td style={{ padding: "0.75rem" }}>{o.email}</td>
                  <td style={{ padding: "0.75rem" }}>{o.status}</td>
                  <td style={{ padding: "0.75rem" }}>{(o.amountPaid / 100).toFixed(2)}</td>
                  <td style={{ padding: "0.75rem" }}>{new Date(o.created_at).toLocaleDateString("pt-BR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
