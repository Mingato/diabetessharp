import { getDb } from "./db";
import { seedRecipes } from "./recipes-seed";

async function main() {
  const db = await getDb();
  if (!db) {
    console.error("No DB connection");
    process.exit(1);
  }
  await seedRecipes(db);
  console.log("Done!");
  process.exit(0);
}

main().catch(console.error);
