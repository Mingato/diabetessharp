import { useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { trpc } from "../trpc";

export function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderIdParam = searchParams.get("order");
  const orderId = orderIdParam ? Number(orderIdParam) : NaN;
  const validOrderId = !!orderIdParam && !isNaN(orderId);

  const utils = trpc.useUtils();
  const confirmPayment = trpc.funnel.confirmCarpandaPayment.useMutation({
    onSuccess: (_, variables) => {
      utils.funnel.getOrderCredentials.invalidate({ orderId: variables.orderId });
    },
  });
  const { data } = trpc.funnel.getOrderCredentials.useQuery(
    { orderId },
    { enabled: validOrderId }
  );

  useEffect(() => {
    if (validOrderId && orderId > 0) {
      confirmPayment.mutate({ orderId });
    }
  }, [orderId, validOrderId]);

  const credentials =
    (confirmPayment.data?.credentials?.login && confirmPayment.data?.credentials?.password
      ? confirmPayment.data.credentials
      : null) ?? data?.credentials ?? null;
  const login = trpc.auth.login.useMutation({
    onSuccess: (res) => {
      if (res.ok && res.token) {
        localStorage.setItem("neurosharp_token", res.token);
        navigate("/app/dashboard");
      }
    },
  });

  const handleAccess = () => {
    if (credentials?.login && credentials?.password) {
      login.mutate({ email: credentials.login, password: credentials.password });
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="container" style={{ maxWidth: "560px", padding: "3rem 1.5rem", textAlign: "center" }}>
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✓</div>
      <h1 style={{ fontFamily: "var(--font-serif)", marginBottom: "0.5rem" }}>Congratulations!</h1>
      <p style={{ color: "var(--color-text-muted)", marginBottom: "2rem" }}>
        Your order is confirmed. We&apos;ve sent your login and instructions to your email. Your 90-day cognitive recovery starts now.
      </p>

      {credentials && (
        <div style={{ background: "var(--color-card)", padding: "1.5rem", borderRadius: "var(--radius)", marginBottom: "2rem", textAlign: "left" }}>
          <h3 style={{ marginBottom: "0.75rem" }}>Your access credentials</h3>
          <p style={{ margin: "0.25rem 0" }}><strong>Email (login):</strong> {credentials.login}</p>
          <p style={{ margin: "0.25rem 0" }}><strong>Password:</strong> {credentials.password}</p>
          <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", marginTop: "0.75rem" }}>
            Save this information. You can also use the link in your welcome email to access the platform.
          </p>
        </div>
      )}

      <button type="button" className="btn btn-primary" onClick={handleAccess} disabled={login.isPending || !credentials}>
        {login.isPending ? "Signing in..." : "Access My Program"}
      </button>
      {!credentials && (
        <p style={{ marginTop: "0.75rem" }}>
          <Link to="/login">Already have an account? Log in here</Link>
        </p>
      )}

      <div style={{ marginTop: "2rem", textAlign: "left" }}>
        <h3 style={{ marginBottom: "0.5rem" }}>Next steps</h3>
        <ul style={{ color: "var(--color-text-muted)", paddingLeft: "1.25rem" }}>
          <li>Log in to the app with the credentials above</li>
          <li>Complete your first cognitive exercise today</li>
          <li>Meet Dr. Marcus and Sofia on your dashboard</li>
        </ul>
      </div>
    </div>
  );
}
