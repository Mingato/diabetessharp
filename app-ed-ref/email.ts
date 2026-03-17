import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.EMAIL_FROM || "Vigronex <noreply@vigronex.com>";
const APP_NAME = "Vigronex";

// ── HTML Email Templates ──────────────────────────────────────────────────────

function baseTemplate(content: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { margin: 0; padding: 0; background: #0a0a0f; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .wrapper { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .card { background: #13131a; border: 1px solid #2a2a3a; border-radius: 16px; padding: 40px; }
    .logo { display: flex; align-items: center; gap: 12px; margin-bottom: 32px; }
    .logo-icon { width: 44px; height: 44px; background: #f59e0b; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; }
    .logo-text { font-size: 22px; font-weight: 700; color: #ffffff; }
    .logo-sub { font-size: 12px; color: #888; }
    h1 { color: #ffffff; font-size: 24px; font-weight: 700; margin: 0 0 16px; }
    p { color: #aaa; font-size: 15px; line-height: 1.6; margin: 0 0 16px; }
    .code { background: #1e1e2e; border: 2px solid #f59e0b; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
    .code span { font-size: 36px; font-weight: 800; color: #f59e0b; letter-spacing: 8px; }
    .btn { display: inline-block; background: #f59e0b; color: #000 !important; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 10px; text-decoration: none; margin: 24px 0; }
    .credentials { background: #1e1e2e; border: 1px solid #2a2a3a; border-radius: 12px; padding: 20px; margin: 24px 0; }
    .cred-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #2a2a3a; }
    .cred-row:last-child { border-bottom: none; }
    .cred-label { color: #888; font-size: 13px; }
    .cred-value { color: #f59e0b; font-weight: 600; font-size: 13px; font-family: monospace; }
    .footer { text-align: center; margin-top: 32px; color: #555; font-size: 12px; }
    .divider { border: none; border-top: 1px solid #2a2a3a; margin: 24px 0; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="logo">
        <div class="logo-icon">⚡</div>
        <div>
          <div class="logo-text">${APP_NAME}</div>
          <div class="logo-sub">Performance Program</div>
        </div>
      </div>
      ${content}
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
      <p>You received this email because you have an account with ${APP_NAME}.</p>
    </div>
  </div>
</body>
</html>`;
}

// ── Send Functions ────────────────────────────────────────────────────────────

export async function sendVerificationEmail(to: string, name: string, code: string): Promise<boolean> {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `${code} — Your ${APP_NAME} verification code`,
      html: baseTemplate(`
        <h1>Verify your email</h1>
        <p>Hi ${name || "there"}, welcome to ${APP_NAME}! Enter this code to verify your email address:</p>
        <div class="code"><span>${code}</span></div>
        <p>This code expires in <strong>15 minutes</strong>. If you didn't create an account, you can safely ignore this email.</p>
      `),
    });
    return true;
  } catch (err) {
    console.error("[Email] Failed to send verification email:", err);
    return false;
  }
}

export async function sendPasswordResetEmail(to: string, name: string, resetUrl: string): Promise<boolean> {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Reset your ${APP_NAME} password`,
      html: baseTemplate(`
        <h1>Reset your password</h1>
        <p>Hi ${name || "there"}, we received a request to reset your password. Click the button below to create a new password:</p>
        <a href="${resetUrl}" class="btn">Reset Password</a>
        <p>This link expires in <strong>1 hour</strong>. If you didn't request a password reset, you can safely ignore this email.</p>
        <hr class="divider">
        <p style="font-size:12px;color:#555;">If the button doesn't work, copy and paste this URL into your browser:<br>${resetUrl}</p>
      `),
    });
    return true;
  } catch (err) {
    console.error("[Email] Failed to send password reset email:", err);
    return false;
  }
}

export async function sendCredentialsEmail(to: string, name: string, login: string, password: string, appUrl: string): Promise<boolean> {
  const firstName = name || "Champion";
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `⚡ Welcome to Vigronex — Your Login & Password Inside`,
      html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="background:#13131a;border:1px solid #2a2a3a;border-radius:16px;overflow:hidden;">

      <!-- Header Logo -->
      <div style="padding:28px 32px 0;display:flex;align-items:center;gap:12px;">
        <div style="width:44px;height:44px;background:#f59e0b;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;">⚡</div>
        <div>
          <div style="font-size:20px;font-weight:700;color:#fff;">Vigronex</div>
          <div style="font-size:11px;color:#888;">Performance Program</div>
        </div>
      </div>

      <!-- Hero Banner -->
      <div style="margin:24px 32px 0;background:linear-gradient(135deg,#f59e0b 0%,#d97706 100%);border-radius:14px;padding:28px 24px;text-align:center;">
        <div style="font-size:44px;margin-bottom:8px;">🏆</div>
        <h1 style="color:#000;font-size:26px;font-weight:800;margin:0 0 8px;">You're In, ${firstName}!</h1>
        <p style="color:#1a1a1a;font-size:15px;margin:0;font-weight:600;">Your 90-Day Male Performance Program starts NOW</p>
      </div>

      <!-- Body -->
      <div style="padding:28px 32px;">
        <p style="color:#ccc;font-size:15px;line-height:1.7;margin:0 0 24px;">Congratulations on taking the most important step toward reclaiming your confidence, energy, and performance. Thousands of men over 40 have already transformed their lives with Vigronex — and now it's your turn.</p>

        <!-- Credentials Box -->
        <div style="background:#1a1a2e;border:2px solid #f59e0b;border-radius:14px;padding:24px;margin-bottom:24px;">
          <p style="color:#f59e0b;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;margin:0 0 16px;">🔐 Your Login Credentials</p>
          <table style="width:100%;border-collapse:collapse;">
            <tr style="border-bottom:1px solid #2a2a3a;">
              <td style="padding:12px 0;color:#888;font-size:14px;">Email / Username</td>
              <td style="padding:12px 0;color:#f59e0b;font-weight:700;font-size:14px;font-family:monospace;text-align:right;">${login}</td>
            </tr>
            <tr>
              <td style="padding:12px 0;color:#888;font-size:14px;">Temporary Password</td>
              <td style="padding:12px 0;color:#f59e0b;font-weight:700;font-size:18px;font-family:monospace;text-align:right;letter-spacing:2px;">${password}</td>
            </tr>
          </table>
        </div>

        <!-- Security Tip -->
        <div style="background:#1e1e2e;border-left:4px solid #f59e0b;border-radius:4px;padding:14px 16px;margin-bottom:28px;">
          <p style="color:#aaa;font-size:13px;margin:0;">🔒 <strong style="color:#fff;">Security tip:</strong> After your first login, go to <strong style="color:#f59e0b;">Settings → Change Password</strong> to set your personal password.</p>
        </div>

        <!-- CTA Button -->
        <div style="text-align:center;margin-bottom:28px;">
          <a href="${appUrl}" style="display:inline-block;background:linear-gradient(135deg,#f59e0b,#d97706);color:#000;font-weight:800;font-size:17px;padding:18px 44px;border-radius:12px;text-decoration:none;letter-spacing:0.5px;">🚀 Access My Program Now</a>
          <p style="color:#555;font-size:12px;margin-top:10px;">Or copy this link: <span style="color:#f59e0b;">${appUrl}</span></p>
        </div>

        <hr style="border:none;border-top:1px solid #2a2a3a;margin:0 0 24px;" />

        <!-- What's Inside -->
        <p style="color:#f59e0b;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;margin:0 0 16px;">🎯 What's Waiting For You Inside</p>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
          <tr>
            <td style="padding:7px 0;color:#ccc;font-size:14px;">✅ 90-Day Structured Program</td>
            <td style="padding:7px 0;color:#ccc;font-size:14px;">✅ Daily Exercise Routines</td>
          </tr>
          <tr>
            <td style="padding:7px 0;color:#ccc;font-size:14px;">✅ Dr. Apex AI Coach (24/7)</td>
            <td style="padding:7px 0;color:#ccc;font-size:14px;">✅ Nutrition & Supplement Guide</td>
          </tr>
          <tr>
            <td style="padding:7px 0;color:#ccc;font-size:14px;">✅ Progress Tracking</td>
            <td style="padding:7px 0;color:#ccc;font-size:14px;">✅ Intimacy & Romance Plans</td>
          </tr>
          <tr>
            <td style="padding:7px 0;color:#ccc;font-size:14px;">✅ Weekly Check-ins</td>
            <td style="padding:7px 0;color:#ccc;font-size:14px;">✅ Community Support</td>
          </tr>
        </table>

        <!-- Guarantee -->
        <div style="background:#0f1f0f;border:1px solid #1a4a1a;border-radius:12px;padding:16px 20px;margin-bottom:24px;text-align:center;">
          <p style="color:#4ade80;font-size:14px;font-weight:700;margin:0 0 4px;">🛡️ 7-Day Money-Back Guarantee</p>
          <p style="color:#888;font-size:12px;margin:0;">If you're not satisfied within 7 days, we'll refund you 100% — no questions asked.</p>
        </div>

        <hr style="border:none;border-top:1px solid #2a2a3a;margin:0 0 20px;" />

        <!-- Support -->
        <p style="color:#666;font-size:13px;text-align:center;margin:0;">Questions? Reply to this email or contact <a href="mailto:support@vigronex.com" style="color:#f59e0b;">support@vigronex.com</a></p>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align:center;margin-top:24px;color:#444;font-size:12px;">
      <p style="margin:0 0 4px;">© ${new Date().getFullYear()} Vigronex. All rights reserved.</p>
      <p style="margin:0;">You received this email because you purchased a Vigronex subscription.</p>
    </div>
  </div>
</body>
</html>`,
    });
    return true;
  } catch (err) {
    console.error("[Email] Failed to send credentials email:", err);
    return false;
  }
}

export async function sendPaymentReminderEmail(to: string, name: string, checkoutUrl: string): Promise<boolean> {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Complete your ${APP_NAME} subscription`,
      html: baseTemplate(`
        <h1>Your program is waiting ⚡</h1>
        <p>Hi ${name || "there"}, you started the ${APP_NAME} journey but haven't completed your subscription yet.</p>
        <p>Thousands of men are already seeing results with our 90-day science-backed program. Don't let this opportunity pass.</p>
        <a href="${checkoutUrl}" class="btn">Activate My Program</a>
        <p style="font-size:13px;color:#888;">✅ 7-day money-back guarantee &nbsp; ✅ Cancel anytime &nbsp; ✅ Instant access</p>
      `),
    });
    return true;
  } catch (err) {
    console.error("[Email] Failed to send payment reminder email:", err);
    return false;
  }
}

export async function sendCustomAdminEmail(to: string, subject: string, htmlBody: string): Promise<boolean> {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html: baseTemplate(htmlBody),
    });
    return true;
  } catch (err) {
    console.error("[Email] Failed to send custom admin email:", err);
    return false;
  }
}

// ── Day 3 Follow-Up Email ─────────────────────────────────────────────────────

export async function sendDay3FollowUpEmail(to: string, name: string): Promise<boolean> {
  const appUrl = "https://vigronex.com/app";
  const firstName = name?.split(" ")[0] || "there";
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `${firstName}, how are your first 3 days going? 💪`,
      html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="background:#13131a;border:1px solid #2a2a3a;border-radius:16px;padding:40px;">
      <!-- Logo -->
      <div style="margin-bottom:32px;">
        <div style="display:inline-block;width:44px;height:44px;background:#f59e0b;border-radius:12px;text-align:center;line-height:44px;font-size:22px;vertical-align:middle;">⚡</div>
        <div style="display:inline-block;vertical-align:middle;margin-left:12px;">
          <div style="font-size:20px;font-weight:700;color:#ffffff;">Vigronex</div>
          <div style="font-size:11px;color:#888;">Performance Program</div>
        </div>
      </div>
      <!-- Hero -->
      <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);border:1px solid #2a2a3a;border-radius:12px;padding:28px;margin-bottom:28px;text-align:center;">
        <div style="font-size:48px;margin-bottom:12px;">🏆</div>
        <h1 style="color:#f59e0b;font-size:26px;font-weight:800;margin:0 0 8px;">Day 3 Check-In</h1>
        <p style="color:#ccc;font-size:16px;margin:0;">You've completed your first 3 days, ${firstName}!</p>
      </div>
      <!-- Message -->
      <p style="color:#aaa;font-size:15px;line-height:1.7;margin:0 0 20px;">
        Hi ${firstName}, this is Dr. Apex checking in on your progress. 3 days in — that's when most men start <strong style="color:#fff;">feeling the first subtle shifts</strong> in energy and focus.
      </p>
      <p style="color:#aaa;font-size:15px;line-height:1.7;margin:0 0 24px;">
        The science is clear: the first 7 days are the most critical for building the habits that will carry you through all 90 days. <strong style="color:#f59e0b;">Don't break the streak now.</strong>
      </p>
      <!-- Progress Milestones -->
      <div style="background:#1a1a2e;border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="color:#f59e0b;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;margin:0 0 16px;">📊 Your 90-Day Journey</p>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #2a2a3a;">
              <span style="color:#4ade80;font-weight:700;">✅ Days 1-3</span>
              <span style="color:#888;font-size:13px;margin-left:8px;">Foundation &amp; Habit Building</span>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #2a2a3a;">
              <span style="color:#f59e0b;font-weight:700;">🔥 Days 4-14</span>
              <span style="color:#888;font-size:13px;margin-left:8px;">Circulation Boost &amp; Energy Surge</span>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #2a2a3a;">
              <span style="color:#888;font-weight:700;">⚡ Days 15-30</span>
              <span style="color:#888;font-size:13px;margin-left:8px;">Hormonal Optimization Begins</span>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 0;">
              <span style="color:#888;font-weight:700;">🏆 Days 31-90</span>
              <span style="color:#888;font-size:13px;margin-left:8px;">Full Transformation &amp; Peak Performance</span>
            </td>
          </tr>
        </table>
      </div>
      <!-- Today's Focus -->
      <div style="background:#0f1a0f;border:1px solid #1a4a1a;border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="color:#4ade80;font-size:14px;font-weight:700;margin:0 0 12px;">🎯 Today's Focus: Day 4 Protocol</p>
        <ul style="color:#aaa;font-size:14px;line-height:1.8;margin:0;padding-left:20px;">
          <li>Complete your <strong style="color:#fff;">Kegel exercise set</strong> (3 sets × 10 reps)</li>
          <li>Try the <strong style="color:#fff;">4-7-8 breathing technique</strong> for 5 minutes</li>
          <li>Log your energy level in the app</li>
          <li>Read today's nutrition tip from Dr. Apex</li>
        </ul>
      </div>
      <!-- CTA -->
      <div style="text-align:center;margin-bottom:28px;">
        <a href="${appUrl}" style="display:inline-block;background:linear-gradient(135deg,#f59e0b,#d97706);color:#000;font-weight:800;font-size:17px;padding:18px 44px;border-radius:12px;text-decoration:none;letter-spacing:0.5px;">🚀 Continue My Program</a>
      </div>
      <!-- Testimonial -->
      <div style="background:#1e1e2e;border-left:4px solid #f59e0b;border-radius:4px;padding:16px 20px;margin-bottom:24px;">
        <p style="color:#ccc;font-size:14px;font-style:italic;margin:0 0 8px;">"By day 7, I was waking up with energy I hadn't felt in years. By day 30, my wife noticed the difference before I even told her about the program."</p>
        <p style="color:#888;font-size:12px;margin:0;">— Marcus T., 52, verified Vigronex member</p>
      </div>
      <hr style="border:none;border-top:1px solid #2a2a3a;margin:0 0 20px;" />
      <p style="color:#666;font-size:13px;text-align:center;margin:0;">Questions? Reply to this email or contact <a href="mailto:support@vigronex.com" style="color:#f59e0b;">support@vigronex.com</a></p>
    </div>
    <div style="text-align:center;margin-top:24px;color:#444;font-size:12px;">
      <p style="margin:0 0 4px;">© ${new Date().getFullYear()} Vigronex. All rights reserved.</p>
      <p style="margin:0;">You received this because you're a Vigronex member. <a href="#" style="color:#666;">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>`,
    });
    return true;
  } catch (err) {
    console.error("[Email] Failed to send Day 3 follow-up email:", err);
    return false;
  }
}

// ── Day 1 Upsell Recovery Email ───────────────────────────────────────────────
// Sent ~24h after purchase to offer skipped upsells
export async function sendDay1UpsellRecoveryEmail(
  toEmail: string,
  firstName: string,
  orderId: number,
  skippedUpsells: { upsell1: boolean; upsell2: boolean; upsell3: boolean },
  origin: string
): Promise<boolean> {
  try {
    const skipped = [];
    if (skippedUpsells.upsell1) skipped.push({
      icon: "🩺",
      name: "Dr. Apex — Médico Pessoal 24h",
      desc: "Acesso ilimitado ao seu médico de performance pessoal. Tire dúvidas sobre saúde sexual, ajuste seu protocolo e receba orientações médicas personalizadas a qualquer hora.",
      price: "$14.99",
      originalPrice: "$97.00",
      url: `${origin}/checkout/upsell1?order=${orderId}&recovery=1`,
      cta: "Ativar Dr. Apex Agora",
    });
    if (skippedUpsells.upsell2) skipped.push({
      icon: "💋",
      name: "Sofia — Assistente de Fantasias",
      desc: "Sua guia pessoal de intimidade. Sofia entende seus desejos, ajuda a reconectar com sua parceira e transforma sua vida íntima com conversas sem julgamento.",
      price: "$16.99",
      originalPrice: "$127.00",
      url: `${origin}/checkout/upsell2?order=${orderId}&recovery=1`,
      cta: "Conhecer a Sofia Agora",
    });
    if (skippedUpsells.upsell3) skipped.push({
      icon: "🥩",
      name: "Testosterone Boost Recipe Bible",
      desc: "87 receitas científicas que disparam sua testosterona naturalmente. Cada refeição foi formulada para maximizar produção hormonal e potencializar seus resultados.",
      price: "$9.99",
      originalPrice: "$47.00",
      url: `${origin}/checkout/upsell3?order=${orderId}&recovery=1`,
      cta: "Pegar as Receitas Agora",
    });

    if (skipped.length === 0) return true; // nothing to offer

    const offersHtml = skipped.map(offer => `
      <div style="background:#13131a;border:1px solid #2a2a3a;border-radius:14px;padding:24px;margin-bottom:20px;">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
          <span style="font-size:28px;">${offer.icon}</span>
          <div>
            <p style="color:#f59e0b;font-weight:800;font-size:16px;margin:0;">${offer.name}</p>
            <div style="display:flex;align-items:center;gap:8px;margin-top:4px;">
              <span style="color:#666;font-size:13px;text-decoration:line-through;">${offer.originalPrice}</span>
              <span style="color:#f59e0b;font-weight:800;font-size:18px;">${offer.price}</span>
              <span style="background:#16a34a20;color:#4ade80;font-size:11px;font-weight:700;padding:2px 8px;border-radius:20px;">OFERTA ESPECIAL</span>
            </div>
          </div>
        </div>
        <p style="color:#aaa;font-size:14px;line-height:1.6;margin:0 0 16px;">${offer.desc}</p>
        <div style="text-align:center;">
          <a href="${offer.url}" style="display:inline-block;background:linear-gradient(135deg,#f59e0b,#d97706);color:#000;font-weight:800;font-size:14px;padding:14px 32px;border-radius:10px;text-decoration:none;">${offer.cta} →</a>
        </div>
      </div>
    `).join("");

    await resend.emails.send({
      from: FROM_EMAIL,
      to: toEmail,
      subject: `${firstName}, você esqueceu algo importante no seu pedido ⚡`,
      html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <!-- Header -->
    <div style="background:#13131a;border:1px solid #2a2a3a;border-radius:16px;padding:32px;margin-bottom:20px;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:28px;">
        <div style="width:44px;height:44px;background:#f59e0b;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;">⚡</div>
        <div>
          <div style="font-size:20px;font-weight:700;color:#fff;">Vigronex</div>
          <div style="font-size:11px;color:#888;">Performance Program</div>
        </div>
      </div>
      <!-- Urgency badge -->
      <div style="background:#ef444420;border:1px solid #ef444440;border-radius:8px;padding:10px 16px;text-align:center;margin-bottom:20px;">
        <p style="color:#f87171;font-weight:700;font-size:13px;margin:0;">⏰ OFERTA EXPIRA EM 24 HORAS — Apenas para membros Vigronex</p>
      </div>
      <h1 style="color:#fff;font-size:22px;font-weight:800;margin:0 0 12px;line-height:1.3;">${firstName}, você deixou ferramentas poderosas na mesa ontem</h1>
      <p style="color:#aaa;font-size:15px;line-height:1.6;margin:0 0 20px;">
        Você deu o primeiro passo certo ao entrar para o Vigronex. Mas enquanto você estava no checkout, havia <strong style="color:#f59e0b;">${skipped.length} recurso${skipped.length > 1 ? "s" : ""} extra${skipped.length > 1 ? "s" : ""}</strong> que poderiam acelerar seus resultados em até 3x — e você passou direto.
      </p>
      <p style="color:#aaa;font-size:15px;line-height:1.6;margin:0 0 28px;">
        Estou te dando uma segunda chance com o mesmo preço especial de lançamento. <strong style="color:#fff;">Mas só por mais 24 horas.</strong>
      </p>
      ${offersHtml}
      <hr style="border:none;border-top:1px solid #2a2a3a;margin:24px 0;" />
      <p style="color:#666;font-size:13px;text-align:center;margin:0;">Dúvidas? <a href="mailto:support@vigronex.com" style="color:#f59e0b;">support@vigronex.com</a></p>
    </div>
    <div style="text-align:center;color:#444;font-size:12px;">
      <p style="margin:0 0 4px;">© ${new Date().getFullYear()} Vigronex. All rights reserved.</p>
      <p style="margin:0;">Você recebeu este email porque é membro Vigronex. <a href="#" style="color:#666;">Cancelar inscrição</a></p>
    </div>
  </div>
</body>
</html>`,
    });
    return true;
  } catch (err) {
    console.error("[Email] Failed to send Day 1 upsell recovery email:", err);
    return false;
  }
}
