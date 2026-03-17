import pg from "pg";
const { Pool } = pg;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || "postgresql://localhost:5432/neurosharp",
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});
export async function query(text, params) {
    return pool.query(text, params);
}
export { pool };
