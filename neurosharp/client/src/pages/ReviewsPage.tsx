import { useState } from "react";
import { Link } from "react-router-dom";

const STARS = [5, 4, 3, 2, 1];
const TOTAL_REVIEWS = 12847;
const PER_PAGE = 12;

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateReviews(page: number) {
  const reviews: { id: number; name: string; score: number; before: number; after: number; text: string; date: string; helpful: number }[] = [];
  for (let i = 0; i < PER_PAGE; i++) {
    const id = page * PER_PAGE + i + 1;
    const seed = id * 7919;
    const names = ["João M.", "Rosa C.", "Antônio L.", "Maria S.", "Carlos P.", "Ana F.", "Paulo R.", "Lucia M."];
    reviews.push({
      id,
      name: names[Math.floor(seededRandom(seed) * names.length)] + " " + (45 + Math.floor(seededRandom(seed + 1) * 30)) + " anos",
      score: seededRandom(seed + 2) > 0.1 ? 5 : 4,
      before: 35 + Math.floor(seededRandom(seed + 3) * 25),
      after: 65 + Math.floor(seededRandom(seed + 4) * 25),
      text: "Excelente programa. Minha memória melhorou muito em poucas semanas. Recomendo.",
      date: "2025-" + String(Math.floor(seededRandom(seed + 5) * 3) + 1).padStart(2, "0") + "-" + String(Math.floor(seededRandom(seed + 6) * 28) + 1).padStart(2, "0"),
      helpful: Math.floor(seededRandom(seed + 7) * 50),
    });
  }
  return reviews;
}

export function ReviewsPage() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<number | null>(null);
  const reviews = generateReviews(page);
  const totalPages = Math.ceil(TOTAL_REVIEWS / PER_PAGE);

  return (
    <div className="container" style={{ padding: "2rem 1.5rem 4rem", maxWidth: "960px" }}>
      <h1 style={{ fontFamily: "var(--font-serif)", marginBottom: "0.5rem" }}>Avaliações</h1>
      <p style={{ color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
        {TOTAL_REVIEWS.toLocaleString("pt-BR")} avaliações
      </p>

      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
        <aside style={{ minWidth: "180px" }}>
          <h3 style={{ marginBottom: "0.75rem" }}>Filtrar por estrelas</h3>
          {STARS.map((s) => (
            <label key={s} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <input type="radio" name="stars" checked={filter === s} onChange={() => setFilter(s)} />
              {s} estrelas
            </label>
          ))}
        </aside>

        <div style={{ flex: 1 }}>
          {reviews.map((r) => (
            <div key={r.id} style={{ padding: "1rem 0", borderBottom: "1px solid var(--color-border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                <span style={{ fontWeight: 600 }}>{r.name}</span>
                <span style={{ color: "var(--color-text-muted)" }}>•</span>
                <span style={{ color: "var(--color-warning)" }}>{"★".repeat(r.score)}{"☆".repeat(5 - r.score)}</span>
              </div>
              <p style={{ margin: "0.25rem 0", fontSize: "0.9rem" }}>Memory Score: {r.before} → {r.after}</p>
              <p style={{ margin: "0.5rem 0" }}>{r.text}</p>
              <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>{r.date} • {r.helpful} úteis</p>
            </div>
          ))}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem" }}>
            <button
              type="button"
              className="btn btn-secondary"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Anterior
            </button>
            <span style={{ color: "var(--color-text-muted)" }}>Página {page} de {totalPages}</span>
            <button
              type="button"
              className="btn btn-secondary"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Próxima
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <Link to="/checkout" className="btn btn-primary">
          Começar NeuroSharp
        </Link>
      </div>
    </div>
  );
}
