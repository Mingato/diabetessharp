import pg from "pg";
import { ENV } from "../env.js";
const { Pool } = pg;
const pool = new Pool({
    connectionString: ENV.databaseUrl,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});
export async function query(text, params) {
    return pool.query(text, params);
}
export { pool };
