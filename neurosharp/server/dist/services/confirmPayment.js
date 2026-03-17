import bcrypt from "bcryptjs";
import { query } from "../db/client.js";
import { sendWelcomeWithCredentials } from "./email.js";
function generatePassword() {
    const chars = "abcdefghijkmnpqrstuvwxyz23456789";
    let s = "";
    for (let i = 0; i < 10; i++)
        s += chars[Math.floor(Math.random() * chars.length)];
    return s;
}
import { ENV } from "../env.js";
/**
 * Confirms payment: creates user with login/password, updates order, and sends
 * welcome email with credentials and first-time usage instructions.
 * Used by Cartpanda webhook and confirmCarpandaPayment (tRPC).
 */
export async function confirmPayment(orderId) {
    const orderRow = await query(`SELECT id, status, email, "firstName" FROM funnel_orders WHERE id = $1`, [orderId]);
    const order = orderRow.rows[0];
    if (!order)
        return { ok: false };
    if (order.status === "paid")
        return { ok: true };
    const pass = generatePassword();
    const login = `neurosharp_${orderId}`;
    const hash = await bcrypt.hash(pass, 10);
    const userIns = await query(`INSERT INTO users (email, password_hash, role) VALUES ($1, $2, 'user')
     ON CONFLICT (email) DO UPDATE SET password_hash = $2 RETURNING id`, [login, hash]);
    const userId = userIns.rows[0].id;
    await query(`UPDATE funnel_orders SET status = 'paid', "generatedLogin" = $1, "credentialsSent" = 1, "userId" = $2 WHERE id = $3`, [JSON.stringify({ email: login, password: pass }), userId, orderId]);
    // Send welcome email with login/password and usage instructions to customer
    const customerEmail = order.email?.trim() || null;
    if (customerEmail) {
        await sendWelcomeWithCredentials({
            to: customerEmail,
            firstName: order.firstName?.trim() || "there",
            login,
            password: pass,
            appUrl: ENV.appUrl,
        });
    }
    return { ok: true, login, password: pass };
}
