import { Link } from "react-router-dom";

export function RefundPolicy() {
  return (
    <div className="container" style={{ maxWidth: "720px", padding: "3rem 1.5rem 4rem" }}>
      <h1 style={{ fontFamily: "var(--font-serif)", marginBottom: "1rem" }}>Garantia de 7 Dias</h1>
      <p style={{ color: "var(--color-text-muted)", marginBottom: "2rem" }}>Última atualização: Março de 2025</p>

      <section style={{ marginBottom: "2rem" }}>
        <p>Se você não estiver satisfeito com o programa NeuroSharp, oferecemos reembolso integral dentro de 7 dias a partir da primeira compra. Entre em contato pelo formulário de <Link to="/contact">Contato</Link> com seu e-mail e número do pedido para solicitar o reembolso.</p>
      </section>

      <Link to="/">← Voltar</Link>
    </div>
  );
}
