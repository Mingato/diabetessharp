/**
 * Static preview of the quiz results + checkout page.
 * Link: /quiz-checkout-preview (always light background, no theme)
 * Uses position:fixed to override app's dark body background.
 */
export function QuizCheckoutPreview() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        overflow: "auto",
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #eff6ff, #e0e7ff)",
        padding: "2rem 1rem",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <div style={{ maxWidth: "42rem", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              display: "inline-block",
              background: "#fff",
              borderRadius: "9999px",
              padding: "1rem",
              marginBottom: "1rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <span style={{ fontSize: "3rem" }}>🧠</span>
          </div>
          <h1 style={{ fontSize: "1.875rem", fontWeight: 700, margin: "0 0 0.5rem 0", color: "#111827" }}>
            Your Cognitive Profile
          </h1>
          <p style={{ color: "#6b7280", fontSize: "0.875rem", margin: 0 }}>
            Personalized analysis by Dr. Marcus · Checkout
          </p>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: "1rem",
            padding: "1.5rem 2rem",
            marginBottom: "1.25rem",
            boxShadow: "0 4px 6px rgba(0,0,0,0.07)",
            border: "1px solid #e5e7eb",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <div style={{ fontSize: "3rem", fontWeight: 700, color: "#2563eb", margin: "0 0 0.5rem 0" }}>
              38
            </div>
            <p style={{ color: "#6b7280", fontSize: "0.875rem", margin: 0 }}>
              Your Cognitive Score (0-100)
            </p>
          </div>
          <div
            style={{
              height: 12,
              background: "#e5e7eb",
              borderRadius: 9999,
              overflow: "hidden",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                height: "100%",
                background: "#ef4444",
                borderRadius: 9999,
                width: "38%",
              }}
            />
          </div>
          <div
            style={{
              background: "#fef2f2",
              borderLeft: "4px solid #ef4444",
              padding: "1rem",
              borderRadius: "0.5rem",
            }}
          >
            <h3 style={{ fontWeight: 700, color: "#b91c1c", margin: "0 0 0.25rem 0" }}>High Risk</h3>
            <p style={{ color: "#b91c1c", fontSize: "0.875rem", margin: 0 }}>
              You're an ideal candidate for NeuroSharp.
            </p>
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: "1rem",
            padding: "1.5rem 2rem",
            marginBottom: "1.25rem",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            border: "2px solid #93c5fd",
            backgroundImage: "linear-gradient(to bottom, #eff6ff, #fff)",
          }}
        >
          <p
            style={{
              textAlign: "center",
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "#2563eb",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              margin: "0 0 0.5rem 0",
            }}
          >
            Secure checkout
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: "1.5rem" }}>🛡️</span>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0, color: "#111827" }}>
              7-Day 100% Money-Back Guarantee
            </h2>
          </div>
          <p
            style={{
              textAlign: "center",
              color: "#374151",
              fontSize: "0.875rem",
              margin: "0 auto 1rem auto",
              maxWidth: "36rem",
              lineHeight: 1.5,
            }}
          >
            Try NeuroSharp risk-free. If you're not satisfied in the first 7 days, we'll refund every
            penny — no questions asked.
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.25rem 0" }}>
            {["Full refund within 7 days", "Secure payment via Cartpanda", "Instant access after payment"].map(
              (text) => (
                <li
                  key={text}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.375rem",
                    color: "#374151",
                    fontSize: "0.875rem",
                  }}
                >
                  <span style={{ color: "#059669", fontWeight: 700 }}>✓</span>
                  {text}
                </li>
              )
            )}
          </ul>
          <div style={{ textAlign: "center" }}>
            <a
              href="https://its-brazilian-llc.mycartpanda.com/checkout/208723849:1"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                width: "100%",
                maxWidth: "28rem",
                padding: "1rem 1.5rem",
                background: "linear-gradient(to right, #2563eb, #4f46e5)",
                color: "#fff",
                fontWeight: 700,
                fontSize: "1rem",
                textAlign: "center",
                textDecoration: "none",
                borderRadius: "0.75rem",
                boxShadow: "0 4px 14px rgba(37, 99, 235, 0.4)",
                minHeight: 52,
              }}
            >
              🧠 Go to Secure Checkout (Cartpanda)
            </a>
            <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.75rem" }}>
              You will be redirected to our secure payment page
            </p>
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: "1rem",
            padding: "1.5rem 2rem",
            marginBottom: "1.25rem",
            boxShadow: "0 4px 6px rgba(0,0,0,0.07)",
            border: "1px solid #e5e7eb",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: "0 0 1rem 0", color: "#111827" }}>
            📋 Your Personalized Recommendation
          </h2>
          {[
            {
              title: "90-Day Protocol",
              text: "Based on your age, symptoms, and goals, you're an ideal candidate for the full NeuroSharp protocol.",
            },
            {
              title: "Dr. Marcus AI Coach",
              text: "You'll benefit from 24/7 coaching with form correction and personalized tips.",
            },
            {
              title: "Adaptive Tracking",
              text: "The program will adjust difficulty in real time for maximum effectiveness.",
            },
          ].map((item) => (
            <div key={item.title} style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
              <span style={{ fontSize: "1.5rem" }}>✓</span>
              <div>
                <h3 style={{ fontWeight: 700, margin: "0 0 0.25rem 0", color: "#111827" }}>{item.title}</h3>
                <p style={{ fontSize: "0.875rem", color: "#4b5563", margin: 0, lineHeight: 1.5 }}>
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#6b7280", marginTop: "1.5rem" }}>
          Prévia. No app, esta tela aparece após completar o quiz em <strong>/quiz</strong>.
        </p>
      </div>
    </div>
  );
}
