/**
 * Welcome email with personalized login/password and first-time usage instructions.
 * Sent after purchase when the user account is created.
 */
import { Resend } from "resend";
const APP_NAME = "NeuroSharp";
const FROM_EMAIL = process.env.EMAIL_FROM || `${APP_NAME} <noreply@neurosharp.com>`;
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
/**
 * Sends welcome email with login credentials and instructions for first-time access.
 * Returns true if sent, false if skipped (no API key) or failed.
 */
export async function sendWelcomeWithCredentials(params) {
    const { to, firstName, login, password, appUrl } = params;
    if (!resend) {
        console.warn("[Email] RESEND_API_KEY not set — skipping welcome email");
        return false;
    }
    const name = firstName || "there";
    const loginUrl = appUrl.replace(/\/$/, "") + "/login";
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#0a0b12;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="background:#161a2a;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">

      <!-- Header -->
      <div style="padding:28px 32px 0;display:flex;align-items:center;gap:12px;">
        <div style="width:44px;height:44px;background:linear-gradient(135deg,#eab308,#f59e0b);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;">🧠</div>
        <div>
          <div style="font-size:20px;font-weight:700;color:#f4f5f9;">${APP_NAME}</div>
          <div style="font-size:11px;color:#8b92ab;">Cognitive Health & Memory Program</div>
        </div>
      </div>

      <!-- Welcome Banner -->
      <div style="margin:24px 32px 0;background:linear-gradient(135deg,#eab308 0%,#f59e0b 50%,#fbbf24 100%);border-radius:14px;padding:28px 24px;text-align:center;">
        <div style="font-size:44px;margin-bottom:8px;">🎉</div>
        <h1 style="color:#0a0b12;font-size:26px;font-weight:800;margin:0 0 8px;">Welcome, ${name}!</h1>
        <p style="color:#1a1a1a;font-size:15px;margin:0;font-weight:600;">Your 90-Day Memory & Cognitive Program starts now</p>
      </div>

      <!-- Body -->
      <div style="padding:28px 32px;">
        <p style="color:#8b92ab;font-size:15px;line-height:1.7;margin:0 0 24px;">Thank you for joining NeuroSharp. Your account has been created. Use the credentials below to access the platform for the first time.</p>

        <!-- Credentials Box -->
        <div style="background:#1a1d2e;border:2px solid #eab308;border-radius:14px;padding:24px;margin-bottom:24px;">
          <p style="color:#eab308;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;margin:0 0 16px;">🔐 Your login credentials</p>
          <table style="width:100%;border-collapse:collapse;">
            <tr style="border-bottom:1px solid rgba(255,255,255,0.08);">
              <td style="padding:12px 0;color:#8b92ab;font-size:14px;">Email / Username</td>
              <td style="padding:12px 0;color:#eab308;font-weight:700;font-size:14px;font-family:monospace;text-align:right;">${login}</td>
            </tr>
            <tr>
              <td style="padding:12px 0;color:#8b92ab;font-size:14px;">Password</td>
              <td style="padding:12px 0;color:#eab308;font-weight:700;font-size:16px;font-family:monospace;text-align:right;letter-spacing:1px;">${password}</td>
            </tr>
          </table>
          <p style="color:#5c6480;font-size:12px;margin:16px 0 0;">Save these in a safe place. You will need them every time you log in.</p>
        </div>

        <!-- First-time instructions -->
        <div style="background:#1e1e2e;border-left:4px solid #eab308;border-radius:4px;padding:16px 20px;margin-bottom:28px;">
          <p style="color:#eab308;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;">📋 How to access the platform (first time)</p>
          <ol style="color:#8b92ab;font-size:14px;line-height:1.9;margin:0;padding-left:20px;">
            <li>Click the button below or go to: <a href="${loginUrl}" style="color:#eab308;">${loginUrl}</a></li>
            <li>Enter your <strong style="color:#f4f5f9;">Email/Username</strong> and <strong style="color:#f4f5f9;">Password</strong> from the box above.</li>
            <li>After logging in, you’ll see your <strong style="color:#f4f5f9;">Dashboard</strong> with today’s program and your cognitive score.</li>
            <li>Use the sidebar or bottom menu to open <strong style="color:#f4f5f9;">Exercises</strong> (daily memory exercises), <strong style="color:#f4f5f9;">Dr. Marcus</strong> (AI coach), <strong style="color:#f4f5f9;">Nutrition</strong>, and <strong style="color:#f4f5f9;">Sofia</strong> (memory recall practice).</li>
            <li>We recommend doing at least one exercise and checking in with Dr. Marcus on your first day.</li>
          </ol>
        </div>

        <!-- CTA -->
        <div style="text-align:center;margin-bottom:28px;">
          <a href="${loginUrl}" style="display:inline-block;background:linear-gradient(135deg,#eab308,#f59e0b);color:#0a0b12;font-weight:800;font-size:17px;padding:18px 44px;border-radius:12px;text-decoration:none;">Access NeuroSharp now</a>
          <p style="color:#5c6480;font-size:12px;margin-top:12px;">Or copy this link: ${loginUrl}</p>
        </div>

        <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:0 0 24px;" />

        <!-- What's inside -->
        <p style="color:#eab308;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;">What’s inside your program</p>
        <ul style="color:#8b92ab;font-size:14px;line-height:1.8;margin:0 0 24px;padding-left:20px;">
          <li>Daily memory exercises (about 15 min/day)</li>
          <li>Dr. Marcus — AI coach available 24/7</li>
          <li>Progress tracking and weekly report</li>
          <li>Sofia — practice recalling memories with gentle hints</li>
          <li>Brain-friendly nutrition, recipes, and shopping list</li>
          <li>Photo-based “Remember where you put things” tool</li>
          <li>Learn library and settings (theme, text size)</li>
        </ul>

        <!-- Security -->
        <p style="color:#5c6480;font-size:13px;margin:0;">🔒 For security, consider changing your password after first login in <strong>Settings</strong>.</p>
      </div>
    </div>

    <div style="text-align:center;margin-top:24px;color:#5c6480;font-size:12px;">
      <p style="margin:0 0 4px;">© ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
      <p style="margin:0;">You received this email because you purchased a NeuroSharp subscription.</p>
    </div>
  </div>
</body>
</html>`;
    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject: `Welcome to ${APP_NAME} — Your login and how to get started`,
            html,
        });
        return true;
    }
    catch (err) {
        console.error("[Email] Failed to send welcome email:", err);
        return false;
    }
}
