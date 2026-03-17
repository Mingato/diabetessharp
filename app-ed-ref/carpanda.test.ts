import { describe, expect, it } from "vitest";
import { CARPANDA_LINKS, buildCarpandaUrl } from "../shared/carpanda";

describe("Carpanda config", () => {
  it("has all required product keys", () => {
    expect(CARPANDA_LINKS).toHaveProperty("main");
    expect(CARPANDA_LINKS).toHaveProperty("mainDiscount");
    expect(CARPANDA_LINKS).toHaveProperty("recipeBump");
    expect(CARPANDA_LINKS).toHaveProperty("upsell1");
    expect(CARPANDA_LINKS).toHaveProperty("upsell2");
    expect(CARPANDA_LINKS).toHaveProperty("upsell3");
  });

  it("buildCarpandaUrl appends order tracking params", () => {
    const url = buildCarpandaUrl("upsell1", 42, "test@example.com", "John");
    expect(url).toContain("order=42");
    expect(url).toContain("email=test%40example.com");
    expect(url).toContain("name=John");
    expect(url).not.toContain("bump=1");
  });

  it("buildCarpandaUrl includes bump param when set", () => {
    const url = buildCarpandaUrl("main", 10, "a@b.com", "Mike", true);
    expect(url).toContain("bump=1");
  });

  it("buildCarpandaUrl handles base URL with existing query string", () => {
    // Even if the placeholder has a '?', it should still append correctly
    const url = buildCarpandaUrl("main", 1, "x@y.com", "Bob");
    // Should not double '?'
    const questionMarks = (url.match(/\?/g) || []).length;
    expect(questionMarks).toBeLessThanOrEqual(1);
  });
});
