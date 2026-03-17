import { useState } from "react";
import { trpc } from "../../trpc";

export function AdminSupport() {
  const { data, isLoading } = trpc.admin.getSupportTickets.useQuery();
  const updateStatus = trpc.admin.updateSupportStatus.useMutation({
    onSuccess: () => window.location.reload(),
  });
  const [statusFilter, setStatusFilter] = useState<string>("");

  const tickets = data?.tickets ?? [];
  const filtered = statusFilter ? tickets.filter((t: { status: string }) => t.status === statusFilter) : tickets;

  return (
    <>
      <h1 style={{ fontFamily: "var(--font-serif)", marginBottom: "0.5rem" }}>Suporte</h1>
      <p style={{ color: "var(--color-text-muted)", marginBottom: "1rem" }}>
        Tickets de contato. Filtro:{" "}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: "0.35rem", borderRadius: "var(--radius)", border: "1px solid var(--color-border)", background: "var(--color-bg)", color: "var(--color-text)" }}
        >
          <option value="">Todos</option>
          <option value="open">Abertos</option>
          <option value="replied">Respondidos</option>
          <option value="resolved">Resolvidos</option>
        </select>
      </p>

      {isLoading ? (
        <p>Carregando...</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: "var(--color-text-muted)" }}>Nenhum ticket.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {filtered.map((t: { id: number; name: string; email: string; category: string; subject: string; message: string; status: string; created_at: string }) => (
            <div
              key={t.id}
              style={{
                padding: "1rem",
                background: "var(--color-card)",
                borderRadius: "var(--radius)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                <div>
                  <strong>{t.name}</strong> — {t.email} · {t.category}
                  {t.subject && ` · ${t.subject}`}
                </div>
                <select
                  value={t.status}
                  onChange={(e) => updateStatus.mutate({ id: t.id, status: e.target.value as "open" | "replied" | "resolved" })}
                  style={{ padding: "0.35rem", borderRadius: "var(--radius)", border: "1px solid var(--color-border)", background: "var(--color-bg)", color: "var(--color-text)" }}
                >
                  <option value="open">Aberto</option>
                  <option value="replied">Respondido</option>
                  <option value="resolved">Resolvido</option>
                </select>
              </div>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--color-text-muted)", whiteSpace: "pre-wrap" }}>{t.message}</p>
              <p style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>{new Date(t.created_at).toLocaleString("pt-BR")}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
