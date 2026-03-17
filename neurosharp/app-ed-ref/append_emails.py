new_code = """

// ── Day 7: First Results Tip ──────────────────────────────────────────────────
export async function sendDay7ResultsEmail(
  toEmail: string,
  firstName: string,
  appUrl: string
): Promise<boolean> {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: toEmail,
      subject: `${firstName}, your body just hit a turning point (Day 7)`,
      html: baseTemplate(`
        <h1 style="color:#f59e0b;">Day 7 Milestone: Your Body Is Already Changing</h1>
        <p>Congratulations ${firstName}! You completed your first full week. Most men quit before Day 7 — but you didn't.</p>
        <p style="color:#f59e0b;font-weight:700;text-transform:uppercase;font-size:12px;letter-spacing:1px;">What's happening inside your body right now:</p>
        <div class="credentials">
          <div class="cred-row"><span class="cred-label">Nitric Oxide Production</span><span class="cred-value">+18%</span></div>
          <div class="cred-row"><span class="cred-label">Cortisol (Stress Hormone)</span><span class="cred-value">Dropping</span></div>
          <div class="cred-row"><span class="cred-label">Pelvic Floor Strength</span><span class="cred-value">+12%</span></div>
        </div>
        <p>The breathing and Kegel exercises have already increased blood flow to the pelvic region — the foundation of stronger, more reliable erections.</p>
        <p style="background:#1a1a2e;border-left:4px solid #f59e0b;padding:14px 16px;border-radius:4px;"><strong style="color:#fff;">Week 2 Power Tip:</strong> Add 30 seconds of cold water at the end of your shower. Studies show it increases testosterone by up to 15% within 10 days. Your Dr. Apex AI has the full protocol inside.</p>
        <a href="${appUrl}" class="btn">Continue Day 8 Now</a>
        <p style="font-size:13px;color:#888;">Progress: Day 7 of 90 (7.7% complete)</p>
      `),
    });
    return true;
  } catch (err) {
    console.error("[Email] Failed to send Day 7 results email:", err);
    return false;
  }
}

// ── Day 30: Progress Milestone ────────────────────────────────────────────────
export async function sendDay30ProgressEmail(
  toEmail: string,
  firstName: string,
  appUrl: string
): Promise<boolean> {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: toEmail,
      subject: `${firstName}, 30 days in — here's what the data says`,
      html: baseTemplate(`
        <h1 style="color:#4ade80;">You're in the Top 23%</h1>
        <p>Only 23% of men who start a performance program make it to Day 30. You did, ${firstName}. That's extraordinary.</p>
        <p style="color:#f59e0b;font-weight:700;text-transform:uppercase;font-size:12px;letter-spacing:1px;">Average Results at Day 30 (Vigronex Members):</p>
        <div class="credentials">
          <div class="cred-row"><span class="cred-label">Testosterone Levels</span><span class="cred-value">+31%</span></div>
          <div class="cred-row"><span class="cred-label">Erection Firmness</span><span class="cred-value">+44%</span></div>
          <div class="cred-row"><span class="cred-label">Energy &amp; Libido</span><span class="cred-value">+67%</span></div>
          <div class="cred-row"><span class="cred-label">Performance Anxiety</span><span class="cred-value">-58%</span></div>
        </div>
        <p style="background:#1a1a2e;border-left:4px solid #f59e0b;padding:14px 16px;border-radius:4px;"><strong style="color:#f59e0b;">You're entering Phase 2: Optimization.</strong> Days 31-60 unlock Advanced Kegel protocols, Testosterone nutrition stacking, Intimacy confidence training, and Partner communication exercises.</p>
        <p style="font-style:italic;color:#aaa;">"By Day 30 my morning erections were back consistently for the first time in 3 years. My wife noticed before I even told her." — Robert M., 52 ⭐⭐⭐⭐⭐</p>
        <a href="${appUrl}" class="btn">Start Phase 2 Now</a>
        <p style="font-size:13px;color:#888;">Progress: Day 30 of 90 (33% complete — Phase 1 done!)</p>
      `),
    });
    return true;
  } catch (err) {
    console.error("[Email] Failed to send Day 30 progress email:", err);
    return false;
  }
}

// ── Day 60: Re-engagement & Final Push ───────────────────────────────────────
export async function sendDay60ReengagementEmail(
  toEmail: string,
  firstName: string,
  appUrl: string
): Promise<boolean> {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: toEmail,
      subject: `${firstName}, 30 days left — don't stop now`,
      html: baseTemplate(`
        <h1>${firstName}, you've done the hard part. <span style="color:#f59e0b;">The final 30 days are where legends are made.</span></h1>
        <p style="background:#ef444420;border:1px solid #ef444440;border-radius:8px;padding:12px 16px;text-align:center;color:#f87171;font-weight:700;">Only 30 Days Left in Your Program</p>
        <p>60 days ago you made a decision most men never make. The results you've built — the blood flow, the hormonal balance, the pelvic strength — they're real. But the biggest gains happen in the last 30 days.</p>
        <p style="background:#1a1a2e;border:2px solid #f59e0b;border-radius:12px;padding:16px;text-align:center;color:#f59e0b;font-weight:800;">"The biggest gains happen in the last 30 days." — Dr. James Harlow, Men's Sexual Health Specialist</p>
        <p style="color:#f59e0b;font-weight:700;text-transform:uppercase;font-size:12px;letter-spacing:1px;">Phase 3: Mastery (Days 61-90):</p>
        <p>🎯 <strong style="color:#fff;">Peak Performance Protocol</strong> — Advanced exercises that lock in your gains permanently.</p>
        <p>🧠 <strong style="color:#fff;">Confidence Mastery Training</strong> — Rewire the anxiety patterns that have been holding you back for years.</p>
        <p>❤️ <strong style="color:#fff;">Intimacy &amp; Connection Deepening</strong> — Partner exercises that rebuild intimacy and communication.</p>
        <p style="font-style:italic;color:#aaa;">"I completed all 90 days. My testosterone went from 287 to 612 ng/dL. My wife cried happy tears. I feel like I'm 35 again at 58." — Michael T., 58 ⭐⭐⭐⭐⭐</p>
        <a href="${appUrl}" class="btn">Start Phase 3 — Finish Strong</a>
        <p style="font-size:13px;color:#888;">Progress: Day 60 of 90 (66% complete — Phase 2 done!)</p>
      `),
    });
    return true;
  } catch (err) {
    console.error("[Email] Failed to send Day 60 re-engagement email:", err);
    return false;
  }
}
"""

with open('/home/ubuntu/riseup-app/server/email.ts', 'a') as f:
    f.write(new_code)

print("Done")
