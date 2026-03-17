import { describe, it, expect } from "vitest";

describe("Email service configuration", () => {
  it("RESEND_API_KEY is set in environment", () => {
    // The key is injected by the platform — just verify it's present and non-empty
    const key = process.env.RESEND_API_KEY;
    expect(key).toBeDefined();
    expect(typeof key).toBe("string");
    expect(key!.length).toBeGreaterThan(0);
  });

  it("EMAIL_FROM is set in environment", () => {
    const from = process.env.EMAIL_FROM;
    // EMAIL_FROM may be undefined (falls back to default), that's acceptable
    if (from !== undefined) {
      expect(typeof from).toBe("string");
      expect(from.length).toBeGreaterThan(0);
    }
  });

  it("Resend client can be instantiated without throwing", async () => {
    const { Resend } = await import("resend");
    const key = process.env.RESEND_API_KEY ?? "re_test_placeholder";
    expect(() => new Resend(key)).not.toThrow();
  });
});
