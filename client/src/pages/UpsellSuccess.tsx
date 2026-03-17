import { useSearchParams, Link } from "react-router-dom";

export function UpsellSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order");
  const upsell = searchParams.get("upsell");

  const labels: Record<string, string> = {
    upsell1: "Dr. James 24/7 Medical AI",
    upsell2: "Sofia Memory Companion",
    upsell3: "Advanced Brain Health Protocols",
  };

  return (
    <div className="container" style={{ maxWidth: "560px", padding: "3rem 1.5rem", textAlign: "center" }}>
      <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>✓</div>
      <h1 style={{ fontFamily: "var(--font-serif)" }}>Thank you!</h1>
      <p style={{ color: "var(--color-text-muted)", marginTop: "0.5rem", marginBottom: "2rem" }}>
        You added {upsell ? labels[upsell] ?? "the product" : "the product"} to your program.
      </p>
      <Link to="/app/dashboard" className="btn btn-primary">
        Go to Dashboard
      </Link>
    </div>
  );
}
