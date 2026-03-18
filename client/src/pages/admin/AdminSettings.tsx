import { trpc } from "../../trpc";

export function AdminSettings() {
  return (
    <>
      <h1 style={{ fontFamily: "var(--font-serif)", marginBottom: "0.5rem" }}>Configurações</h1>
      <p style={{ color: "var(--color-text-muted)", marginBottom: "2rem" }}>
        Links Cartpanda e webhook. Edite <code style={{ background: "var(--color-card)", padding: "0.2rem 0.4rem", borderRadius: 4 }}>shared/carpanda.ts</code> para alterar os URLs de checkout.
      </p>

      <section style={{ marginBottom: "2rem", padding: "1.25rem", background: "var(--color-card)", borderRadius: "var(--radius)", border: "1px solid var(--color-border)" }}>
        <h2 style={{ marginBottom: "0.75rem", fontSize: "1rem" }}>Webhook Cartpanda</h2>
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>
          Configure no Cartpanda o webhook de pagamento aprovado para:
        </p>
        <code style={{ display: "block", padding: "0.75rem", background: "var(--color-bg)", borderRadius: "var(--radius)", fontSize: "0.85rem", wordBreak: "break-all" }}>
          POST {typeof window !== "undefined" ? window.location.origin : "https://neurosharp.com"}/api/cartpanda-webhook
        </code>
        <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginTop: "0.75rem" }}>
          Corpo esperado: <code>{"{ \"orderId\": 123 }"}</code> ou <code>{"{ \"order_id\": 123 }"}</code>. O backend cria o usuário e marca o pedido como pago.
        </p>
      </section>

      <section style={{ padding: "1.25rem", background: "var(--color-card)", borderRadius: "var(--radius)", border: "1px solid var(--color-border)" }}>
        <h2 style={{ marginBottom: "0.75rem", fontSize: "1rem" }}>Redirects no Cartpanda</h2>
        <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
          <li>Sucesso (principal): <code>/checkout/success?order={"{ORDER_ID}"}</code></li>
          <li>Upsell sucesso: <code>/checkout/upsell-success?order={"{ORDER_ID}"}&amp;upsell=upsell1</code> (upsell2, upsell3)</li>
          <li>Upsell skip: <code>/checkout/upsell-skip?order={"{ORDER_ID}"}&amp;upsell=upsell1</code></li>
        </ul>
      </section>
    </>
  );
}
