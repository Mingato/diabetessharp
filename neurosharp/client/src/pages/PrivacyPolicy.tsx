import { Link } from "react-router-dom";

export function PrivacyPolicy() {
  return (
    <div className="container" style={{ maxWidth: "720px", padding: "3rem 1.5rem 4rem" }}>
      <h1 style={{ fontFamily: "var(--font-serif)", marginBottom: "1rem" }}>Política de Privacidade</h1>
      <p style={{ color: "var(--color-text-muted)", marginBottom: "2rem" }}>Última atualização: Março de 2025</p>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ marginBottom: "0.75rem" }}>1. Dados que coletamos</h2>
        <p>Coletamos nome, e-mail, telefone e dados de uso do programa (scores cognitivos, exercícios realizados) para fornecer o serviço e melhorar sua experiência.</p>
      </section>
      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ marginBottom: "0.75rem" }}>2. Uso dos dados</h2>
        <p>Seus dados são usados para entrega do programa NeuroSharp, personalização de exercícios, suporte e comunicações transacionais. Dados de saúde cognitiva são tratados com cuidado e não vendidos a terceiros.</p>
      </section>
      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ marginBottom: "0.75rem" }}>3. Segurança e conformidade</h2>
        <p>Implementamos criptografia em trânsito e em repouso. Respeitamos GDPR e CCPA onde aplicável e consideramos boas práticas para dados de saúde.</p>
      </section>
      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ marginBottom: "0.75rem" }}>4. Contato</h2>
        <p>Para dúvidas ou pedidos de exclusão de dados, use a página de <Link to="/contact">Contato</Link>.</p>
      </section>

      <Link to="/">← Voltar</Link>
    </div>
  );
}
