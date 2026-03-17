/**
 * Creates a test user so you can access the app without going through checkout.
 * Run from repo root: npm run db:seed
 * Then go to /login and use:
 *   Email: test@neurosharp.com
 *   Password: test1234
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { query } from "./client.js";
const TEST_EMAIL = "test@neurosharp.com";
const TEST_PASSWORD = "test1234";
async function seed() {
    const hash = await bcrypt.hash(TEST_PASSWORD, 10);
    const result = await query(`INSERT INTO users (email, password_hash, role) VALUES ($1, $2, 'user')
     ON CONFLICT (email) DO UPDATE SET password_hash = $2 RETURNING id`, [TEST_EMAIL, hash]);
    const userId = result.rows[0].id;
    const today = new Date().toISOString().slice(0, 10);
    await query(`INSERT INTO cognitive_progress ("userId", date, "cognitiveScore", "memoryScore", "processingSpeed", "attentionScore", "dailyStreak", "phaseNumber")
     VALUES ($1, $2, 55, 55, 55, 55, 3, 1)
     ON CONFLICT ("userId", date) DO UPDATE SET "cognitiveScore" = 55, "dailyStreak" = 3`, [userId, today]);
    console.log("\n✅ Test user ready. Use these credentials to access the app:\n");
    console.log("   URL:      http://localhost:5173/login");
    console.log("   Email:    " + TEST_EMAIL);
    console.log("   Password: " + TEST_PASSWORD);
    console.log("\n   After login you will be redirected to: http://localhost:5173/app/dashboard\n");
    process.exit(0);
}
seed().catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
});
