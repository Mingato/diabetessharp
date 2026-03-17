import { useState } from "react";
import { Link } from "react-router-dom";
import { trpc } from "../trpc";

export function ContactPage() {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("billing");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const submitMessage = trpc.support.submitMessage.useMutation({
    onSuccess: () => setSent(true),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMessage.mutate({ name, email, category, subject, message });
  };

  return (
    <div className="container" style={{ maxWidth: "480px", padding: "3rem 1.5rem 4rem" }}>
      <h1 style={{ fontFamily: "var(--font-serif)", marginBottom: "0.5rem" }}>Contact</h1>
      <p style={{ color: "var(--color-text-muted)", marginBottom: "2rem" }}>
        Questions about billing, technical or medical support? Send us a message.
      </p>

      {sent ? (
        <p style={{ color: "var(--color-success)" }}>Message sent. We'll respond within 4 business hours.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-input"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "var(--radius)", border: "1px solid var(--color-border)", background: "var(--color-bg)", color: "var(--color-text)" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "var(--radius)", border: "1px solid var(--color-border)", background: "var(--color-bg)", color: "var(--color-text)" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label className="form-label">Category</label>
            <select
              className="form-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "var(--radius)", border: "1px solid var(--color-border)", background: "var(--color-bg)", color: "var(--color-text)" }}
            >
              <option value="billing">Billing</option>
              <option value="technical">Technical</option>
              <option value="medical">Medical</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label className="form-label">Subject (optional)</label>
            <input
              type="text"
              className="form-input"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "var(--radius)", border: "1px solid var(--color-border)", background: "var(--color-bg)", color: "var(--color-text)" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label className="form-label">Message</label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "var(--radius)", border: "1px solid var(--color-border)", background: "var(--color-bg)", color: "var(--color-text)", fontFamily: "inherit" }}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitMessage.isPending}>
            {submitMessage.isPending ? "Sending..." : "Send"}
          </button>
        </form>
      )}

      <p style={{ marginTop: "2rem" }}>
        <Link to="/">← Back</Link>
      </p>
    </div>
  );
}
