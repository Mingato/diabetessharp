import { useSearchParams, Link } from "react-router-dom";

export function UpsellSkip() {
  return (
    <div className="container" style={{ maxWidth: "560px", padding: "3rem 1.5rem", textAlign: "center" }}>
      <h1 style={{ fontFamily: "var(--font-serif)", marginBottom: "0.5rem" }}>All set</h1>
      <p style={{ color: "var(--color-text-muted)", marginBottom: "2rem" }}>
        You can add upgrades later from your dashboard.
      </p>
      <Link to="/app/dashboard" className="btn btn-primary">
        Go to Dashboard
      </Link>
    </div>
  );
}
