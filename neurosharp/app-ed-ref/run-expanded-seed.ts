import { seedExpandedArticles } from "./expanded-articles-seed";
import { getDb } from "./db";

async function main() {
  const db = await getDb();
  if (!db) {
    console.error("No database connection");
    process.exit(1);
  }
  await seedExpandedArticles(db);
  console.log("Expanded articles seeded successfully!");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
