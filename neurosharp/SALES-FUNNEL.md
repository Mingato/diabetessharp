# NeuroSharp — Sales Funnel Flow

## Flow order

1. **Advertorial** — Article / landing (awareness)
2. **Quiz** — Free assessment (lead)
3. **Payment** — Checkout via Cartpanda
4. **Email sent** — Welcome email with login + password + usage instructions
5. **Access to platform** — Login and use the app

---

## Initial link (start of the funnel)

Use this URL as the entry point for the sales funnel:

- **Root (recommended):** `https://your-domain.com/`
- **Direct to advertorial:** `https://your-domain.com/advertorial`

Both redirect to the Advertorial. From there the user clicks "Free Risk Check" (or similar CTA) and goes to the Quiz.

---

## Step-by-step URLs

| Step | URL | Description |
|------|-----|-------------|
| 1. Advertorial | `/` or `/advertorial` | First page; CTAs lead to Quiz |
| 2. Quiz | `/quiz` | Assessment; on completion → Checkout |
| 3. Payment | `/checkout` | Form + redirect to Cartpanda; after payment Cartpanda redirects to Success |
| 4. Success (email sent) | `/checkout/success?order={ORDER_ID}` | Credentials shown; welcome email sent to customer |
| 5. Platform | `/app` (after login) | Dashboard and full app |

---

## Cartpanda configuration

Configure Cartpanda so that after payment it redirects to:

- **Success URL:** `https://your-domain.com/checkout/success?order={ORDER_ID}`  
  (Replace `{ORDER_ID}` with the actual order ID parameter your payment system sends.)

Optionally configure the webhook to your backend so that payment confirmation and email sending can also be triggered server-side when the payment is completed.
