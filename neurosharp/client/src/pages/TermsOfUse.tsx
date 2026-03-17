import { Link } from "react-router-dom";

export function TermsOfUse() {
  return (
    <div className="container" style={{ maxWidth: "720px", padding: "3rem 1.5rem 4rem" }}>
      <h1 style={{ fontFamily: "var(--font-serif)", marginBottom: "1rem" }}>Termos de Uso</h1>
      <p style={{ color: "var(--color-text-muted)", marginBottom: "2rem" }}>Última atualização: Março de 2025</p>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ marginBottom: "0.75rem" }}>1. Aceitação</h2>
        <p>Ao usar o site e o programa NeuroSharp, você concorda com estes termos.</p>
      </section>
      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ marginBottom: "0.75rem" }}>2. Serviço</h2>
        <p>NeuroSharp é um programa de exercícios cognitivos e educação em neurociência. Não substitui diagnóstico médico nem tratamento. Consulte um profissional de saúde para condições específicas.</p>
      </section>
      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ marginBottom: "0.75rem" }}>3. Assinatura e pagamento</h2>
        <p>A assinatura é mensal ($29.99/mês) e renovada automaticamente até cancelamento. O pagamento é processado pelo Cartpanda. Consulte a <Link to="/refund-policy">Política de Reembolso</Link>.</p>
      </section>

      <Link to="/">← Voltar</Link>
    </div>
  );
}
